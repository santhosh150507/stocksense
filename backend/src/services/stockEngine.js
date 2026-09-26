const db = require('../config/db');
const StockLevel = require('../models/StockLevel');
const StockLedgerEntry = require('../models/StockLedgerEntry');

/**
 * Core Stock Engine
 * Every stock-changing operation must write to stock_levels only through this engine,
 * and every call must insert a row into stock_ledger atomically inside a DB transaction.
 *
 * @param {Object} params
 * @param {'receipt'|'delivery'|'transfer'|'adjustment'} params.entryType
 * @param {number} params.productId
 * @param {number|null} [params.fromLocationId]
 * @param {number|null} [params.toLocationId]
 * @param {number} params.qtyDelta
 * @param {string} [params.refType]
 * @param {string|number} [params.refId]
 * @param {number|null} [params.userId]
 * @param {import('pg').PoolClient} [params.client] - Optional active transaction client
 * @returns {Promise<{ ledgerEntry: Object, stockLevel: Object|Object[] }>}
 */
async function applyStockMovement({
  entryType,
  productId,
  fromLocationId = null,
  toLocationId = null,
  qtyDelta,
  refType = null,
  refId = null,
  userId = null,
  client = null
}) {
  const executeOperation = async (txClient) => {
    let delta = parseInt(qtyDelta, 10);
    if (isNaN(delta) && entryType !== 'transfer') {
      throw new Error(`Invalid qtyDelta: ${qtyDelta}`);
    }

    let affectedStockLevels = [];
    let ledgerDelta = delta;

    switch (entryType) {
      case 'receipt': {
        const destLocation = toLocationId || fromLocationId;
        if (!destLocation) {
          throw new Error('Receipt requires a destination location (toLocationId).');
        }
        const positiveDelta = Math.abs(delta);
        ledgerDelta = positiveDelta;

        const updatedLevel = await StockLevel.upsertDelta(productId, destLocation, positiveDelta, txClient);
        affectedStockLevels.push(updatedLevel);
        break;
      }

      case 'delivery': {
        const srcLocation = fromLocationId || toLocationId;
        if (!srcLocation) {
          throw new Error('Delivery requires a source location (fromLocationId).');
        }
        const deduction = Math.abs(delta);
        ledgerDelta = -deduction;

        // Check current stock level
        const currentLevel = await StockLevel.findByProductAndLocation(productId, srcLocation, txClient);
        const currentQty = currentLevel ? currentLevel.quantity : 0;
        if (currentQty < deduction) {
          throw new Error(
            `Insufficient stock at location ID ${srcLocation}. Available: ${currentQty}, Requested: ${deduction}`
          );
        }

        const updatedLevel = await StockLevel.upsertDelta(productId, srcLocation, -deduction, txClient);
        affectedStockLevels.push(updatedLevel);
        break;
      }

      case 'transfer': {
        if (!fromLocationId || !toLocationId) {
          throw new Error('Internal transfer requires both fromLocationId and toLocationId.');
        }
        if (fromLocationId === toLocationId) {
          throw new Error('Origin and destination locations must be different for transfer.');
        }
        const transferQty = Math.abs(delta);
        ledgerDelta = transferQty;

        // Check source stock level
        const srcLevel = await StockLevel.findByProductAndLocation(productId, fromLocationId, txClient);
        const currentQty = srcLevel ? srcLevel.quantity : 0;
        if (currentQty < transferQty) {
          throw new Error(
            `Insufficient stock at source location ID ${fromLocationId}. Available: ${currentQty}, Transfer requested: ${transferQty}`
          );
        }

        // Deduct from source
        const srcUpdated = await StockLevel.upsertDelta(productId, fromLocationId, -transferQty, txClient);
        // Add to destination
        const destUpdated = await StockLevel.upsertDelta(productId, toLocationId, transferQty, txClient);

        affectedStockLevels.push(srcUpdated, destUpdated);
        break;
      }

      case 'adjustment': {
        const adjLocation = toLocationId || fromLocationId;
        if (!adjLocation) {
          throw new Error('Stock adjustment requires a locationId.');
        }

        const updatedLevel = await StockLevel.upsertDelta(productId, adjLocation, delta, txClient);
        affectedStockLevels.push(updatedLevel);
        break;
      }

      default:
        throw new Error(`Unsupported entryType: ${entryType}`);
    }

    // Insert immutable audit record into stock_ledger
    const ledgerEntry = await StockLedgerEntry.create(
      {
        entry_type: entryType,
        product_id: productId,
        from_location_id: fromLocationId,
        to_location_id: toLocationId,
        qty_delta: ledgerDelta,
        ref_type: refType,
        ref_id: refId ? String(refId) : null,
        user_id: userId
      },
      txClient
    );

    return {
      ledgerEntry,
      stockLevels: affectedStockLevels.length === 1 ? affectedStockLevels[0] : affectedStockLevels
    };
  };

  if (client) {
    return await executeOperation(client);
  } else {
    return await db.transaction(executeOperation);
  }
}

module.exports = {
  applyStockMovement
};
