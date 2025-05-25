const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
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

// Generate next loading slip number
router.get('/next-slip-number', async (req, res) => {
  try {
    // Get current financial year (April to March)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    let financialYear;
    if (currentMonth >= 4) {
      // April onwards - current year to next year
      financialYear = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
      // January to March - previous year to current year
      financialYear = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
    }
    
    // Find the latest loading slip number for this financial year
    const latestReceipt = await Receipt.findOne({
      loadingSlipNumber: { $regex: `^TPK/${financialYear}/` }
    }).sort({ loadingSlipNumber: -1 });
    
    let nextNumber = 1;
    if (latestReceipt) {
      // Extract the number from the latest slip number
      const parts = latestReceipt.loadingSlipNumber.split('/');
      if (parts.length === 3) {
        const lastNumber = parseInt(parts[2]);
        nextNumber = lastNumber + 1;
      }
    }
    
    // Format the number with leading zeros (5 digits)
    const formattedNumber = nextNumber.toString().padStart(5, '0');
    const loadingSlipNumber = `TPK/${financialYear}/${formattedNumber}`;
    
    res.json({ loadingSlipNumber });
  } catch (error) {
    console.error('Generate slip number error:', error);
    res.status(500).json({ message: 'Failed to generate loading slip number' });
  }
});

module.exports = router; 