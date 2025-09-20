import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/config";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import {User} from "lucide-react";
import {callApi} from "../../../utils/apiHandler.js";

const SellerReview = ({ sellerId, avgRating }) => {
  const [sellerReviews, setSellerReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    const fetchSellerReviews = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        const response = await callApi({
            url: `${BASE_URL}seller-review/${sellerId}`
        });

        if (response.status === 200) {
          setSellerReviews(response.data);
        } else {
          setError(response.error || "Failed to fetch seller reviews");
        }
      } catch (err) {
        setError("Network error while fetching seller reviews");
        console.error("Error fetching seller reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerReviews();
  }, [sellerId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleProductDetails = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!sellerReviews) return null;

  return avgRating && avgRating > 0 ? (
      <div className="space-y-6">
        {/* Seller Rating Summary */}
        <div>
          <li className="mt-4 mb-1 font-semibold text-black-700">Seller average rating</li>
          <li className="list-none p-0 m-0">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 shadow-sm w-fit">
              {/* Star rating display */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-xl ${star <= (avgRating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-blue-700 font-bold text-base">
                {avgRating ? avgRating.toFixed(1) : "No reviews yet"}
              </span>
              {sellerReviews?.total_reviews && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {sellerReviews.total_reviews} reviews
                </span>
              )}
            </div>
          </li>
        </div>

         {/* Reviews List */}
         <div>
           <div className="space-y-6">
             {sellerReviews.reviews.map((review) => (
                 <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                   <div className="flex items-start space-x-3 mb-3">
                     <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                       <User className="w-4 h-4 text-gray-500" />
                     </div>
                     
                     {/* Review Content */}
                     <div className="flex-1">
                       {/* Reviewer Name */}
                       <div className="font-medium text-gray-900 text-sm mb-1">
                         {review.reviewer.username}
                       </div>
                       
                       {/* Star Rating */}
                       <div className="flex items-center space-x-1 mb-2">
                         <div className="flex items-center space-x-0.5">
                           {[1, 2, 3, 4, 5].map(star => (
                             <span
                               key={star}
                               className={`text-sm ${star <= review.review_value ? 'text-yellow-400' : 'text-gray-300'}`}
                             >
                               ★
                             </span>
                           ))}
                         </div>
                         <span className="text-xs text-gray-500 ml-1">
                           {review.review_value} out of 5 stars
                         </span>
                       </div>
                       
                       {/* Review Date and Verified Purchase */}
                       <div className="text-xs text-gray-500 mb-2">
                         Reviewed on {formatDate(review.review_date)}
                       </div>
                       {/* Product Information - Clickable */}
                       <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                         <div
                             className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-2 -m-2"
                             onClick={() => toggleProductDetails(review.product.id)}
                         >
                           <div className="flex items-center space-x-3">
                             <div>
                               <h6 className="font-medium text-gray-900 text-sm">
                                 {review.product.title}
                               </h6>
                             </div>
                           </div>
                         </div>
                         {/* Expanded Product Details */}
                         {expandedProducts[review.product.id] && (
                             <div className="mt-3 pt-3 border-t border-gray-200">
                               <div className="space-y-2">
                                 <div>
                                   <span className="text-xs font-medium text-gray-600">Product Description:</span>
                                   <p className="text-sm text-gray-800 mt-1">
                                     {review.product.description || "No description available"}
                                   </p>
                                 </div>
                                 <div>
                                   <span className="text-xs font-medium text-gray-600">Selling Location:</span>
                                   <p className="text-sm text-gray-800 mt-1">
                                     {review.product.location}
                                   </p>
                                 </div>
                                 {review.product.media_file && (
                                     <div>
                                       <span className="text-xs font-medium text-gray-600">Product Image:</span>
                                       <div className="mt-2">
                                         <img
                                             src={review.product.media_file}
                                             alt={review.product.title}
                                             className="w-24 h-24 object-cover rounded border"
                                             onError={(e) => {
                                               e.target.style.display = "none";
                                             }}
                                         />
                                       </div>
                                     </div>
                                 )}
                               </div>
                             </div>
                         )}
                       </div>
                       {/* Full Review Comment */}
                       <div className="text-sm text-gray-800 leading-relaxed mb-4 p-2 m-2">
                         {review.review_comment}
                       </div>
                     </div>
                   </div>
                 </div>
             ))}
           </div>
         </div>
      </div>
  ) : (
      <div className="text-center py-8 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No reviews available for this seller yet.</p>
      </div>
  );
};

export default SellerReview;
