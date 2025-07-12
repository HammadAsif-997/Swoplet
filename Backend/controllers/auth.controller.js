const { user: User } = require('../models');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.error('Email is already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    return res.success('User registered successfully', { userId: newUser.id, date }, 201);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).json({
        message: 'User not found',
        status: 404
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch){
      return res.status(401).json({
        message: 'Invalid credentials',
        status: 401
      });
    }

    const token = generateToken(foundUser.id);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    return res.success('Login successful', {
      token,
      userId: foundUser.id,
      date
    }, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};


// Logout user
exports.logout = async (req, res) => {
  try {
    return res.success('Logout successful', null, 200);
  } catch (error) {
    return res.error(error.message || 'Something went wrong during logout', 500);
  }
};
