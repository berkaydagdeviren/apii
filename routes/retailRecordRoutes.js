// routes/retailRecordRoutes.js
const express = require('express');
const router = express.Router();
const {
  getRetailRecords,
  createRetailRecord,
  updateRetailRecord,
  deleteRetailRecord,
  getRetailRecordById
} = require('../controllers/retailRecordController');

router.route('/')
  .get(getRetailRecords)
  .post(createRetailRecord);

router.route('/:id')
  .get(getRetailRecordById)
  .patch(updateRetailRecord)
  .delete(deleteRetailRecord);

module.exports = router;