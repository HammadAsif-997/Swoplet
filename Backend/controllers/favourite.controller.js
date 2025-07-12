// favourite.controller.js

const db = require('../models');
const Favourite = db.favourite; // ✅ Import the model
const Product = db.productlisting; // Optional: to include product data
const Media = db.mediafile; // ✅ needed for media inclusion

// POST /api/favourites - Add a favourite
exports.addFavourite = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // ✅ Check if it already exists
    const existing = await Favourite.findOne({ where: { user_id, product_id } });
    if (existing) {
      return res.status(400).json({
        message: 'Product already in favourites',
        status: 400
      });
    }

    const fav = await Favourite.create({ user_id, product_id });
    return res.status(201).json({
      message: 'Added to favourites',
      status: 201,
      data: fav
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

// GET /api/favourites?user_id=1 - Get user's favourites
exports.getFavourites = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: 'user_id is required',
        status: 400
      });
    }

    const favourites = await Favourite.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: 'productlisting',
          where: { status: 1 }, // Only fetch active products
          include: [
            {
              model: Media,
              as: 'mediafiles',
              attributes: ['file_path'],
              required: true
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // reshape each favourite exactly as you want
    const favArray = favourites.map(fav => {
      const p = fav.productlisting;
      return {
        id: fav.id,
        user_id: fav.user_id,
        product_id: fav.product_id,
        saved_at: fav.saved_at || fav.createdAt,
        createdAt: fav.createdAt,
        updatedAt: fav.updatedAt,
        productlisting: {
          id: p.id,
          title: p.title,
          description: p.description,
          category_id: p.category_id,
          price: p.price,
          product_condition_id: p.product_condition_id,
          tags: p.tags,
          location: p.location,
          created_by_id: p.created_by_id,
          status: p.status,
          previous_status: p.previous_status,
          is_deleted: p.is_deleted,
          created_at: p.created_at || p.createdAt,
          updated_at: p.updated_at || p.updatedAt,
          mediafiles: (p.mediafiles || []).map(m => ({
            file_path: m.file_path
          }))
        }
      };
    });

    return res.status(200).json({
      message: 'Fetched all favourites',
      status: 200,
      data: {
        favourites: favArray
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};



// DELETE /api/favourites?user_id=1&product_id=2
exports.removeFavourite = async (req, res) => {
  try {
    const { user_id, product_id } = req.query; // ✅ use query param

    const removed = await Favourite.destroy({ where: { user_id, product_id } });
    if (!removed) {
      return res.status(404).json({
        message: 'Favourite not found',
        status: 404
      });
    }

    return res.status(200).json({
      message: 'Removed from favourites',
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};
