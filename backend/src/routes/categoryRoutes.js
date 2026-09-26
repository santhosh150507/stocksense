const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { requireFields } = require('../middleware/validateRequest');

router.get('/', authMiddleware, categoryController.getAllCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  requireFields(['name']),
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('inventory_manager'),
  categoryController.deleteCategory
);

module.exports = router;
