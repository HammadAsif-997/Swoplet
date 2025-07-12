const { productcategory } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await productcategory.findAll({
      attributes: ['id', 'name']
    });
    return res.success('Product categories fetched successfully', categories, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};
