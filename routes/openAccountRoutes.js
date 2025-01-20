// routes/openAccountRoutes.js
const express = require('express');
const router = express.Router();
const {
  getOpenAccountRecords,
  createOpenAccountRecord,
  updateOpenAccountRecord,
  deleteOpenAccountRecord
} = require('../controllers/openAccountController');

router.route('/')
  .get(getOpenAccountRecords)
  .post(createOpenAccountRecord);

router.route('/:id')
  .patch(updateOpenAccountRecord)
  .delete(deleteOpenAccountRecord);

module.exports = router;