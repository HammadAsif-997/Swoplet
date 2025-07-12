const { user: User } = require('../models');
const { Op } = require('sequelize');

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.success('Users fetched successfully', {
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    }, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};

// Get current user by JWT
exports.getCurrentUser = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.error('User not found', 404);
    }

    return res.success('User fetched successfully', user, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};

// Update current user
exports.updateCurrentUser = async (req, res) => {
  const userId = req.user?.id;
  const { username, image_url, bio } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.error('User not found', 404);
    }

    if (username) user.username = username;
    if (image_url) user.image_url = image_url;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    return res.success('User updated successfully', updatedUser, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};
