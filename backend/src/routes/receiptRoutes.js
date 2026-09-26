const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validateRequest');

router.get('/', receiptController.getAllReceipts);
router.get('/:id', receiptController.getReceiptById);

router.post(
  '/',
  authMiddleware,
  requireFields(['supplier']),
  receiptController.createReceipt
);

router.post(
  '/:id/lines',
  authMiddleware,
  receiptController.addReceiptLines
);

router.post(
  '/:id/validate',
  authMiddleware,
  receiptController.validateReceipt
);

module.exports = router;
