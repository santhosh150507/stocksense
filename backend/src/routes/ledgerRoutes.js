const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');
const authMiddleware = require('../middleware/authMiddleware');

// Read-only ledger routes
router.get('/', authMiddleware, ledgerController.getLedgerEntries);
router.get('/:id', authMiddleware, ledgerController.getLedgerEntryById);

module.exports = router;
