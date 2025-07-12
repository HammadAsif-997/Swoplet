const { body } = require('express-validator');

exports.reportUserValidation = [
  body('reported_by_id')
    .isInt({ min: 1 })
    .withMessage('Valid reporter user ID is required'),
  body('reported_user_id')
    .isInt({ min: 1 })
    .withMessage('Valid reported user ID is required'),

  body('reason')
  .isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long')

];
