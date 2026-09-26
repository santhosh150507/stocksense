const db = require('../config/db');

const Location = {
  async create({ warehouse_id, code, name }) {
    const query = `
      INSERT INTO locations (warehouse_id, code, name)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const res = await db.query(query, [warehouse_id, code, name]);
    return res.rows[0];
  },

  async findAll() {
    const query = `
      SELECT l.*, w.name AS warehouse_name
      FROM locations l
      JOIN warehouses w ON l.warehouse_id = w.id
      ORDER BY w.name ASC, l.code ASC;
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async findByWarehouseId(warehouseId) {
    const query = `
      SELECT * FROM locations
      WHERE warehouse_id = $1
      ORDER BY code ASC;
    `;
    const res = await db.query(query, [warehouseId]);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT l.*, w.name AS warehouse_name
      FROM locations l
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE l.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async update(id, { warehouse_id, code, name }) {
    const query = `
      UPDATE locations
      SET warehouse_id = COALESCE($1, warehouse_id),
          code = COALESCE($2, code),
          name = COALESCE($3, name)
      WHERE id = $4
      RETURNING *;
    `;
    const res = await db.query(query, [warehouse_id, code, name, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM locations WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = Location;
