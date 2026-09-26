const db = require('../config/db');

const Warehouse = {
  async create({ name, location, capacity = 0, active = true }) {
    const query = `
      INSERT INTO warehouses (name, location, capacity, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await db.query(query, [name, location, capacity, active]);
    return res.rows[0];
  },

  async findAll() {
    const query = `
      SELECT w.*, COUNT(l.id)::INT AS location_count
      FROM warehouses w
      LEFT JOIN locations l ON w.id = l.warehouse_id
      GROUP BY w.id
      ORDER BY w.id ASC;
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT w.*, COUNT(l.id)::INT AS location_count
      FROM warehouses w
      LEFT JOIN locations l ON w.id = l.warehouse_id
      WHERE w.id = $1
      GROUP BY w.id;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async update(id, { name, location, capacity, active }) {
    const query = `
      UPDATE warehouses
      SET name = COALESCE($1, name),
          location = COALESCE($2, location),
          capacity = COALESCE($3, capacity),
          active = COALESCE($4, active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const res = await db.query(query, [name, location, capacity, active, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM warehouses WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = Warehouse;
