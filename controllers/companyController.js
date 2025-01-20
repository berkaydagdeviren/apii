// controllers/companyController.js
const Company = require('../models/CompanyModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({});
  res.json(companies);
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Create company
// @route   POST /api/companies
// @access  Public (for now)
const createCompany = asyncHandler(async (req, res) => {
  const { name, address } = req.body;
  
  const company = await Company.create({
    name,
    address
  });

  if (company) {
    res.status(201).json(company);
  } else {
    res.status(400);
    throw new Error('Invalid company data');
  }
});

// @desc    Update company
// @route   PATCH /api/companies/:id
// @access  Public (for now)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    Object.assign(company, req.body);
    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Public (for now)
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    await company.deleteOne();
    res.json({ message: 'Company removed' });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};