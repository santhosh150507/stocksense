const db = require('../config/db');

const ReceiptLine = {
  async create({ receipt_id, product_id, location_id, quantity }, client = db) {
    const query = `
      INSERT INTO receipt_lines (receipt_id, product_id, location_id, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await client.query(query, [receipt_id, product_id, location_id, quantity]);
    return res.rows[0];
  },

  async findByReceiptId(receiptId, client = db) {
    const query = `
      SELECT rl.*, p.name AS product_name, p.sku, l.code AS location_code, w.name AS warehouse_name
      FROM receipt_lines rl
      JOIN products p ON rl.product_id = p.id
      JOIN locations l ON rl.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE rl.receipt_id = $1
      ORDER BY rl.id ASC;
    `;
    const res = await client.query(query, [receiptId]);
    return res.rows;
  },

  async deleteByReceiptId(receiptId, client = db) {
    const query = `DELETE FROM receipt_lines WHERE receipt_id = $1 RETURNING *;`;
    const res = await client.query(query, [receiptId]);
    return res.rows;
  },

  async delete(id, client = db) {
    const query = `DELETE FROM receipt_lines WHERE id = $1 RETURNING *;`;
    const res = await client.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = ReceiptLine;
