const express = require('express');
const router = express.Router();

const reportController = require('../controllers/userreport.controller');
const validateRequest = require('../middleware/validateRequest');
const { reportUserValidation } = require('../validator/userreport.validator');


router.post('/report-user', reportUserValidation, validateRequest, reportController.reportUser);
router.get('/reported-users', reportController.getAllReports);


module.exports = router;
