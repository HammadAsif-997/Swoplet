const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidation,
  loginValidation,
  logoutValidation
} = require('../validator/auth.validator');

router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/logout', logoutValidation, validateRequest, authController.logout);

module.exports = router;




