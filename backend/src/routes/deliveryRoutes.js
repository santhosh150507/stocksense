const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validateRequest');

router.get('/', deliveryController.getAllDeliveries);
router.get('/:id', deliveryController.getDeliveryById);

router.post(
  '/',
  authMiddleware,
  requireFields(['customer']),
  deliveryController.createDelivery
);

router.post(
  '/:id/lines',
  authMiddleware,
  deliveryController.addDeliveryLines
);

router.patch(
  '/:id/status',
  authMiddleware,
  requireFields(['status']),
  deliveryController.updateDeliveryStatus
);

router.post(
  '/:id/validate',
  authMiddleware,
  deliveryController.validateDelivery
);

module.exports = router;
