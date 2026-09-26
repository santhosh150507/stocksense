const db = require('../config/db');

const Receipt = {
  async create({ receipt_number, supplier, status = 'Draft', date = new Date(), notes, created_by }, client = db) {
    const query = `
      INSERT INTO receipts (receipt_number, supplier, status, date, notes, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await client.query(query, [receipt_number, supplier, status, date, notes, created_by]);
    return res.rows[0];
  },

  async findAll({ status, search } = {}) {
    let query = `
      SELECT r.*, u.name AS created_by_name, COUNT(rl.id)::INT AS line_count
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN receipt_lines rl ON r.id = rl.receipt_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.receipt_number ILIKE $${params.length} OR r.supplier ILIKE $${params.length})`;
    }

    query += `
      GROUP BY r.id, u.name
      ORDER BY r.id DESC;
    `;

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT r.*, u.name AS created_by_name
      FROM receipts r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async updateStatus(id, status, client = db) {
    const query = `
      UPDATE receipts
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(query, [status, id]);
    return res.rows[0] || null;
  },

  async update(id, { supplier, date, notes, status }) {
    const query = `
      UPDATE receipts
      SET supplier = COALESCE($1, supplier),
          date = COALESCE($2, date),
          notes = COALESCE($3, notes),
          status = COALESCE($4, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const res = await db.query(query, [supplier, date, notes, status, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM receipts WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = Receipt;
