export const mapProductFromBackend = (product) => {
  // 1. Get Primary Image or fallback
  const primaryImg = product.ProductImage?.find(img => img.is_primary)?.image_url 
    || product.ProductImage?.[0]?.image_url 
    || "https://placehold.co/400x500/png?text=No+Image";

  // 2. Calculate Price (Handle Discounts)
  const basePrice = Number(product.base_price);
  let finalPrice = basePrice;
  let hasDiscount = false;

  // Check for active discounts
  if (product.ProductDiscount && product.ProductDiscount.length > 0) {
    const discount = product.ProductDiscount[0]; // Assuming one active discount per product for now
    if (discount.discount_type === 'PERCENTAGE') {
      finalPrice = basePrice - (basePrice * (Number(discount.discount_value) / 100));
    } else if (discount.discount_type === 'FLAT') {
      finalPrice = basePrice - Number(discount.discount_value);
    }
    hasDiscount = true;
  }

  return {
    id: product.product_id,
    name: product.product_name,
    description: product.description,
    category: product.category?.category_name || "General", // Assuming you included category in backend fetch
    price: finalPrice.toFixed(2),
    originalPrice: hasDiscount ? basePrice.toFixed(2) : null,
    img: primaryImg,
    sku: product.sku,
    isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // "New" if < 7 days old
  };
};