// models/OpenAccountRecord.js
const mongoose = require('mongoose');

const openAccountRecordSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Add other fields based on your needs
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

const OpenAccountRecord = mongoose.model('OpenAccountRecord', openAccountRecordSchema);
module.exports = OpenAccountRecord;