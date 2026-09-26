const db = require('../config/db');

const reorderService = {
  /**
   * Identify all products that are low in stock or out of stock based on reorder_point
   * @returns {Promise<{ lowStock: Array, outOfStock: Array, totalAlerts: number }>}
   */
  async getLowStockProducts() {
    const query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.price,
        p.reorder_point,
        c.name AS category_name,
        COALESCE(SUM(sl.quantity), 0)::INT AS current_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      GROUP BY p.id, c.name
      HAVING COALESCE(SUM(sl.quantity), 0) <= p.reorder_point
      ORDER BY current_stock ASC, p.name ASC;
    `;

    const res = await db.query(query);
    const rows = res.rows;

    const outOfStock = [];
    const lowStock = [];

    for (const item of rows) {
      const formatted = {
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category_name,
        price: item.price,
        currentStock: item.current_stock,
        reorderPoint: item.reorder_point,
        deficit: Math.max(0, item.reorder_point - item.current_stock)
      };

      if (item.current_stock <= 0) {
        outOfStock.push({ ...formatted, status: 'Out of Stock' });
      } else {
        lowStock.push({ ...formatted, status: 'Low Stock' });
      }
    }

    return {
      outOfStock,
      lowStock,
      totalAlerts: outOfStock.length + lowStock.length
    };
  },

  /**
   * Check if a specific product is below its reorder point
   * @param {number} productId
   */
  async checkProductStock(productId) {
    const query = `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.reorder_point,
        COALESCE(SUM(sl.quantity), 0)::INT AS current_stock
      FROM products p
      LEFT JOIN stock_levels sl ON p.id = sl.product_id
      WHERE p.id = $1
      GROUP BY p.id;
    `;
    const res = await db.query(query, [productId]);
    if (res.rows.length === 0) return null;

    const p = res.rows[0];
    const isLow = p.current_stock <= p.reorder_point;
    const isOut = p.current_stock <= 0;

    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      currentStock: p.current_stock,
      reorderPoint: p.reorder_point,
      isLowStock: isLow,
      isOutOfStock: isOut
    };
  }
};

module.exports = reorderService;
