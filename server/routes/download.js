const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Receipt = require('../models/Receipt');
const { generatePDF } = require('../utils/pdfGenerator');

// Apply auth middleware
router.use(authMiddleware);

// GET /api/download/:id - Download receipt as PDF
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const pdfBuffer = await generatePDF(receipt);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=loading-slip-${receipt.loadingSlipNo}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

module.exports = router; 