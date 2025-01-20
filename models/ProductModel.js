const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  price2: {
    type: Number,
    required: false
  },
  code: {
    type: String,
    required: true
  },
  KDV_ORANI: {
    type: Number,
    required: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true  // This allows null/undefined values while maintaining uniqueness for non-null values
  },
  barcodeGenerated: {
    type: Date,
    default: null
  }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  console.log(`Saving product: ${this.name}`);
  next();
});

productSchema.post('save', function(doc) {
  console.log(`Product ${doc.name} saved successfully`);
});

productSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.keyPattern.barcode) {
      next(new Error('Duplicate barcode error: This barcode already exists.'));
    } else if (error.keyPattern.name) {
      next(new Error('Duplicate key error: A product with this name already exists.'));
    } else {
      next(new Error('Duplicate key error'));
    }
  } else {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;