const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { requireFields } = require('../middleware/validateRequest');

// Categories endpoints
router.get('/categories', productController.getCategories);
router.post(
  '/categories',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  requireFields(['name']),
  productController.createCategory
);

// Products endpoints
router.get('/', productController.getAllProducts);
router.get('/sku/:sku', productController.getProductBySku);
router.get('/:id', productController.getProductById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  requireFields(['sku', 'name']),
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  productController.deleteProduct
);

module.exports = router;
