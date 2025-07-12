const express = require('express');
const router = express.Router();
const productConditionController = require('../controllers/productcondition.controller');

router.get('/product-conditions', productConditionController.getAllProductConditions);

module.exports = router;
