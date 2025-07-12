const { body, query, param } = require('express-validator');
const { APPROVAL_STATUS } = require('../constants/productStatus');

// POST /listings
const createListingValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('category_id')
    .isInt({ gt: 0 })
    .withMessage('A valid category_id is required'),

  body('price')
    .isDecimal()
    .withMessage('Price must be a decimal'),

  body('product_condition_id')
    .isInt({ gt: 0 })
    .withMessage('A valid product_condition_id is required'),

  body('created_by_id')
    .isInt({ gt: 0 })
    .withMessage('A valid created_by_id is required'),

  body('location')
    .notEmpty()
    .withMessage('Location is required'),

  body('mediafiles')
    .isArray({ min: 1, max: 4 })
    .withMessage('Mediafiles must be an array with 1 to 4 items'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array if provided'),

];

// PUT /listings/:id 
const updateListingValidation = [
  param('id')
    .isInt()
    .withMessage('Listing ID must be a valid integer in the URL'),

  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('category_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('A valid category_id is required'),

  body('price')
    .optional()
    .isDecimal()
    .withMessage('Price must be a decimal'),

  body('product_condition_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('A valid product_condition_id is required'),

  body('status')
    .optional()
    .isInt()
    .withMessage('A valid numeric status is required'),

  body('location')
    .optional()
    .notEmpty()
    .withMessage('Location cannot be empty'),

  body('mediafiles')
    .optional()
    .isArray({ max: 4 })
    .withMessage('Mediafiles must be an array with up to 4 items'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array if provided'),
];

// GET /listings?id=...
const getListingByIdValidation = [
  query('id')
    .isInt()
    .withMessage('Query param ?id must be a valid integer'),
];

// DELETE /listings?id=...
const deleteListingValidation = [
  query('id')
    .isInt()
    .withMessage('Query param ?id must be a valid integer'),
];


// PUT /listings/:id/update-status
const updateListingStatusValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),

  body('status')
    .exists()
    .withMessage('New status is required')
    .isInt()
    .withMessage('Status must be a number')
    .isIn(Object.values(APPROVAL_STATUS))
    .withMessage('Invalid status value')
];



module.exports = {
  createListingValidation,
  updateListingValidation,
  getListingByIdValidation,
  deleteListingValidation,
  updateListingStatusValidation,
};
