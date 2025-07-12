const { productcondition } = require('../models');

exports.getAllProductConditions = async (req, res) => {
  try {
    const conditions = await productcondition.findAll({
      attributes: ['id', 'name']
    });

    return res.success('Product conditions fetched successfully', conditions, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};
