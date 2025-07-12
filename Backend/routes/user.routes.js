const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getCurrentUserValidation,
  updateCurrentUserValidation,
  getAllUsersValidation
} = require('../validator/user.validator');

router.get('/user', protect, getCurrentUserValidation, validateRequest, userController.getCurrentUser);      
router.put('/user', protect, updateCurrentUserValidation, validateRequest, userController.updateCurrentUser);   
router.get('/users', protect, getAllUsersValidation, validateRequest, userController.getAllUsers);        

module.exports = router;
