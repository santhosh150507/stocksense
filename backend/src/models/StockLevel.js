const db = require('../config/db');

const StockLevel = {
  async findByProductAndLocation(productId, locationId, client = db) {
    const query = `
      SELECT sl.*, p.name AS product_name, p.sku, l.code AS location_code
      FROM stock_levels sl
      JOIN products p ON sl.product_id = p.id
      JOIN locations l ON sl.location_id = l.id
      WHERE sl.product_id = $1 AND sl.location_id = $2;
    `;
    const res = await client.query(query, [productId, locationId]);
    return res.rows[0] || null;
  },

  async upsertDelta(productId, locationId, delta, client = db) {
    const query = `
      INSERT INTO stock_levels (product_id, location_id, quantity, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (product_id, location_id)
      DO UPDATE SET
        quantity = stock_levels.quantity + EXCLUDED.quantity,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const res = await client.query(query, [productId, locationId, delta]);
    return res.rows[0];
  },

  async setQuantity(productId, locationId, quantity, client = db) {
    const query = `
      INSERT INTO stock_levels (product_id, location_id, quantity, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (product_id, location_id)
      DO UPDATE SET
        quantity = EXCLUDED.quantity,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const res = await client.query(query, [productId, locationId, quantity]);
    return res.rows[0];
  },

  async findByProduct(productId) {
    const query = `
      SELECT sl.*, l.code AS location_code, l.name AS location_name, w.name AS warehouse_name
      FROM stock_levels sl
      JOIN locations l ON sl.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE sl.product_id = $1
      ORDER BY w.name, l.code;
    `;
    const res = await db.query(query, [productId]);
    return res.rows;
  },

  async findByLocation(locationId) {
    const query = `
      SELECT sl.*, p.sku, p.name AS product_name, p.price
      FROM stock_levels sl
      JOIN products p ON sl.product_id = p.id
      WHERE sl.location_id = $1
      ORDER BY p.name;
    `;
    const res = await db.query(query, [locationId]);
    return res.rows;
  },

  async getTotalStock(productId, client = db) {
    const query = `
      SELECT COALESCE(SUM(quantity), 0)::INT AS total_stock
      FROM stock_levels
      WHERE product_id = $1;
    `;
    const res = await client.query(query, [productId]);
    return res.rows[0] ? res.rows[0].total_stock : 0;
  }
};

module.exports = StockLevel;
