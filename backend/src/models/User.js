const db = require('../config/db');

const User = {
  async create({ name, email, password_hash, role = 'warehouse_staff' }) {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at;
    `;
    const res = await db.query(query, [name, email, password_hash, role]);
    return res.rows[0];
  },

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const res = await db.query(query, [email]);
    return res.rows[0] || null;
  },

  async findById(id) {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async updatePassword(id, password_hash) {
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, email, role, updated_at;
    `;
    const res = await db.query(query, [password_hash, id]);
    return res.rows[0] || null;
  },

  async findAll() {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id ASC;`;
    const res = await db.query(query);
    return res.rows;
  }
};

module.exports = User;
