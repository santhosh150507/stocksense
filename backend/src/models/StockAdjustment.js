const db = require('../config/db');

const StockAdjustment = {
  async create(
    {
      adjustment_number,
      product_id,
      location_id,
      recorded_qty,
      counted_qty,
      delta,
      status = 'Draft',
      date = new Date(),
      reason,
      created_by
    },
    client = db
  ) {
    const query = `
      INSERT INTO stock_adjustments (
        adjustment_number, product_id, location_id, recorded_qty,
        counted_qty, delta, status, date, reason, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const res = await client.query(query, [
      adjustment_number,
      product_id,
      location_id,
      recorded_qty,
      counted_qty,
      delta,
      status,
      date,
      reason,
      created_by
    ]);
    return res.rows[0];
  },

  async findAll({ status, search } = {}) {
    let query = `
      SELECT 
        sa.*,
        p.name AS product_name,
        p.sku,
        l.code AS location_code,
        w.name AS warehouse_name,
        u.name AS created_by_name
      FROM stock_adjustments sa
      JOIN products p ON sa.product_id = p.id
      JOIN locations l ON sa.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      LEFT JOIN users u ON sa.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND sa.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (sa.adjustment_number ILIKE $${params.length} OR p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`;
    }

    query += ` ORDER BY sa.id DESC;`;

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT 
        sa.*,
        p.name AS product_name,
        p.sku,
        l.code AS location_code,
        w.name AS warehouse_name,
        u.name AS created_by_name
      FROM stock_adjustments sa
      JOIN products p ON sa.product_id = p.id
      JOIN locations l ON sa.location_id = l.id
      JOIN warehouses w ON l.warehouse_id = w.id
      LEFT JOIN users u ON sa.created_by = u.id
      WHERE sa.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async updateStatus(id, status, client = db) {
    const query = `
      UPDATE stock_adjustments
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(query, [status, id]);
    return res.rows[0] || null;
  },

  async update(id, { product_id, location_id, recorded_qty, counted_qty, delta, date, reason, status }) {
    const query = `
      UPDATE stock_adjustments
      SET product_id = COALESCE($1, product_id),
          location_id = COALESCE($2, location_id),
          recorded_qty = COALESCE($3, recorded_qty),
          counted_qty = COALESCE($4, counted_qty),
          delta = COALESCE($5, delta),
          date = COALESCE($6, date),
          reason = COALESCE($7, reason),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
    `;
    const res = await db.query(query, [
      product_id,
      location_id,
      recorded_qty,
      counted_qty,
      delta,
      date,
      reason,
      status,
      id
    ]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM stock_adjustments WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = StockAdjustment;
