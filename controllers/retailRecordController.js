// controllers/retailRecordController.js
const RetailRecord = require('../models/RetailRecord');
const asyncHandler = require('express-async-handler');

// @desc    Get retail records with date range
// @route   GET /api/retail-records
// @access  Public
const getRetailRecords = asyncHandler(async (req, res) => {
  const { startDate, endDate, employee } = req.query;
  const query = {};
  
  if (startDate && endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = {
      $gte: new Date(startDate),
      $lte: endOfDay
    };
  }

  if (employee) {
    query.employee = employee;
  }
  
  const records = await RetailRecord.find(query)
    .sort({ date: -1 });
    
  res.json(records);
});

// @desc    Create retail record
// @route   POST /api/retail-records
// @access  Public
const createRetailRecord = asyncHandler(async (req, res) => {
  const record = await RetailRecord.create(req.body);
  res.status(201).json(record);
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

// @desc    Get retail record by ID
// @route   GET /api/retail-records/:id
// @access  Public
const getRetailRecordById = asyncHandler(async (req, res) => {
  const record = await RetailRecord.findById(req.params.id);
  
  if (record) {
    res.json(record);
  } else {
    res.status(404);
    throw new Error('Record not found');
  }
});

module.exports = {
  getRetailRecords,
  createRetailRecord,
  updateRetailRecord,
  deleteRetailRecord,
  getRetailRecordById
};