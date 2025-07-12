const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favourite.controller');
const validateRequest = require('../middleware/validateRequest');
const {
  addFavouriteValidation,
  getFavouritesValidation,
  removeFavouriteValidation
} = require('../validator/favourite.validator');

// POST
router.post('/favourites', addFavouriteValidation, validateRequest, favouriteController.addFavourite); // ✅ Add

// GET
router.get('/favourites', getFavouritesValidation, validateRequest, favouriteController.getFavourites); // ✅ Get by user_id (query)

// DELETE
router.delete('/favourites', removeFavouriteValidation, validateRequest, favouriteController.removeFavourite); // ✅ Remove by user_id & product_id

module.exports = router;
