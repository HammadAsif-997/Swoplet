import React, { useEffect, useState } from 'react';
import { BASE_URL } from "../../constants/config.js";
import { Check } from "lucide-react";

function StarRating({ rating, onRatingChange, sellerId, readOnly = false }) {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onRatingChange && onRatingChange(sellerId, star)}
                    className={`text-2xl transition-colors focus:outline-none ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } ${readOnly ? 'cursor-default' : 'hover:text-yellow-400'}`}
                    tabIndex={readOnly ? -1 : 0}
                    disabled={readOnly}
                >
                    ★
                </button>
            ))}
            {!readOnly && (
                <span className="ml-2 text-sm text-gray-600">
          {rating ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
        </span>
            )}
        </div>
    );
}

function SellerReviewList() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState(false);
    const buyerId = localStorage.getItem('userId');

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}/seller-to-review?buyer_id=${buyerId}`);
            const result = await response.json();
            setReviews(result.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (buyerId) fetchReviews();
        else setLoading(false);
    }, [buyerId]);

    const handleRatingChange = (sellerId, rating) => {
        setFormData(prev => ({
            ...prev,
            [sellerId]: {
                ...prev[sellerId],
                review_value: rating
            }
        }));
    };

    const handleReviewChange = (sellerId, review) => {
        setFormData(prev => ({
            ...prev,
            [sellerId]: {
                ...prev[sellerId],
                review_comment: review
            }
        }));
    };

    const handleSubmit = async (to_review_id) => {
        setFeedback(true);
        const review = formData[to_review_id];

        if (!review?.review_value) {
            alert("Please select a rating before submitting");
            setFeedback(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/add-seller-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to_review_id,
                    review_value: parseInt(review.review_value, 10),
                    review_comment: review.review_comment || ''
                })
            });

            const data = await response.json();

            if (response.ok) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await fetchReviews();
            } else {
                console.log("Error: " + (data.message || "Failed to submit review"));
            }
        } catch (error) {
            console.error("Review submission error:", error);
        } finally {
            setFeedback(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (feedback) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full border border-blue-100">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#e0edfa" />
                            <path
                                d="M9 12l2 2l4-4"
                                stroke="#2563eb"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
                        Thank you for your feedback!
                    </h2>
                    <p className="text-gray-700 text-center text-base">
                        Your review helps make Swoplet better for everyone.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4">
            {reviews && reviews.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col lg:flex-row"
                            >
                                {/* Left Section - Seller Details */}
                                <div className="lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-r border-gray-100">
                                    <div className="h-full flex flex-col">
                                        {/* Seller Header */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.seller_name)}`}
                                                alt={review.seller_name}
                                                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {review.seller_name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-yellow-400 text-xl">★</span>
                                                        <span className="text-xl font-bold text-blue-700">
                                                            {review.seller_average_rating_value?.toFixed(1)}
                                                        </span>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                                        {review.seller_total_rating} ratings
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Information */}
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={review.media_file}
                                                    alt={review.product_name}
                                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {review.product_name}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-9.5A8 8 0 0112 3a8 8 0 018 8.5c0 4.127-3.582 9.5-8 9.5z"/>
                                                                <circle cx="12" cy="11" r="3"/>
                                                            </svg>
                                                            <span className="font-medium">{review.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                                                <path d="M16 2v4M8 2v4M3 10h18"/>
                                                            </svg>
                                                            <span className="font-medium">Purchased on {formatDate(review.purchase_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Metadata */}
                                        <div className="mt-auto">
                                            <div className="bg-blue-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-blue-800">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                    <span className="text-sm font-semibold">Ready to review this seller</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Rating Form */}
                                <div className="lg:w-3/5 p-6 bg-gray-50">
                                    <div className="h-full flex flex-col justify-center">
                                        <div className="max-w-lg mx-auto w-full">
                                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">
                                                    Rate your experience
                                                </h4>
                                                <p className="text-gray-600 text-center mb-6">
                                                    How was your experience with <span className="font-semibold text-blue-600">{review.seller_name}</span>?
                                                </p>
                                                
                                                {/* Rating Section */}
                                                <div className="text-center mb-6">
                                                    <StarRating
                                                        rating={parseInt(formData[review.id]?.review_value, 10) || 0}
                                                        onRatingChange={handleRatingChange}
                                                        sellerId={review.id}
                                                    />
                                                </div>
                                                
                                                {/* Review Comment Section */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label
                                                            htmlFor={`review-${review.id}`}
                                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                                        >
                                                            Share your experience (optional)
                                                        </label>
                                                        <textarea
                                                            id={`review-${review.id}`}
                                                            rows="4"
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                                            placeholder="Tell others about your experience with this seller..."
                                                            value={formData[review.id]?.review_comment || ''}
                                                            onChange={(e) => handleReviewChange(review.id, e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    {/* Submit Button */}
                                                    <div className="pt-2">
                                                        <button
                                                            onClick={() => handleSubmit(review.id)}
                                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-base font-semibold shadow-md hover:shadow-lg"
                                                        >
                                                            Submit Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : <div className="text-center py-8 text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
                <p>No sellers to review</p>
            </div>}
        </div>
    );
}

export default SellerReviewList;
