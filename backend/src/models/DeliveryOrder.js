const db = require('../config/db');

const DeliveryOrder = {
  async create({ order_number, customer, status = 'Draft', date = new Date(), notes, created_by }, client = db) {
    const query = `
      INSERT INTO delivery_orders (order_number, customer, status, date, notes, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await client.query(query, [order_number, customer, status, date, notes, created_by]);
    return res.rows[0];
  },

  async findAll({ status, search } = {}) {
    let query = `
      SELECT d.*, u.name AS created_by_name, COUNT(dl.id)::INT AS line_count
      FROM delivery_orders d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN delivery_lines dl ON d.id = dl.delivery_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND d.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (d.order_number ILIKE $${params.length} OR d.customer ILIKE $${params.length})`;
    }

    query += `
      GROUP BY d.id, u.name
      ORDER BY d.id DESC;
    `;

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT d.*, u.name AS created_by_name
      FROM delivery_orders d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async updateStatus(id, status, client = db) {
    const query = `
      UPDATE delivery_orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(query, [status, id]);
    return res.rows[0] || null;
  },

  async update(id, { customer, date, notes, status }) {
    const query = `
      UPDATE delivery_orders
      SET customer = COALESCE($1, customer),
          date = COALESCE($2, date),
          notes = COALESCE($3, notes),
          status = COALESCE($4, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const res = await db.query(query, [customer, date, notes, status, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM delivery_orders WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = DeliveryOrder;
