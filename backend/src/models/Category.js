const db = require('../config/db');

const Category = {
  async create({ name, description }) {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const res = await db.query(query, [name, description]);
    return res.rows[0];
  },

  async findAll() {
    const query = `SELECT * FROM categories ORDER BY name ASC;`;
    const res = await db.query(query);
    return res.rows;
  },

  async findById(id) {
    const query = `SELECT * FROM categories WHERE id = $1;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async update(id, { name, description }) {
    const query = `
      UPDATE categories
      SET name = COALESCE($1, name),
          description = COALESCE($2, description)
      WHERE id = $3
      RETURNING *;
    `;
    const res = await db.query(query, [name, description, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM categories WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = Category;
