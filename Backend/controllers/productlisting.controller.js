const { productlisting, mediafile, productcategory, productcondition, user, favourite, sellerReview } = require('../models');
const { APPROVAL_STATUS, DELETE_STATUS } = require('../constants/productStatus');
const now = new Date().toISOString();




exports.getApprovedProductListings = async (req, res) => {
  try {
    const listings = await productlisting.findAll({
      attributes: [
        'id', 'title', 'description', 'price', 'tags', 'location', 'status', 'created_at', 'updated_at'
      ],
      where: {
        status: APPROVAL_STATUS.APPROVED,
        is_deleted: DELETE_STATUS.ACTIVE
      },
      include: [
        { model: mediafile, as: 'mediafiles', attributes: ['file_path'], where: { is_approved: true }, required: true },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { model: user, as: 'creator' }
      ]
    });
    return res.success('Product listings fetched successfully', listings, 200);
  } catch (err) {
    return res.error(err.message || 'Internal Server Error', 500);
  }
};

async function getSellerReviewStats(seller_id) {
  console.log(seller_id);
  const reviews = await sellerReview.findAll({
    where: { reviewee_id: seller_id },
    attributes: ['review_value']
  });

  const total_rating = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + (r.review_value || 0), 0);
  const avg_rating = total_rating > 0 ? sum / total_rating : 0;

  return { total_rating, avg_rating };
}

exports.getListingById = async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const listing = await productlisting.findByPk(id, {
      include: [
        { model: mediafile, as: 'mediafiles' },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { model: user, as: 'creator' }
      ]
    });
    if (!listing) return res.error('Listing not found', 404);
    const {total_rating=0, avg_rating=0} = await getSellerReviewStats(listing.created_by_id)
    const response = {...listing.toJSON(), seller_reviews: {total_rating, avg_rating}};
    return res.success('Listing fetched successfully', response, 200);
  } catch (err) {
    return res.error(err.message || 'Internal Server Error', 500);
  }
};

exports.createListing = async (req, res) => {
  try {
    const { mediafiles = [], ...data } = req.body;
    data.status = APPROVAL_STATUS.PENDING;
    data.previous_status = APPROVAL_STATUS.PENDING;

    // 🔧 Convert tags array to comma-separated string
    if (Array.isArray(data.tags)) {
      data.tags = data.tags.join(',');
    }

    const listing = await productlisting.create(
      { ...data, mediafiles, created_at: now, updated_at: now },
      { include: [{ model: mediafile, as: 'mediafiles' }] }
    );

    return res.success('Listing created successfully', listing, 201);
  } catch (err) {
    return res.error(err.message || 'Failed to create listing', 500);
  }
};




exports.updateListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existingListing = await productlisting.findByPk(id);
    if (!existingListing) {
      return res.error('Listing not found', 404);
    }

    const { tags, mediafiles = [], ...updateData } = req.body;

    // ── 1) Handle tags array → CSV
    if (Array.isArray(tags)) {
      updateData.tags = tags.join(',');
    } else if (typeof tags === 'string') {
      updateData.tags = tags;
    }

    // ── 2) Force status reset to PENDING, saving old status
    updateData.previous_status = APPROVAL_STATUS.PENDING;
    updateData.status = APPROVAL_STATUS.PENDING;
    updateData.updated_at = now;

    // ── 3) Replace mediafiles (unchanged from before)
    if (Array.isArray(mediafiles) && mediafiles.length > 0) {
      // delete old ones
      const oldMedia = await mediafile.findAll({ where: { product_id: id } });
      if (oldMedia.length) {
        await mediafile.destroy({ where: { id: oldMedia.map(m => m.id) } });
      }
      // bulk‐create new ones (unapproved by default)
      const newMedia = mediafiles.map(f => ({
        product_id: id,
        file_path: f.file_path,
        is_approved: false
      }));
      await mediafile.bulkCreate(newMedia);
    }

    // ── 4) Apply the update to the listing
    await productlisting.update(updateData, { where: { id } });

    // ── 5) Remove from everyone’s wishlist
    await favourite.destroy({
      where: { product_id: id }
    });

    // ── 6) Return the fresh listing
    const updatedListing = await productlisting.findByPk(id, {
      include: [
        { model: mediafile, as: 'mediafiles' },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' },
        { model: user, as: 'creator' }
      ]
    });

    return res.success('Listing updated successfully', updatedListing, 200);

  } catch (err) {
    return res.error(err.message || 'Failed to update listing', 500);
  }
};


exports.deleteProductListing = async (req, res) => {
  try {
    const id = parseInt(req.query.id);
    const listing = await productlisting.findByPk(id);
    if (!listing) return res.error('Listing not found', 404);

    listing.is_deleted = DELETE_STATUS.DELETED;
    await listing.save();

    return res.success('Product listing deleted successfully', null, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to delete listing', 500);
  }
};

//retrive products of an user 
exports.getUserProducts = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: 'user_id is required',
        status: 400
      });
    }

    const products = await productlisting.findAll({
      where: {
        created_by_id: user_id,
        is_deleted: DELETE_STATUS.ACTIVE // ✅ consistent with your constants
      },
      include: [
        { model: mediafile, as: 'mediafiles' },
        { model: productcategory, as: 'category' },
        { model: productcondition, as: 'condition' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      message: 'User products retrieved successfully',
      status: 200,
      data: products
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Server error',
      status: 500
    });
  }
};



// update product status
exports.updateProductStatus = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { status: newStatus } = req.body;

    const product = await productlisting.findOne({
      where: {
        id: productId,
        is_deleted: DELETE_STATUS.ACTIVE
      }
    });

    if (!product) {
      return res.error('Product not found or has been deleted', 404);
    }

    await product.update({
      previous_status: product.status,
      status: newStatus,
      updated_at: new Date().toISOString()
    });

    const updatedListing = await productlisting.findByPk(productId);
    return res.success('Product status updated successfully', updatedListing, 200);

  } catch (error) {
    return res.error(error.message || 'Internal Server Error', 500);
  }
};

exports.markProductAsSold = async (req, res) => {
  try {
    const { buyer_id, product_id } = req.body;
    if (!buyer_id || !product_id) {
      return res.error('seller_id, buyer_id, and product_id are required', 400);
    }

    // Find the product
    const product = await productlisting.findByPk(product_id);
    if (!product) {
      return res.error('Product not found', 404);
    }
    if (product.status !== 1) {
      return res.error('Only the approved product can be sold', 404);
    }
    const seller_id = product.created_by_id;

    // Update product status to sold (3), save previous status
    await product.update({
      previous_status: product.status,
      status: 3, // 3 = sold
      updated_at: new Date().toISOString()
    });

    // Create seller_to_review entry
    const sellerToReviewEntry = await require('../models').sellerToReview.create({
      seller_id,
      buyer_id,
      product_id,
      purchase_date: new Date(),
      is_reviewed: false
    });

    return res.success('Product marked as sold and review entry created', {
      product,
      sellerToReview: sellerToReviewEntry
    }, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to mark product as sold', 500);
  }
};

