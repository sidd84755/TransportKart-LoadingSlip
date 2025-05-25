const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  loadingSlipNo: {
    type: String,
    required: true,
    unique: true
  },
  loadingDate: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  fromCity: {
    type: String,
    required: true
  },
  toCity: {
    type: String,
    required: true
  },
  truckType: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true
  },
  driverNumber: {
    type: String,
    required: true
  },
  freight: {
    type: Number,
    required: true
  },
  detention: {
    type: Number,
    default: 0
  },
  advance: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  },
  remark: {
    type: String,
    default: ''
  },
  // Extra fields
  vehicleType: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  ownership: {
    type: String,
    enum: ['TransportKART', 'State Logistics'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

receiptSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Receipt', receiptSchema); 