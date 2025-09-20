const { productlisting, mediafile, productcategory, productcondition, user } = require('../models');
const { APPROVAL_STATUS, DELETE_STATUS } = require('../constants/productStatus');

exports.getShareableProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (!id || isNaN(id)) {
      return res.error('Invalid product ID', 400);
    }

    const listing = await productlisting.findOne({
      where: {
        id: id,
        status: APPROVAL_STATUS.APPROVED, // Only approved products for sharing
        is_deleted: DELETE_STATUS.ACTIVE
      },
      include: [
        { 
          model: mediafile, 
          as: 'mediafiles',
          where: { is_approved: true }, // Only approved media for sharing
          required: false 
        },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { 
          model: user, 
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!listing) {
      return res.error('Product not found or not available for sharing', 404);
    }

    const response = {
      ...listing.toJSON(),
      shareable_url: `${process.env.FRONTEND_URL}/product/${listing.id}`
    };

    return res.success('Product fetched successfully for sharing', response, 200);
  } catch (err) {
    return res.error(err.message || 'Internal Server Error', 500);
  }
};