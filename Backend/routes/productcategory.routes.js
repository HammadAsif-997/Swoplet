const express = require('express');
const router = express.Router();
const productcategoryController = require('../controllers/productcategory.controller');

router.get('/product-categories', productcategoryController.getAllCategories);

module.exports = router;
