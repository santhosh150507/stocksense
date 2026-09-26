const db = require('../config/db');
const DeliveryOrder = require('../models/DeliveryOrder');
const DeliveryLine = require('../models/DeliveryLine');
const { applyStockMovement } = require('../services/stockEngine');

const deliveryController = {
  /**
   * List all delivery orders
   */
  async getAllDeliveries(req, res, next) {
    try {
      const { status, search } = req.query;
      const deliveries = await DeliveryOrder.findAll({ status, search });
      return res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get delivery order by ID with line items
   */
  async getDeliveryById(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryOrder.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery order not found.' });
      }

      const lines = await DeliveryLine.findByDeliveryId(id);
      return res.status(200).json({
        ...delivery,
        lines
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new delivery order
   */
  async createDelivery(req, res, next) {
    try {
      const { customer, date, notes, lines = [] } = req.body;
      let order_number = req.body.order_number;

      if (!customer) {
        return res.status(400).json({ error: 'Customer name is required.' });
      }

      if (!order_number) {
        order_number = `DEL-${Date.now().toString().slice(-6)}`;
      }

      const userId = req.user ? req.user.id : null;

      const createdData = await db.transaction(async (client) => {
        const order = await DeliveryOrder.create(
          {
            order_number,
            customer,
            status: 'Draft',
            date: date || new Date(),
            notes,
            created_by: userId
          },
          client
        );

        const createdLines = [];
        for (const line of lines) {
          if (!line.product_id || !line.location_id || !line.quantity) {
            throw new Error('Each line must specify product_id, location_id, and quantity.');
          }
          const createdLine = await DeliveryLine.create(
            {
              delivery_id: order.id,
              product_id: parseInt(line.product_id, 10),
              location_id: parseInt(line.location_id, 10),
              quantity: parseInt(line.quantity, 10)
            },
            client
          );
          createdLines.push(createdLine);
        }

        return { ...order, lines: createdLines };
      });

      return res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add lines to an existing draft/waiting delivery order
   */
  async addDeliveryLines(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryOrder.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery order not found.' });
      }

      if (delivery.status === 'Done' || delivery.status === 'Canceled') {
        return res.status(400).json({
          error: `Cannot add lines to a delivery with status '${delivery.status}'.`
        });
      }

      const lines = Array.isArray(req.body.lines) ? req.body.lines : [req.body];
      const addedLines = await db.transaction(async (client) => {
        const results = [];
        for (const line of lines) {
          if (!line.product_id || !line.location_id || !line.quantity) {
            throw new Error('Each line must specify product_id, location_id, and quantity.');
          }
          const newLine = await DeliveryLine.create(
            {
              delivery_id: id,
              product_id: parseInt(line.product_id, 10),
              location_id: parseInt(line.location_id, 10),
              quantity: parseInt(line.quantity, 10)
            },
            client
          );
          results.push(newLine);
        }
        return results;
      });

      return res.status(201).json(addedLines);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update delivery order status (pick / pack workflow: Draft -> Waiting -> Ready)
   */
  async updateDeliveryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Draft', 'Waiting', 'Ready', 'Canceled'].includes(status)) {
        return res.status(400).json({
          error: "Invalid status transition. Use /validate endpoint to transition to 'Done'."
        });
      }

      const delivery = await DeliveryOrder.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery order not found.' });
      }

      if (delivery.status === 'Done') {
        return res.status(400).json({ error: 'Cannot change status of a completed delivery.' });
      }

      const updated = await DeliveryOrder.updateStatus(id, status);
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validate delivery: checks inventory availability, deducts stock via stockEngine, sets status to Done
   */
  async validateDelivery(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryOrder.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery order not found.' });
      }

      if (delivery.status === 'Done') {
        return res.status(400).json({ error: 'Delivery order is already validated.' });
      }

      if (delivery.status === 'Canceled') {
        return res.status(400).json({ error: 'Cannot validate a canceled delivery order.' });
      }

      const lines = await DeliveryLine.findByDeliveryId(id);
      if (!lines || lines.length === 0) {
        return res.status(400).json({ error: 'Cannot validate a delivery order with no items/lines.' });
      }

      const userId = req.user ? req.user.id : null;

      const result = await db.transaction(async (client) => {
        // Execute stockEngine for each delivery line (deducts stock)
        for (const line of lines) {
          await applyStockMovement({
            entryType: 'delivery',
            productId: line.product_id,
            fromLocationId: line.location_id,
            qtyDelta: line.quantity,
            refType: 'delivery_order',
            refId: delivery.order_number,
            userId,
            client
          });
        }

        const updatedOrder = await DeliveryOrder.updateStatus(id, 'Done', client);
        return updatedOrder;
      });

      return res.status(200).json({
        message: 'Delivery order validated and inventory deducted successfully.',
        delivery: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = deliveryController;
