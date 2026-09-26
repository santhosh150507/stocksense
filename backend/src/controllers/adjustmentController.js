const db = require('../config/db');
const StockAdjustment = require('../models/StockAdjustment');
const StockLevel = require('../models/StockLevel');
const { applyStockMovement } = require('../services/stockEngine');

const adjustmentController = {
  /**
   * List all adjustments
   */
  async getAllAdjustments(req, res, next) {
    try {
      const { status, search } = req.query;
      const adjustments = await StockAdjustment.findAll({ status, search });
      return res.status(200).json(adjustments);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get adjustment by ID
   */
  async getAdjustmentById(req, res, next) {
    try {
      const { id } = req.params;
      const adjustment = await StockAdjustment.findById(id);
      if (!adjustment) {
        return res.status(404).json({ error: 'Adjustment document not found.' });
      }
      return res.status(200).json(adjustment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new inventory adjustment (auto calculates delta: counted - recorded)
   */
  async createAdjustment(req, res, next) {
    try {
      const {
        product_id,
        location_id,
        counted_qty,
        reason,
        date
      } = req.body;
      let { adjustment_number, recorded_qty } = req.body;

      if (!product_id || !location_id || counted_qty === undefined || counted_qty === null) {
        return res.status(400).json({
          error: 'product_id, location_id, and counted_qty are required.'
        });
      }

      const pId = parseInt(product_id, 10);
      const lId = parseInt(location_id, 10);
      const counted = parseInt(counted_qty, 10);

      // If recorded_qty is not explicitly passed, retrieve current stock level
      if (recorded_qty === undefined || recorded_qty === null) {
        const currentStock = await StockLevel.findByProductAndLocation(pId, lId);
        recorded_qty = currentStock ? currentStock.quantity : 0;
      } else {
        recorded_qty = parseInt(recorded_qty, 10);
      }

      // Auto compute delta = counted - recorded
      const delta = counted - recorded_qty;

      if (!adjustment_number) {
        adjustment_number = `ADJ-${Date.now().toString().slice(-6)}`;
      }

      const userId = req.user ? req.user.id : null;

      const adjustment = await StockAdjustment.create({
        adjustment_number,
        product_id: pId,
        location_id: lId,
        recorded_qty,
        counted_qty: counted,
        delta,
        status: 'Draft',
        date: date || new Date(),
        reason,
        created_by: userId
      });

      return res.status(201).json(adjustment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update draft adjustment
   */
  async updateAdjustment(req, res, next) {
    try {
      const { id } = req.params;
      const adjustment = await StockAdjustment.findById(id);
      if (!adjustment) {
        return res.status(404).json({ error: 'Adjustment document not found.' });
      }

      if (adjustment.status === 'Done' || adjustment.status === 'Canceled') {
        return res.status(400).json({
          error: `Cannot update an adjustment with status '${adjustment.status}'.`
        });
      }

      const { product_id, location_id, recorded_qty, counted_qty, date, reason, status } = req.body;

      const pId = product_id !== undefined ? parseInt(product_id, 10) : adjustment.product_id;
      const lId = location_id !== undefined ? parseInt(location_id, 10) : adjustment.location_id;
      const rec = recorded_qty !== undefined ? parseInt(recorded_qty, 10) : adjustment.recorded_qty;
      const cnt = counted_qty !== undefined ? parseInt(counted_qty, 10) : adjustment.counted_qty;
      const delta = cnt - rec;

      const updated = await StockAdjustment.update(id, {
        product_id: pId,
        location_id: lId,
        recorded_qty: rec,
        counted_qty: cnt,
        delta,
        date,
        reason,
        status
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validate adjustment: updates inventory level using stockEngine and marks as Done
   */
  async validateAdjustment(req, res, next) {
    try {
      const { id } = req.params;
      const adjustment = await StockAdjustment.findById(id);
      if (!adjustment) {
        return res.status(404).json({ error: 'Adjustment document not found.' });
      }

      if (adjustment.status === 'Done') {
        return res.status(400).json({ error: 'Adjustment is already validated.' });
      }

      if (adjustment.status === 'Canceled') {
        return res.status(400).json({ error: 'Cannot validate a canceled adjustment.' });
      }

      const userId = req.user ? req.user.id : null;

      const result = await db.transaction(async (client) => {
        // Apply adjustment delta to stock_levels and write to stock_ledger
        await applyStockMovement({
          entryType: 'adjustment',
          productId: adjustment.product_id,
          toLocationId: adjustment.location_id,
          qtyDelta: adjustment.delta,
          refType: 'stock_adjustment',
          refId: adjustment.adjustment_number,
          userId,
          client
        });

        const updated = await StockAdjustment.updateStatus(id, 'Done', client);
        return updated;
      });

      return res.status(200).json({
        message: 'Adjustment validated and inventory updated successfully.',
        adjustment: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adjustmentController;
