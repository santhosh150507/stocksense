const db = require('../config/db');
const reorderService = require('../services/reorderService');

const dashboardController = {
  /**
   * Aggregate high-level KPIs and operational dashboard metrics
   */
  async getSummary(req, res, next) {
    try {
      // 1. Total products count
      const prodRes = await db.query(`SELECT COUNT(*)::INT AS total FROM products;`);
      const totalProducts = prodRes.rows[0].total;

      // 2. Low stock and out-of-stock analysis
      const stockAlerts = await reorderService.getLowStockProducts();

      // 3. Pending document counts (Draft / Waiting / Ready)
      const receiptsRes = await db.query(`
        SELECT 
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'Draft')::INT AS draft,
          COUNT(*) FILTER (WHERE status = 'Waiting')::INT AS waiting,
          COUNT(*) FILTER (WHERE status = 'Ready')::INT AS ready,
          COUNT(*) FILTER (WHERE status = 'Done')::INT AS done
        FROM receipts;
      `);

      const deliveriesRes = await db.query(`
        SELECT 
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'Draft')::INT AS draft,
          COUNT(*) FILTER (WHERE status = 'Waiting')::INT AS waiting,
          COUNT(*) FILTER (WHERE status = 'Ready')::INT AS ready,
          COUNT(*) FILTER (WHERE status = 'Done')::INT AS done
        FROM delivery_orders;
      `);

      const transfersRes = await db.query(`
        SELECT 
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'Draft')::INT AS draft,
          COUNT(*) FILTER (WHERE status = 'Waiting')::INT AS waiting,
          COUNT(*) FILTER (WHERE status = 'Ready')::INT AS ready,
          COUNT(*) FILTER (WHERE status = 'Done')::INT AS done
        FROM internal_transfers;
      `);

      const adjustmentsRes = await db.query(`
        SELECT 
          COUNT(*)::INT AS total,
          COUNT(*) FILTER (WHERE status = 'Draft')::INT AS draft,
          COUNT(*) FILTER (WHERE status = 'Done')::INT AS done
        FROM stock_adjustments;
      `);

      // 4. Recent activity feed (latest movements from stock_ledger)
      const activityRes = await db.query(`
        SELECT 
          sl.id,
          sl.entry_type,
          sl.qty_delta,
          sl.ref_id,
          sl.created_at,
          p.name AS product_name,
          p.sku
        FROM stock_ledger sl
        JOIN products p ON sl.product_id = p.id
        ORDER BY sl.id DESC
        LIMIT 10;
      `);

      const recentActivity = activityRes.rows.map((row) => ({
        id: row.id,
        type: row.entry_type.charAt(0).toUpperCase() + row.entry_type.slice(1),
        description: `${row.qty_delta > 0 ? '+' : ''}${row.qty_delta} units of ${row.product_name} (${row.sku})`,
        refId: row.ref_id,
        createdAt: row.created_at,
        status: 'Done'
      }));

      // Combined pending operations count
      const rRow = receiptsRes.rows[0];
      const dRow = deliveriesRes.rows[0];
      const tRow = transfersRes.rows[0];

      const pendingReceipts = rRow.draft + rRow.waiting + rRow.ready;
      const pendingDeliveries = dRow.draft + dRow.waiting + dRow.ready;
      const pendingTransfers = tRow.draft + tRow.waiting + tRow.ready;

      // 5. Stock movements over the last 7 days
      const movementsRes = await db.query(`
        SELECT 
          TO_CHAR(DATE(created_at), 'Dy') as name,
          DATE(created_at) as full_date,
          SUM(CASE WHEN qty_delta > 0 THEN qty_delta ELSE 0 END)::INT as "In",
          SUM(CASE WHEN qty_delta < 0 THEN ABS(qty_delta) ELSE 0 END)::INT as "Out"
        FROM stock_ledger
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at), TO_CHAR(DATE(created_at), 'Dy')
        ORDER BY DATE(created_at) ASC;
      `);

      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const name = d.toLocaleDateString('en-US', { weekday: 'short' });
        // Format as YYYY-MM-DD local
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        days.push({ name, dateStr: `${yyyy}-${mm}-${dd}`, In: 0, Out: 0 });
      }

      movementsRes.rows.forEach(row => {
        // row.full_date is a JS Date object
        const d = new Date(row.full_date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dStr = `${yyyy}-${mm}-${dd}`;
        
        const day = days.find(day => day.dateStr === dStr);
        if (day) {
          day.In = row.In;
          day.Out = row.Out;
        }
      });
      const movementData = days;

      return res.status(200).json({
        kpis: {
          totalProducts,
          outOfStock: stockAlerts.outOfStock.length,
          lowStock: stockAlerts.lowStock.length,
          totalAlerts: stockAlerts.totalAlerts,
          pendingReceipts,
          pendingDeliveries,
          pendingTransfers
        },
        operations: {
          receipts: rRow,
          deliveries: dRow,
          transfers: tRow,
          adjustments: adjustmentsRes.rows[0]
        },
        stockAlerts: {
          outOfStock: stockAlerts.outOfStock,
          lowStock: stockAlerts.lowStock
        },
        recentActivity,
        movementData
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get specific low-stock and out-of-stock items list
   */
  async getLowStock(req, res, next) {
    try {
      const alerts = await reorderService.getLowStockProducts();
      return res.status(200).json(alerts);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
