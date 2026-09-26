const StockLedgerEntry = require('../models/StockLedgerEntry');

const ledgerController = {
  /**
   * Get immutable stock ledger entries with filters
   * Query params: productId, locationId, entryType, startDate, endDate, limit, offset
   */
  async getLedgerEntries(req, res, next) {
    try {
      const {
        productId,
        product_id,
        locationId,
        location_id,
        entryType,
        entry_type,
        startDate,
        start_date,
        endDate,
        end_date,
        limit,
        offset
      } = req.query;

      const pId = productId || product_id;
      const lId = locationId || location_id;
      const type = entryType || entry_type;
      const sDate = startDate || start_date;
      const eDate = endDate || end_date;

      const entries = await StockLedgerEntry.findAll({
        productId: pId ? parseInt(pId, 10) : undefined,
        locationId: lId ? parseInt(lId, 10) : undefined,
        entryType: type,
        startDate: sDate,
        endDate: eDate,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      });

      // Format for both raw API consumers and frontend Ledger page
      const formatted = entries.map((entry) => ({
        id: `MOV-${entry.id}`,
        rawId: entry.id,
        entryType: entry.entry_type,
        docType: entry.entry_type.charAt(0).toUpperCase() + entry.entry_type.slice(1),
        docId: entry.ref_id || 'N/A',
        productId: entry.product_id,
        product: entry.product_name,
        sku: entry.sku,
        qty: entry.qty_delta > 0 ? `+${entry.qty_delta}` : `${entry.qty_delta}`,
        qtyDelta: entry.qty_delta,
        fromLocation: entry.from_location_code
          ? `${entry.from_warehouse_name || ''} (${entry.from_location_code})`.trim()
          : null,
        toLocation: entry.to_location_code
          ? `${entry.to_warehouse_name || ''} (${entry.to_location_code})`.trim()
          : null,
        location:
          entry.to_location_code
            ? `${entry.to_warehouse_name || ''} (${entry.to_location_code})`.trim()
            : entry.from_location_code
            ? `${entry.from_warehouse_name || ''} (${entry.from_location_code})`.trim()
            : 'Warehouse',
        user: entry.user_name || 'System',
        date: entry.created_at ? new Date(entry.created_at).toISOString().split('T')[0] : null,
        createdAt: entry.created_at
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single ledger entry by ID
   */
  async getLedgerEntryById(req, res, next) {
    try {
      const { id } = req.params;
      const entryId = id.startsWith('MOV-') ? id.replace('MOV-', '') : id;
      const entry = await StockLedgerEntry.findById(entryId);
      if (!entry) {
        return res.status(404).json({ error: 'Ledger entry not found.' });
      }
      return res.status(200).json(entry);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ledgerController;
