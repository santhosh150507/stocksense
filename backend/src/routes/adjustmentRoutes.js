const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validateRequest');

router.get('/', adjustmentController.getAllAdjustments);
router.get('/:id', adjustmentController.getAdjustmentById);

router.post(
  '/',
  authMiddleware,
  requireFields(['product_id', 'location_id', 'counted_qty']),
  adjustmentController.createAdjustment
);

router.put(
  '/:id',
  authMiddleware,
  adjustmentController.updateAdjustment
);

router.post(
  '/:id/validate',
  authMiddleware,
  adjustmentController.validateAdjustment
);

module.exports = router;
