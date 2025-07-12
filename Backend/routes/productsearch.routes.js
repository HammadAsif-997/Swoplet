const express = require('express');
const router = express.Router();
const productsearchController = require('../controllers/productsearch.controller');
const { searchProductValidation } = require('../validator/productsearch.validator');
const validateRequest = require('../middleware/validateRequest');


router.post('/products/search', searchProductValidation, validateRequest, productsearchController.searchProducts);


module.exports = router;
