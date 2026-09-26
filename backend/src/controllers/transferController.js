const db = require('../config/db');
const InternalTransfer = require('../models/InternalTransfer');
const { applyStockMovement } = require('../services/stockEngine');

const transferController = {
  /**
   * List all internal transfers
   */
  async getAllTransfers(req, res, next) {
    try {
      const { status, search } = req.query;
      const transfers = await InternalTransfer.findAll({ status, search });
      return res.status(200).json(transfers);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get transfer by ID
   */
  async getTransferById(req, res, next) {
    try {
      const { id } = req.params;
      const transfer = await InternalTransfer.findById(id);
      if (!transfer) {
        return res.status(404).json({ error: 'Transfer document not found.' });
      }
      return res.status(200).json(transfer);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new transfer document
   */
  async createTransfer(req, res, next) {
    try {
      const {
        product_id,
        from_location_id,
        to_location_id,
        quantity,
        date,
        notes
      } = req.body;
      let transfer_number = req.body.transfer_number;

      if (!product_id || !from_location_id || !to_location_id || !quantity) {
        return res.status(400).json({
          error: 'product_id, from_location_id, to_location_id, and quantity are required.'
        });
      }

      if (parseInt(from_location_id, 10) === parseInt(to_location_id, 10)) {
        return res.status(400).json({
          error: 'Origin and destination locations must be different.'
        });
      }

      if (parseInt(quantity, 10) <= 0) {
        return res.status(400).json({
          error: 'Transfer quantity must be greater than 0.'
        });
      }

      if (!transfer_number) {
        transfer_number = `TRF-${Date.now().toString().slice(-6)}`;
      }

      const userId = req.user ? req.user.id : null;

      const transfer = await InternalTransfer.create({
        transfer_number,
        product_id: parseInt(product_id, 10),
        from_location_id: parseInt(from_location_id, 10),
        to_location_id: parseInt(to_location_id, 10),
        quantity: parseInt(quantity, 10),
        status: 'Draft',
        date: date || new Date(),
        notes,
        created_by: userId
      });

      return res.status(201).json(transfer);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update transfer details (only if Draft/Waiting)
   */
  async updateTransfer(req, res, next) {
    try {
      const { id } = req.params;
      const transfer = await InternalTransfer.findById(id);
      if (!transfer) {
        return res.status(404).json({ error: 'Transfer not found.' });
      }

      if (transfer.status === 'Done' || transfer.status === 'Canceled') {
        return res.status(400).json({
          error: `Cannot update a transfer with status '${transfer.status}'.`
        });
      }

      const { from_location_id, to_location_id, product_id, quantity, date, notes, status } = req.body;

      const updated = await InternalTransfer.update(id, {
        from_location_id: from_location_id ? parseInt(from_location_id, 10) : undefined,
        to_location_id: to_location_id ? parseInt(to_location_id, 10) : undefined,
        product_id: product_id ? parseInt(product_id, 10) : undefined,
        quantity: quantity ? parseInt(quantity, 10) : undefined,
        date,
        notes,
        status
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validate transfer: shifts stock between locations atomically (total product stock unchanged)
   */
  async validateTransfer(req, res, next) {
    try {
      const { id } = req.params;
      const transfer = await InternalTransfer.findById(id);
      if (!transfer) {
        return res.status(404).json({ error: 'Transfer not found.' });
      }

      if (transfer.status === 'Done') {
        return res.status(400).json({ error: 'Transfer is already validated.' });
      }

      if (transfer.status === 'Canceled') {
        return res.status(400).json({ error: 'Cannot validate a canceled transfer.' });
      }

      const userId = req.user ? req.user.id : null;

      const result = await db.transaction(async (client) => {
        // Apply transfer movement (stock total remains unchanged)
        await applyStockMovement({
          entryType: 'transfer',
          productId: transfer.product_id,
          fromLocationId: transfer.from_location_id,
          toLocationId: transfer.to_location_id,
          qtyDelta: transfer.quantity,
          refType: 'internal_transfer',
          refId: transfer.transfer_number,
          userId,
          client
        });

        const updated = await InternalTransfer.updateStatus(id, 'Done', client);
        return updated;
      });

      return res.status(200).json({
        message: 'Internal transfer validated and stocks shifted successfully.',
        transfer: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transferController;
