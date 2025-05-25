const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt
} = require('../controllers/receiptController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/receipts - Get all receipts
router.get('/', getAllReceipts);

// POST /api/receipts - Create new receipt
router.post('/', createReceipt);

// GET /api/receipts/:id - Get single receipt
router.get('/:id', getReceiptById);

// PUT /api/receipts/:id - Update receipt
router.put('/:id', updateReceipt);

// DELETE /api/receipts/:id - Delete receipt
router.delete('/:id', deleteReceipt);

module.exports = router; 