// routes/productRoutes.js
const express = require('express');
const router = express.Router();
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
  .get(getProducts)
  .post(createProduct);

// GET, PATCH, DELETE specific product and POST barcode
router.route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct)
  .post(saveProductBarcode);  // Added this line to match your frontend request

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