const { sellerToReview, user, productlisting, mediafile, sellerReview } = require('../models');

// Helper function to get seller's total reviews and average rating
async function getSellerReviewStats(seller_id) {
  const reviews = await sellerReview.findAll({
    include: [{
      model: sellerToReview,
      as: 'toReview',
      where: { seller_id },
      attributes: []
    }],
    attributes: ['review_value']
  });
  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + (r.review_value || 0), 0);
  const avg = total > 0 ? sum / total : 0;
  return { total, avg };
}

// GET /seller-to-review?buyer_id=xxx
exports.getPendingSellerReviews = async (req, res) => {
  try {
    const { buyer_id } = req.query;
    if (!buyer_id) {
      return res.error('buyer_id is required', 400);
    }

    // Find all seller_to_review entries for this buyer where is_reviewed is false
    const entries = await sellerToReview.findAll({
      where: {
        buyer_id,
        is_reviewed: false
      },
      include: [
        { model: user, as: 'seller', attributes: ['id', 'username'] },
        { model: productlisting, as: 'product', attributes: ['id', 'title', 'location'],
          include: [
            { model: mediafile, as: 'mediafiles', attributes: ['file_path'], required: false, limit: 1 }
          ]
        }
      ]
    });

    // For each entry, get seller stats
    const result = await Promise.all(entries.map(async entry => {
      const stats = await getSellerReviewStats(entry.seller_id);
      return {
        id: entry.id,
        seller_id: entry.seller_id,
        seller_name: entry.seller?.username,
        product_id: entry.product_id,
        product_name: entry.product?.title,
        location: entry.product?.location,
        purchase_date: entry.purchase_date,
        media_file: entry.product?.mediafiles && entry.product.mediafiles.length > 0 ? entry.product.mediafiles[0].file_path : null,
        seller_average_rating_value: stats.avg,
        seller_total_rating: stats.total
      };
    }));

    return res.success('Pending seller reviews fetched successfully', result, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to fetch seller reviews', 500);
  }
};

// POST /add-seller-review
exports.addSellerReview = async (req, res) => {
  try {
    const {to_review_id, review_value, review_comment} = req.body;
    if (!to_review_id || typeof review_value === 'undefined') {
      return res.error('to_review_id and review_value are required', 400);
    }

    // Fetch the seller_to_review record
    const toReview = await sellerToReview.findByPk(to_review_id);
    if (!toReview) {
      return res.error('seller_to_review record not found', 404);
    }
    const reviewee_id = toReview.seller_id;
    const reviewer_id = toReview.buyer_id;
    // Update is_reviewed to true
    toReview.is_reviewed = true;
    await toReview.save();

    // Create seller_review record
    const review = await sellerReview.create({
      reviewee_id,
      reviewer_id,
      to_review_id,
      review_value,
      review_comment: review_comment || null
    });

    return res.success('Seller review added successfully', {review, updated_seller_to_review: toReview}, 201);
  } catch (err) {
    return res.error(err.message || 'Failed to add seller review', 500);
  }
}; 