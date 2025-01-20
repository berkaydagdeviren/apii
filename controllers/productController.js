// controllers/productController.js
const Product = require('../models/ProductModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Public (for now)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, price2, code, KDV_ORANI } = req.body;
  
  const product = await Product.create({
    name,
    price,
    price2,
    code,
    KDV_ORANI
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
});

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Public (for now)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public (for now)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Save barcode for product
// @route   POST /api/products/:id
// @access  Public
const saveProductBarcode = async (req, res) => {
    try {
      const { barcode } = req.body;
      
      if (!barcode) {
        return res.status(400).json({ message: 'Barcode is required' });
      }
  
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if barcode already exists on another product
      const existingProduct = await Product.findOne({ barcode });
      if (existingProduct && existingProduct._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Barcode already exists on another product' });
      }
  
      product.barcode = barcode;
      product.barcodeGenerated = new Date();
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProductBarcode
};