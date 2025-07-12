import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {BASE_URL} from "../../constants/config.js";

// StarRating component for display and input
function StarRating({ rating, onRatingChange, sellerId, readOnly = false }) {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onRatingChange && onRatingChange(sellerId, star)}
                    className={`text-2xl transition-colors focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${readOnly ? 'cursor-default' : 'hover:text-yellow-400'}`}
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
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState(false);
    const buyerId = localStorage.getItem('userId');

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}seller-to-review?buyer_id=${buyerId}`);
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
            const response = await fetch(`${BASE_URL}add-seller-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to_review_id,
                    review_value: parseInt(review.review_value),
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

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (feedback) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full border border-blue-100">
                    <div className="mb-4">
                        {/* Swoplet blue checkmark in a circle */}
                        <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#e0edfa" />
                            <path d="M9 12l2 2l4-4" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Thank you for your feedback!</h2>
                    <p className="text-gray-700 text-center text-base">Your review helps make Swoplet better for everyone.</p>
                </div>
            </div>
        );
    }

    // Helper for date formatting
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/userprofile')}
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium mb-4 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to profile
                </button>
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Rate Your Sellers</h1>
                    <p className="text-gray-600 text-base">Share your experience and help make Swoplet a safer, friendlier marketplace for everyone.</p>
                </div>
                <div className="space-y-5">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col lg:flex-row group border border-gray-100">
                                {/* Left Side - Product and Seller Details */}
                                <div className="lg:w-2/5 p-4 sm:p-5 flex flex-col justify-center gap-2 min-w-[180px] max-w-[320px]">
                                    <div className="flex items-start gap-3">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.media_file}
                                                alt={review.product_name}
                                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                            />
                                        </div>
                                        {/* Product and Seller Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {/* Seller Avatar (placeholder if not available) */}
                                                <img
                                                    src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(review.seller_name)}
                                                    alt={review.seller_name}
                                                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <h3 className="text-base sm:text-xl font-semibold text-gray-900 leading-tight">
                                                        {review.seller_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-yellow-400 text-lg font-bold">★</span>
                                                        <span className="text-lg font-bold text-blue-700">{review.seller_average_rating_value?.toFixed(1)}</span>
                                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                                            {review.seller_total_rating} ratings
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 truncate">
                                                {review.product_name}
                                            </h4>
                                            <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-blue-500 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-9.5A8 8 0 0112 3a8 8 0 018 8.5c0 4.127-3.582 9.5-8 9.5z"/><circle cx="12" cy="11" r="3"/></svg>
                                                    <span className="font-medium">{review.location}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-blue-500 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                                                    <span className="font-medium">{formatDate(review.purchase_date)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Right Side - Rating and Review */}
                                <div
                                    className="lg:w-3/5 p-4 sm:p-6 flex flex-col justify-center gap-2 bg-white border-t lg:border-t-0 lg:border-l border-gray-50">
                                    <div className="space-y-4">
                                        {/* Star Rating */}
                                        <div>
                                            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                                Rate your experience with <span className="font-semibold">{review.seller_name}</span>
                                            </h4>
                                            <StarRating
                                                rating={parseInt(formData[review.id]?.review_value) || 0}
                                                onRatingChange={handleRatingChange}
                                                sellerId={review.id}
                                            />
                                        </div>
                                        {/* Review Text */}
                                        <div>
                                            <label htmlFor={`review-${review.id}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                Write a review (optional)
                                            </label>
                                            <textarea
                                                id={`review-${review.id}`}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Share your experience with this seller..."
                                                value={formData[review.id]?.review_comment || ''}
                                                onChange={(e) => handleReviewChange(review.id, e.target.value)}
                                            />
                                        </div>
                                        {/* Submit Button */}
                                        <div>
                                            <button
                                                onClick={() => handleSubmit(review.id)}
                                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base font-semibold"
                                            >
                                                Submit Rating
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-base">No reviews are pending! All are completed. Thank you for helping make Swoplet a better marketplace.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SellerReviewList;
