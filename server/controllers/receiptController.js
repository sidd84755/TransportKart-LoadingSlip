const Receipt = require('../models/Receipt');
const moment = require('moment');

// Create a new receipt
const createReceipt = async (req, res) => {
  try {
    const receiptData = {
      ...req.body,
      loadingDate: new Date(req.body.loadingDate)
    };

    const receipt = new Receipt(receiptData);
    await receipt.save();

    res.status(201).json({
      message: 'Receipt created successfully',
      receipt
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Loading slip number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all receipts
const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .sort({ createdAt: -1 })
      .select('_id loadingSlipNo customerName loadingDate fromCity toCity vehicleNo freight balance createdAt');

    const formattedReceipts = receipts.map(receipt => ({
      ...receipt.toObject(),
      loadingDate: moment(receipt.loadingDate).format('DD-MM-YYYY'),
      createdAt: moment(receipt.createdAt).format('DD-MM-YYYY HH:mm'),
      vehicleNumber: receipt.vehicleNo
    }));

    res.json(formattedReceipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single receipt by ID
const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update receipt
const updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { ...req.body, loadingDate: new Date(req.body.loadingDate) },
      { new: true }
    );

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({
      message: 'Receipt updated successfully',
      receipt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete receipt
const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt
}; 