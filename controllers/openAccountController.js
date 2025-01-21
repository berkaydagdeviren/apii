// controllers/openAccountController.js
const OpenAccountRecord = require('../models/OpenAccountRecord');

// @desc    Get all open account records
// @route   GET /api/open-account-records
const getOpenAccountRecords = async (req, res) => {
  try {
    const { company, date } = req.query;
    const query = {};
    
    if (company) query.company = company;
    if (date) query.date = new Date(date);
    
    const records = await OpenAccountRecord.find(query)
      //.populate('company', 'name')
      .sort({ date: -1 });
      
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create open account record
// @route   POST /api/open-account-records
const createOpenAccountRecord = async (req, res) => {
  try {
    const record =  new OpenAccountRecord(req.body);
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating open account record:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update open account record
// @route   PATCH /api/open-account-records/:id
const updateOpenAccountRecord = async (req, res) => {
  try {
    const record = await OpenAccountRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    Object.assign(record, req.body);
    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete open account record
// @route   DELETE /api/open-account-records/:id
const deleteOpenAccountRecord = async (req, res) => {
  try {
    const record = await OpenAccountRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOpenAccountRecords,
  createOpenAccountRecord,
  updateOpenAccountRecord,
  deleteOpenAccountRecord
};