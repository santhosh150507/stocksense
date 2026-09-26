/**
 * Notification Service Stub
 * Handles low-stock notifications, email alerts, and webhook triggers.
 */
const notificationService = {
  /**
   * Send alert when a single product drops below its reorder point
   * @param {Object} product
   * @param {number} currentStock
   * @param {number} reorderPoint
   */
  async sendLowStockAlert(product, currentStock, reorderPoint) {
    const alertData = {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      currentStock,
      reorderPoint,
      deficit: reorderPoint - currentStock,
      timestamp: new Date().toISOString()
    };

    console.log(
      `[NOTIFICATION] LOW STOCK ALERT: ${product.name} (${product.sku}) is at ${currentStock} units (Reorder Point: ${reorderPoint}).`
    );

    return {
      status: 'queued',
      channel: 'console_stub',
      alert: alertData
    };
  },

  /**
   * Send summary digest of all low stock and out of stock products
   * @param {Array} lowStockList
   * @param {Array} outOfStockList
   */
  async sendStockDigestAlert(lowStockList, outOfStockList) {
    const summary = {
      totalAlerts: lowStockList.length + outOfStockList.length,
      lowStockCount: lowStockList.length,
      outOfStockCount: outOfStockList.length,
      timestamp: new Date().toISOString()
    };

    console.log(
      `[NOTIFICATION] STOCK DIGEST: ${summary.outOfStockCount} Out-of-Stock, ${summary.lowStockCount} Low-Stock items.`
    );

    return {
      status: 'sent',
      channel: 'console_stub',
      summary
    };
  },

  /**
   * General notification to warehouse staff or inventory managers
   * @param {string} recipientRole - 'inventory_manager' | 'warehouse_staff'
   * @param {string} title
   * @param {string} message
   */
  async notifyRole(recipientRole, title, message) {
    console.log(`[NOTIFICATION -> ${recipientRole.toUpperCase()}] ${title}: ${message}`);
    return {
      status: 'sent',
      recipientRole,
      title,
      message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = notificationService;
