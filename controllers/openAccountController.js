// controllers/openAccountController.js
const OpenAccountRecord = require('../models/OpenAccountRecord');
const asyncHandler = require('express-async-handler');

// @desc    Get open account records with optional filtering
// @route   GET /api/open-account-records
// @access  Public
const getOpenAccountRecords = asyncHandler(async (req, res) => {
  const { company, date } = req.query;
  const query = {};
  
  if (company) query.company = company;
  if (date) query.date = new Date(date);
  
  const records = await OpenAccountRecord.find(query)
    .populate('company', 'name')
    .sort({ date: -1 });
    
  res.json(records);
});

// @desc    Update open account record
// @route   PATCH /api/open-account-records/:id
// @access  Public
const updateOpenAccountRecord = asyncHandler(async (req, res) => {
  const record = await OpenAccountRecord.findById(req.params.id);
  
  if (record) {
    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } else {
    res.status(404);
    throw new Error('Record not found');
  }
});

// @desc    Delete open account record
// @route   DELETE /api/open-account-records/:id
// @access  Public
const deleteOpenAccountRecord = asyncHandler(async (req, res) => {
  const record = await OpenAccountRecord.findById(req.params.id);
  
  if (record) {
    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } else {
    res.status(404);
    throw new Error('Record not found');
  }
});

// controllers/retailRecordController.js
const RetailRecord = require('../models/RetailRecord');
const asyncHandler = require('express-async-handler');

// @desc    Get retail records with date range
// @route   GET /api/retail-records
// @access  Public
const getRetailRecords = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const records = await RetailRecord.find(query)
    .sort({ date: -1 });
    
  res.json(records);
});

// @desc    Update retail record
// @route   PATCH /api/retail-records/:id
// @access  Public
const updateRetailRecord = asyncHandler(async (req, res) => {
  const record = await RetailRecord.findById(req.params.id);
  
  if (record) {
    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } else {
    res.status(404);
    throw new Error('Record not found');
  }
});

// @desc    Delete retail record
// @route   DELETE /api/retail-records/:id
// @access  Public
const deleteRetailRecord = asyncHandler(async (req, res) => {
  const record = await RetailRecord.findById(req.params.id);
  
  if (record) {
    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } else {
    res.status(404);
    throw new Error('Record not found');
  }
});