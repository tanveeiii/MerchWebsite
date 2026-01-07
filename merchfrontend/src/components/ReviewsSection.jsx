"use client";
import React, { useEffect, useState } from 'react';
import { Star, User, Image as ImageIcon } from 'lucide-react';

const ReviewsSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        const fetchReviews = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `review/product/${productId}`);
                const json = await res.json();
                if (json.data) {
                    setReviews(json.data);
                }
            } catch (err) {
                console.error("Failed to load reviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    if (loading) return <div className="py-10 text-center text-gray-500">Loading reviews...</div>;

    return (
        <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Customer Reviews <span className="text-gray-400 text-lg font-normal">({reviews.length})</span>
            </h2>

            {reviews.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {reviews.map((review) => (
                        <div key={review.review_id} className="border-b pb-8 last:border-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {review.user?.first_name} {review.user?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            fill={i < review.rating ? "currentColor" : "none"} 
                                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 mb-2">{review.review_title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{review.review_text}</p>

                            {/* Review Images */}
                            {review.ReviewImage && review.ReviewImage.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {review.ReviewImage.map((img) => (
                                        <div key={img.review_image_id} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                            <img 
                                                src={img.image_url} 
                                                alt="Review attachment" 
                                                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsSection;