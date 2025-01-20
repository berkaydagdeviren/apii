// routes/openAccountRoutes.js
const express = require('express');
const router = express.Router();
const {
  getOpenAccountRecords,
  updateOpenAccountRecord,
  deleteOpenAccountRecord
} = require('../controllers/openAccountController');

router.route('/')
  .get(getOpenAccountRecords);

router.route('/:id')
  .patch(updateOpenAccountRecord)
  .delete(deleteOpenAccountRecord);

module.exports = router;