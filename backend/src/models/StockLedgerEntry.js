const db = require('../config/db');

const StockLedgerEntry = {
  async create(
    {
      entry_type,
      product_id,
      from_location_id = null,
      to_location_id = null,
      qty_delta,
      ref_type = null,
      ref_id = null,
      user_id = null
    },
    client = db
  ) {
    const query = `
      INSERT INTO stock_ledger (
        entry_type, product_id, from_location_id, to_location_id,
        qty_delta, ref_type, ref_id, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const res = await client.query(query, [
      entry_type,
      product_id,
      from_location_id,
      to_location_id,
      qty_delta,
      ref_type,
      ref_id,
      user_id
    ]);
    return res.rows[0];
  },

  async findAll({ productId, locationId, startDate, endDate, entryType, limit = 100, offset = 0 } = {}) {
    let query = `
      SELECT 
        sl.*,
        p.name AS product_name,
        p.sku,
        fl.code AS from_location_code,
        fw.name AS from_warehouse_name,
        tl.code AS to_location_code,
        tw.name AS to_warehouse_name,
        u.name AS user_name
      FROM stock_ledger sl
      JOIN products p ON sl.product_id = p.id
      LEFT JOIN locations fl ON sl.from_location_id = fl.id
      LEFT JOIN warehouses fw ON fl.warehouse_id = fw.id
      LEFT JOIN locations tl ON sl.to_location_id = tl.id
      LEFT JOIN warehouses tw ON tl.warehouse_id = tw.id
      LEFT JOIN users u ON sl.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (productId) {
      params.push(productId);
      query += ` AND sl.product_id = $${params.length}`;
    }

    if (locationId) {
      params.push(locationId);
      query += ` AND (sl.from_location_id = $${params.length} OR sl.to_location_id = $${params.length})`;
    }

    if (entryType) {
      params.push(entryType);
      query += ` AND sl.entry_type = $${params.length}`;
    }

    if (startDate) {
      params.push(startDate);
      query += ` AND sl.created_at >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND sl.created_at <= $${params.length}`;
    }

    query += `
      ORDER BY sl.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;
    params.push(limit, offset);

    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(id) {
    const query = `
      SELECT 
        sl.*,
        p.name AS product_name,
        p.sku,
        fl.code AS from_location_code,
        fw.name AS from_warehouse_name,
        tl.code AS to_location_code,
        tw.name AS to_warehouse_name,
        u.name AS user_name
      FROM stock_ledger sl
      JOIN products p ON sl.product_id = p.id
      LEFT JOIN locations fl ON sl.from_location_id = fl.id
      LEFT JOIN warehouses fw ON fl.warehouse_id = fw.id
      LEFT JOIN locations tl ON sl.to_location_id = tl.id
      LEFT JOIN warehouses tw ON tl.warehouse_id = tw.id
      LEFT JOIN users u ON sl.user_id = u.id
      WHERE sl.id = $1;
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }
};

module.exports = StockLedgerEntry;
