const { body } = require('express-validator');

exports.searchProductValidation = [
    body('query')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 }).withMessage('Query must be a non-empty string'),

    body('category_ids')
        .optional()
        .isArray({ min: 1 }).withMessage('category_ids must be an array of integers')
        .custom((arr) => arr.every(Number.isInteger)).withMessage('Each category_id must be an integer'),

    body('condition_ids')
        .optional()
        .isArray({ min: 1 }).withMessage('condition_ids must be an array of integers')
        .custom((arr) => arr.every(Number.isInteger)).withMessage('Each condition_id must be an integer'),

    body('min_price')
        .optional()
        .isFloat({ min: 0 }).withMessage('min_price must be a positive number'),

    body('max_price')
        .optional()
        .isFloat({ min: 0 }).withMessage('max_price must be a positive number'),

    body('location')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 }).withMessage('Location must be a non-empty string'),

    body('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0'),

    body('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be an integer greater than 0'),

    body('sort_by')
        .optional()
        .isIn(['created_at', 'price', 'title']).withMessage('sort_by must be one of: created_at, price, title'),

    body('sort_order')
        .optional()
        .isIn(['ASC', 'DESC', 'asc', 'desc']).withMessage('sort_order must be either ASC or DESC')
];
