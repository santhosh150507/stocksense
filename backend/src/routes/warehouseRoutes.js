const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { requireFields } = require('../middleware/validateRequest');

// Locations standalone endpoints
router.get('/locations/all', authMiddleware, warehouseController.getAllLocations);
router.put(
  '/locations/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  warehouseController.updateLocation
);
router.delete(
  '/locations/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  warehouseController.deleteLocation
);

// Warehouses endpoints
router.get('/', authMiddleware, warehouseController.getAllWarehouses);
router.get('/:id', authMiddleware, warehouseController.getWarehouseById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  requireFields(['name']),
  warehouseController.createWarehouse
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  warehouseController.updateWarehouse
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  warehouseController.deleteWarehouse
);

// Locations under a specific warehouse
router.get('/:warehouseId/locations', authMiddleware, warehouseController.getWarehouseLocations);
router.post(
  '/:warehouseId/locations',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  requireFields(['code']),
  warehouseController.createLocation
);

module.exports = router;
