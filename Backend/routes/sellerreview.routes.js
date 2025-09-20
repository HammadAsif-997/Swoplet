const express = require('express');
const router = express.Router();

const sellerreviewController = require('../controllers/sellerreview.controller');

// GET /seller-to-review?buyer_id=xxx
router.get('/seller-to-review', sellerreviewController.getPendingSellerReviews);

// POST /add-seller-review
router.post('/add-seller-review', sellerreviewController.addSellerReview);

router.get('/seller-review/:seller_id', sellerreviewController.getSellerReviews);

module.exports = router; 