const db = require('../config/db');

const DeliveryLine = {
  async create({ delivery_id, product_id, location_id, quantity }, client = db) {
    const query = `
      INSERT INTO delivery_lines (delivery_id, product_id, location_id, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await client.query(query, [delivery_id, product_id, location_id, quantity]);
    return res.rows[0];
  },

  async findByDeliveryId(deliveryId, client = db) {
    const query = `
      SELECT dl.*, p.name AS product_name, p.sku, l.code AS location_code, w.name AS warehouse_name
      FROM delivery_lines dl
      JOIN products p ON dl.product_id = p.id
      JOIN locations l ON dl.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE dl.delivery_id = $1
      ORDER BY dl.id ASC;
    `;
    const res = await client.query(query, [deliveryId]);
    return res.rows;
  },

  async deleteByDeliveryId(deliveryId, client = db) {
    const query = `DELETE FROM delivery_lines WHERE delivery_id = $1 RETURNING *;`;
    const res = await client.query(query, [deliveryId]);
    return res.rows;
  },

  async delete(id, client = db) {
    const query = `DELETE FROM delivery_lines WHERE id = $1 RETURNING *;`;
    const res = await client.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = DeliveryLine;
