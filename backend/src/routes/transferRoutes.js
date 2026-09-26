const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validateRequest');

router.get('/', transferController.getAllTransfers);
router.get('/:id', transferController.getTransferById);

router.post(
  '/',
  authMiddleware,
  requireFields(['product_id', 'from_location_id', 'to_location_id', 'quantity']),
  transferController.createTransfer
);

router.put(
  '/:id',
  authMiddleware,
  transferController.updateTransfer
);

router.post(
  '/:id/validate',
  authMiddleware,
  transferController.validateTransfer
);

module.exports = router;
