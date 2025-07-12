const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      status: 422,
      errors: errors.array()
    });
  }
  next();
};

module.exports = validateRequest;
