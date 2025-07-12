const { body, query } = require('express-validator');

// POST /favourites
const addFavouriteValidation = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
];

// GET /favourites
const getFavouritesValidation = [
  query('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required')
];


// DELETE /favourites
const removeFavouriteValidation = [
  query('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  query('product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
];

module.exports = {
  addFavouriteValidation,
  getFavouritesValidation,
  removeFavouriteValidation
}; 