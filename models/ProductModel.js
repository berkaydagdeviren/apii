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
  KDV_ORANI: {  // New tax property
    type: Number,
    required: true,  // Set to true if tax is mandatory, otherwise set to false
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
    console.error(`There was a duplicate key error for product: ${doc.name}`, error);
    next(new Error('There was a duplicate key error'));
  } else {
    console.error('Error saving product', error);
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
