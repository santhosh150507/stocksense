const db = require('../config/db');

const Product = {
  async create({ sku, name, description, category_id, price = 0, reorder_point = 10 }) {
    const query = `
      INSERT INTO products (sku, name, description, category_id, price, reorder_point)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await db.query(query, [sku, name, description, category_id, price, reorder_point]);
    return res.rows[0];
  },

  async findAll({ search, category_id, limit = 100, offset = 0 } = {}) {
    let query = `
      SELECT 
        p.*, 
        c.name AS category_name,
        COALESCE(SUM(sl.quantity), 0)::INT AS current_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.sku ILIKE $${params.length} OR p.name ILIKE $${params.length})`;
    }

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    query += `
      GROUP BY p.id, c.name
      ORDER BY p.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT 
        p.*, 
        c.name AS category_name,
        COALESCE(SUM(sl.quantity), 0)::INT AS current_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.name;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  },

  async findBySku(sku) {
    const query = `
      SELECT 
        p.*, 
        c.name AS category_name,
        COALESCE(SUM(sl.quantity), 0)::INT AS current_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      WHERE p.sku = $1
      GROUP BY p.id, c.name;
    `;
    const res = await db.query(query, [sku]);
    return res.rows[0] || null;
  },

  async update(id, { sku, name, description, category_id, price, reorder_point }) {
    const query = `
      UPDATE products
      SET sku = COALESCE($1, sku),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          category_id = COALESCE($4, category_id),
          price = COALESCE($5, price),
          reorder_point = COALESCE($6, reorder_point),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;
    const res = await db.query(query, [sku, name, description, category_id, price, reorder_point, id]);
    return res.rows[0] || null;
  },

  async delete(id) {
    const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = Product;
