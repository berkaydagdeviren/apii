// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompanyById)
  .patch(updateCompany)
  .delete(deleteCompany);

module.exports = router;

//const express = require('express');
//const router = express.Router();
//const Company = require('../models/CompanyModel'); // Assuming you have a CompanyModel
//
//// Log for server startup
//console.log('Setting up company routes');
//
//router.get('/', async (req, res) => {
//  try {
//    const companies = await Company.find();
//    console.log('Fetching all companies');
//    res.json(companies);
//  } catch (error) {
//    console.error('Error fetching companies:', error);
//    res.status(400).send(error);
//  }
//});
//
//module.exports = router;