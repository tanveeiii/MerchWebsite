import { useState } from "react";
import { X, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ProductDetail({
  product,
  onClose,
  onDelete,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const images = product.ProductImage.sort(
    (a, b) => a.display_order - b.display_order
  );
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {images.length > 0 ? (
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[currentImageIndex]?.image_url}
                      alt={images[currentImageIndex]?.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? "bg-white w-6"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full mb-3">
                  {product.tag.tag_name}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.product_name}
                </h1>
                <p className="text-3xl font-bold text-gray-900">
                  ${product.base_price}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                    SKU
                  </h3>
                  <p className="text-gray-900">{product.sku}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                    Status
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {product.ProductVariant.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                    Variants
                  </h3>
                  <div className="space-y-3">
                    {product.ProductVariant.map((variant) => (
                      <div
                        key={variant.product_variant_id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Size:</span>{" "}
                            <span className="font-medium text-gray-900">
                              {variant.size}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Color:</span>{" "}
                            <span className="font-medium text-gray-900">
                              {variant.color}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>{" "}
                            <span className="font-medium text-gray-900">
                              ${variant.price}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>{" "}
                            <span className="font-medium text-gray-900">
                              {variant.stock_quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Material:</span>{" "}
                            <span className="font-medium text-gray-900">
                              {variant.material}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Weight:</span>{" "}
                            <span className="font-medium text-gray-900">
                              {variant.weight} kg
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category.category_id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {category.category_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          productName={product.product_name}
          onConfirm={() => {
            onDelete(product.product_id);
            setShowDeleteModal(false);
            onClose();
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
