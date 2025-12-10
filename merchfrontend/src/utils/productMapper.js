export const mapProductFromBackend = (product) => {
  // 1. Get Primary Image or fallback
  const primaryImg = product.ProductImage?.find(img => img.is_primary)?.image_url 
    || product.ProductImage?.[0]?.image_url 
    || "https://readymadeui.com/images/product14.webp";

  // 2. Handle Price & Discount
  const basePrice = Number(product.base_price);
  let finalPrice = basePrice;
  
  if (product.ProductDiscount && product.ProductDiscount.length > 0) {
    const discount = product.ProductDiscount[0];
    if (discount.discount_type === 'PERCENTAGE') {
      finalPrice = basePrice - (basePrice * (Number(discount.discount_value) / 100));
    } else if (discount.discount_type === 'FLAT') {
      finalPrice = basePrice - Number(discount.discount_value);
    }
  }

  // 3. Get Default Variant (for Quick Add)
  const defaultVariantId = product.ProductVariant?.[0]?.product_variant_id || null;

  return {
    id: product.product_id,
    name: product.product_name,
    description: product.description,
    category: product.category?.category_name || "General",
    price: finalPrice.toFixed(2),
    originalPrice: finalPrice < basePrice ? basePrice.toFixed(2) : null,
    img: primaryImg,
    sku: product.sku,
    defaultVariantId: defaultVariantId, // <--- CRITICAL FOR CART
    variants: product.ProductVariant || [], // Pass all variants for details page
    images: product.ProductImage || []
  };
};