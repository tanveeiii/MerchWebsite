"use client";
import React, { useEffect, useState } from "react";
import { Loader2, Trash2, Star, MessageSquare } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/admin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  // --- Fetch Reviews ---
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/review/admin/all");
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from UI immediately
        setReviews((prev) => prev.filter((r) => r.review_id !== id));
      } else {
        CustomToast("Failed to delete review");
      }
    } catch (error) {
      console.error("Delete error:", error);
      CustomToast("Error deleting review");
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <>
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-blue-600" /> Review Moderation
            </h1>
            <p className="text-gray-500 mt-1">
              Monitor and manage customer feedback.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="font-bold text-lg text-gray-900">
              {reviews.length}
            </span>
            <span className="text-gray-500 text-sm ml-2">Total Reviews</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed text-gray-400">
            <MessageSquare size={48} className="mb-3 opacity-20" />
            <p>No reviews found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
              >
                {/* Left: Product Info */}
                <div className="flex items-center gap-4 md:w-1/4 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4 border-gray-100">
                  {/* Fallback image if product image is missing */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        review.product?.ProductImage?.[0]?.image_url ||
                        "https://readymadeui.com/images/product14.webp"
                      }
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2">
                      {review.product?.product_name || "Unknown Product"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Order #{review.order_id}
                    </p>
                  </div>
                </div>

                {/* Middle: Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="font-bold text-gray-900">
                        {review.review_title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    "{review.review_text}"
                  </p>

                  {/* Review Images (if any) */}
                  {review.ReviewImage && review.ReviewImage.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.ReviewImage.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.image_url}
                          alt="Review attachment"
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-xs">
                    <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                      {review.user?.first_name} {review.user?.last_name}
                    </div>
                    <span className="text-gray-400">{review.user?.email}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-center md:w-24 md:pl-4 md:border-l border-gray-100">
                  <button
                    onClick={() => handleDelete(review.review_id)}
                    title="Delete Review"
                    className="p-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex flex-col items-center gap-1 w-full"
                  >
                    <Trash2 size={20} />
                    <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
