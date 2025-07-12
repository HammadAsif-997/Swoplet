const { Op } = require('sequelize');
const { productlisting, mediafile, productcategory, productcondition, user } = require('../models');

exports.searchProducts = async (req, res) => {
  try {
    const {
      query,
      min_price,
      max_price,
      location,
      category_ids,
      condition_ids,
      status,
      page = 1,
      limit = 50,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.body || {};

    const offset = (page - 1) * limit;
    const filters = {};

    filters.status = typeof status !== 'undefined' && status !== null && status !== '' ? status : 1;

    if (query) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        { tags: { [Op.like]: `%${query}%` } }
      ];
    }

    if (min_price && max_price) {
      filters.price = {
        [Op.between]: [parseFloat(min_price), parseFloat(max_price)]
      };
    } else if (min_price) {
      filters.price = { [Op.gte]: parseFloat(min_price) };
    } else if (max_price) {
      filters.price = { [Op.lte]: parseFloat(max_price) };
    }

    if (location) {
      filters.location = {
        [Op.like]: `%${location}%`,
        [Op.not]: null
      };
    }

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      filters.category_id = { [Op.in]: category_ids.map(Number) };
    }

    if (Array.isArray(condition_ids) && condition_ids.length > 0) {
      filters.product_condition_id = { [Op.in]: condition_ids.map(Number) };
    }

    const validSortFields = ['created_at', 'price', 'title'];
    const validSortOrders = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = validSortOrders.includes((sort_order || '').toUpperCase()) ? sort_order.toUpperCase() : 'DESC';

    const { count, rows: products } = await productlisting.findAndCountAll({
      where: filters,
      attributes: ['id', 'title', 'description', 'price', 'tags', 'location', 'status', 'created_at', 'updated_at'],
      include: [
        {
          model: mediafile,
          as: 'mediafiles',
          attributes: ['file_path'],
          required: true
        },
        {
          model: productcategory,
          as: 'category'
        },
        {
          model: productcondition,
          as: 'condition'
        },
        {
          model: user,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'bio', 'image_url', 'createdAt', 'updatedAt']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortDirection]]
    });

    const result = products.map(product => {
      const data = product.toJSON();
      return {
        ...data,
        media_link: data.mediafiles[0]?.file_path || null
      };
    });

    return res.success('Filtered products fetched successfully', {
      products: result,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      filters: {
        sort_by: sortField,
        sort_order: sortDirection,
        location: location || null,
        min_price: min_price || null,
        max_price: max_price || null,
        category_ids: category_ids || [],
        condition_ids: condition_ids || []
      }
    }, 200);
  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};
