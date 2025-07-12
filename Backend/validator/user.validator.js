const { body, query } = require('express-validator');

// GET /user
const getCurrentUserValidation = [
  // No validation needed as it uses the protect middleware
];

// PUT /user
const updateCurrentUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least three characters long'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .matches(/^[\w.-]+@(hs-fulda\.de|sfsu\.ed)$/)
    .withMessage('Email must be a valid hs-fulda.de or sfsu.ed address'),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be more than eight characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'),
];

// GET /users
const getAllUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
];

module.exports = {
  getCurrentUserValidation,
  updateCurrentUserValidation,
  getAllUsersValidation
}; 