const express = require('express');
const router = express.Router();

const productlistingController = require('../controllers/productlisting.controller');
const shareController = require('../controllers/share.controller');
const validateRequest = require('../middleware/validateRequest');
const {
  createListingValidation,
  updateListingValidation,
  getListingByIdValidation,
  deleteListingValidation,
  updateListingStatusValidation
} = require('../validator/productlisting.validator');

// ✅ GET all approved product listingss
router.get('/products/approved', productlistingController.getApprovedProductListings);

// ✅ GET product by ID (public shareable endpoint)
router.get('/product/:id', shareController.getShareableProduct);

// ✅ GET a single listing by ID (via query param)
router.get(
  '/listings',
  getListingByIdValidation,
  validateRequest,
  productlistingController.getListingById
);

// ✅ CREATE a listing
router.post(
  '/listings',
  createListingValidation,
  validateRequest,
  productlistingController.createListing
);

// ✅ UPDATE a listing by ID
router.put(
  '/listings/:id',
  updateListingValidation,
  validateRequest,
  productlistingController.updateListing
);

// ✅ DELETE a listing by ID (via query param)
router.delete(
  '/listings',
  deleteListingValidation,
  validateRequest,
  productlistingController.deleteProductListing
);

// ✅ GET all product listings by a specific user (via query param)
router.get(
  '/user-products',
  productlistingController.getUserProducts
);

// ✅ UPDATE a listing status by ID and status
router.put(
  '/listings/:id/update-status',
  updateListingStatusValidation,
  validateRequest,
  productlistingController.updateProductStatus);

// ✅ MARK a product as sold
router.put(
  '/product-sold',
  productlistingController.markProductAsSold
);

module.exports = router;
