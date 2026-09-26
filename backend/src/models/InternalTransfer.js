const db = require('../config/db');

const InternalTransfer = {
  async create(
    {
      transfer_number,
      product_id,
      from_location_id,
      to_location_id,
      quantity,
      status = 'Draft',
      date = new Date(),
      notes,
      created_by
    },
    client = db
  ) {
    const query = `
      INSERT INTO internal_transfers (
        transfer_number, product_id, from_location_id, to_location_id,
        quantity, status, date, notes, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const res = await client.query(query, [
      transfer_number,
      product_id,
      from_location_id,
      to_location_id,
      quantity,
      status,
      date,
      notes,
      created_by
    ]);
    return res.rows[0];
  },

  async findAll({ status, search } = {}) {
    let query = `
      SELECT 
        it.*,
        p.name AS product_name,
        p.sku,
        fl.code AS from_location_code,
        fw.name AS from_warehouse_name,
        tl.code AS to_location_code,
        tw.name AS to_warehouse_name,
        u.name AS created_by_name
      FROM internal_transfers it
      JOIN products p ON it.product_id = p.id
      JOIN locations fl ON it.from_location_id = fl.id
      JOIN warehouses fw ON fl.warehouse_id = fw.id
      JOIN locations tl ON it.to_location_id = tl.id
      JOIN warehouses tw ON tl.warehouse_id = tw.id
      LEFT JOIN users u ON it.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND it.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (it.transfer_number ILIKE $${params.length} OR p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`;
    }

    query += ` ORDER BY it.id DESC;`;

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT 
        it.*,
        p.name AS product_name,
        p.sku,
        fl.code AS from_location_code,
        fw.name AS from_warehouse_name,
        tl.code AS to_location_code,
        tw.name AS to_warehouse_name,
        u.name AS created_by_name
      FROM internal_transfers it
      JOIN products p ON it.product_id = p.id
      JOIN locations fl ON it.from_location_id = fl.id
      JOIN warehouses fw ON fl.warehouse_id = fw.id
      JOIN locations tl ON it.to_location_id = tl.id
      JOIN warehouses tw ON tl.warehouse_id = tw.id
      LEFT JOIN users u ON it.created_by = u.id
      WHERE it.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async updateStatus(id, status, client = db) {
    const query = `
      UPDATE internal_transfers
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(query, [status, id]);
    return res.rows[0] || null;
  },

  async update(id, { from_location_id, to_location_id, product_id, quantity, date, notes, status }) {
    const query = `
      UPDATE internal_transfers
      SET from_location_id = COALESCE($1, from_location_id),
          to_location_id = COALESCE($2, to_location_id),
          product_id = COALESCE($3, product_id),
          quantity = COALESCE($4, quantity),
          date = COALESCE($5, date),
          notes = COALESCE($6, notes),
          status = COALESCE($7, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `;
    const res = await db.query(query, [
      from_location_id,
      to_location_id,
      product_id,
      quantity,
      date,
      notes,
      status,
      id
    ]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM internal_transfers WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = InternalTransfer;
