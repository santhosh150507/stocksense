const db = require('../config/db');
const Receipt = require('../models/Receipt');
const ReceiptLine = require('../models/ReceiptLine');
const { applyStockMovement } = require('../services/stockEngine');

const receiptController = {
  /**
   * List all receipts with optional filters
   */
  async getAllReceipts(req, res, next) {
    try {
      const { status, search } = req.query;
      const receipts = await Receipt.findAll({ status, search });
      return res.status(200).json(receipts);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single receipt by ID with line items
   */
  async getReceiptById(req, res, next) {
    try {
      const { id } = req.params;
      const receipt = await Receipt.findById(id);
      if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found.' });
      }

      const lines = await ReceiptLine.findByReceiptId(id);
      return res.status(200).json({
        ...receipt,
        lines
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new receipt with optional line items
   */
  async createReceipt(req, res, next) {
    try {
      const { supplier, date, notes, lines = [] } = req.body;
      let receipt_number = req.body.receipt_number;

      if (!supplier) {
        return res.status(400).json({ error: 'Supplier is required.' });
      }

      if (!receipt_number) {
        receipt_number = `REC-${Date.now().toString().slice(-6)}`;
      }

      const userId = req.user ? req.user.id : null;

      const createdData = await db.transaction(async (client) => {
        const receipt = await Receipt.create(
          {
            receipt_number,
            supplier,
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
            throw new Error('Each line must specify product_id, location_id, and quantity (> 0).');
          }
          const createdLine = await ReceiptLine.create(
            {
              receipt_id: receipt.id,
              product_id: parseInt(line.product_id, 10),
              location_id: parseInt(line.location_id, 10),
              quantity: parseInt(line.quantity, 10)
            },
            client
          );
          createdLines.push(createdLine);
        }

        return { ...receipt, lines: createdLines };
      });

      return res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add lines to an existing draft/waiting receipt
   */
  async addReceiptLines(req, res, next) {
    try {
      const { id } = req.params;
      const receipt = await Receipt.findById(id);
      if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found.' });
      }

      if (receipt.status === 'Done' || receipt.status === 'Canceled') {
        return res.status(400).json({
          error: `Cannot add lines to a receipt with status '${receipt.status}'.`
        });
      }

      const lines = Array.isArray(req.body.lines) ? req.body.lines : [req.body];
      const addedLines = await db.transaction(async (client) => {
        const results = [];
        for (const line of lines) {
          if (!line.product_id || !line.location_id || !line.quantity) {
            throw new Error('Each line must specify product_id, location_id, and quantity.');
          }
          const newLine = await ReceiptLine.create(
            {
              receipt_id: id,
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
   * Validate receipt: applies stock movements and sets status to Done
   */
  async validateReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const receipt = await Receipt.findById(id);
      if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found.' });
      }

      if (receipt.status === 'Done') {
        return res.status(400).json({ error: 'Receipt is already validated.' });
      }

      if (receipt.status === 'Canceled') {
        return res.status(400).json({ error: 'Cannot validate a canceled receipt.' });
      }

      const lines = await ReceiptLine.findByReceiptId(id);
      if (!lines || lines.length === 0) {
        return res.status(400).json({ error: 'Cannot validate a receipt with no items/lines.' });
      }

      const userId = req.user ? req.user.id : null;

      const result = await db.transaction(async (client) => {
        // Execute stockEngine for each receipt line
        for (const line of lines) {
          await applyStockMovement({
            entryType: 'receipt',
            productId: line.product_id,
            toLocationId: line.location_id,
            qtyDelta: line.quantity,
            refType: 'receipt',
            refId: receipt.receipt_number,
            userId,
            client
          });
        }

        const updatedReceipt = await Receipt.updateStatus(id, 'Done', client);
        return updatedReceipt;
      });

      return res.status(200).json({
        message: 'Receipt validated and inventory increased successfully.',
        receipt: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = receiptController;
