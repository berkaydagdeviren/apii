// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { cacheMiddleware, clearCache } = require('../config/cache');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProductBarcode
} = require('../controllers/productController');

// GET all products and POST new product
router.route('/')
  .get(cacheMiddleware, getProducts)
  .post(async (req, res, next) => {
    await clearCache('/api/products');
    next();
  },createProduct);

// GET, PATCH, DELETE specific product and POST barcode
router.route('/:id')
.patch(async (req, res, next) => {
  await clearCache('/api/products');  // Clear cache when updating
  await clearCache(`/api/products/${req.params.id}`);
  next();
}, updateProduct)
.delete(async (req, res, next) => {
  await clearCache('/api/products');  // Clear cache when deleting
  await clearCache(`/api/products/${req.params.id}`);
  next();
}, deleteProduct)
.post(async (req, res, next) => {
  await clearCache('/api/products');  // Clear cache when saving barcode
  await clearCache(`/api/products/${req.params.id}`);
  next();
}, saveProductBarcode);  // Added this line to match your frontend request

module.exports = router;

//const express = require('express');
//const router = express.Router();
//const Product = require('../models/ProductModel'); // Assuming you have a ProductModel
//
//// Log for server startup
//console.log('Setting up product routes');
//
//router.get('/', async (req, res) => {
//  try {
//    const products = await Product.find();
//    console.log('Fetching all products');
//    res.json(products);
//  } catch (error) {
//    console.error('Error fetching products:', error);
//    res.status(400).send(error);
//  }
//});
//
//module.exports = router;