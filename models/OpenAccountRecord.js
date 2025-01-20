// models/OpenAccountRecord.js
const mongoose = require('mongoose');

const productInRecordSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  priceType: {
    type: String,
    required: true,
    enum: ['1', '2']
  }
});

const openAccountRecordSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  buyerName: {
    type: String,
    required: false,
    default: null
  },
  products: {
    type: [productInRecordSchema],
    required: true,
    validate: [array => array.length > 0, 'Products cannot be empty']
  }
}, { timestamps: true });

const OpenAccountRecord = mongoose.model('OpenAccountRecord', openAccountRecordSchema);
module.exports = OpenAccountRecord;