// models/RetailRecord.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
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
  price: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  priceType: {
    type: Number,
    required: true,
    enum: [1, 2] // Assuming priceType can only be 1 or 2
  }
});

const retailRecordSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    employee: {
      type: String,
      required: true
    },
    products: {
      type: [productSchema],
      required: true,
      validate: [array => array.length > 0, 'Products cannot be empty']
    },
    total: {
      type: Number,
      required: true
    }
  }, { timestamps: true });
  
  // Middleware to validate total amount
  retailRecordSchema.pre('save', function(next) {
    const calculatedTotal = this.products.reduce((sum, product) => {
      const priceWithTax = product.price * (1 + product.tax/100) * product.quantity;
      return sum + priceWithTax;
    }, 0);
    
    // Allow for small floating point differences (0.01)
    if (Math.abs(this.total - calculatedTotal) > 0.01) {
      next(new Error('Total amount does not match with products calculation'));
    }
    next();
  });
  
  const RetailRecord = mongoose.model('RetailRecord', retailRecordSchema);
  
  module.exports = RetailRecord;