// routes/retailRecordRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller
const RetailRecord = require('../models/RetailRecord');

// Basic error handler for async routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all retail records
// @route   GET /api/retail-records
router.get('/', asyncHandler(async (req, res) => {
    const records = await RetailRecord.find({}).sort({ date: -1 });
    res.json(records);
}));

// @desc    Create a retail record
// @route   POST /api/retail-records
router.post('/', asyncHandler(async (req, res) => {
    const record = await RetailRecord.create(req.body);
    res.status(201).json(record);
}));

// @desc    Get retail record by ID
// @route   GET /api/retail-records/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const record = await RetailRecord.findById(req.params.id);
    if (record) {
        res.json(record);
    } else {
        res.status(404);
        throw new Error('Record not found');
    }
}));

// @desc    Update retail record
// @route   PATCH /api/retail-records/:id
router.patch('/:id', asyncHandler(async (req, res) => {
    const record = await RetailRecord.findById(req.params.id);
    if (record) {
        Object.assign(record, req.body);
        const updatedRecord = await record.save();
        res.json(updatedRecord);
    } else {
        res.status(404);
        throw new Error('Record not found');
    }
}));

// @desc    Delete retail record
// @route   DELETE /api/retail-records/:id
router.delete('/:id', asyncHandler(async (req, res) => {
    const record = await RetailRecord.findById(req.params.id);
    if (record) {
        await record.deleteOne();
        res.json({ message: 'Record removed' });
    } else {
        res.status(404);
        throw new Error('Record not found');
    }
}));

module.exports = router;