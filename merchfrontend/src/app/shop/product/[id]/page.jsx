"use client";
import React, { useEffect, useState } from 'react';
import { NavbarFinal } from "@/components/Navbar";
import { Loader2, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { mapProductFromBackend } from "@/utils/productMapper";

const ProductPage = ({ params }) => {
  // Unwrap params for Next.js 13+ (Use React.use() if strict mode error occurs, otherwise simple access)
  const productId = React.use(params).id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  // Loading States for Actions
  const [addingCart, setAddingCart] = useState(false);
  const [addingWish, setAddingWish] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Backend doesn't have 'find one' endpoint explicitly shown, using fetch all filter for now
        // OPTIMIZATION: Create @Get('fetch/:id') in backend for better performance
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        
        if (json.data) {
          const found = json.data.find(p => p.product_id === Number(productId));
          if (found) {
            const mapped = mapProductFromBackend(found);
            setProduct(mapped);
            setActiveImage(mapped.img);
            // Default to first variant
            if (mapped.variants.length > 0) setSelectedVariant(mapped.variants[0]);
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in.");
    if (!selectedVariant) return alert("Please select a size/color.");

    setAddingCart(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.id,
          product_variant_id: selectedVariant.product_variant_id,
          quantity: quantity
        }),
      });
      if (res.ok) alert("Added to Cart!");
    } catch (e) { console.error(e); } finally { setAddingCart(false); }
  };

  const handleWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in.");
    setAddingWish(true);
    try {
        const res = await fetch("http://localhost:5000/api/wishlist/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: Number(userId),
            product_id: product.id,
            product_variant_id: selectedVariant?.product_variant_id || 0
          }),
        });
        if (res.ok) alert("Added to Wishlist!");
    } catch (e) { console.error(e); } finally { setAddingWish(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(img.image_url)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === img.image_url ? "border-black" : "border-transparent"}`}>
                        <img src={img.image_url} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.category} • SKU: {product.sku}</p>
            
            <div className="mt-6 flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>}
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants.length > 0 && (
                <div className="mt-8">
                    <label className="font-semibold text-gray-900">Select Variation</label>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {product.variants.map((v) => (
                            <button
                                key={v.product_variant_id}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-4 py-2 border rounded-lg transition-all ${selectedVariant?.product_variant_id === v.product_variant_id ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"}`}
                            >
                                {v.size} / {v.color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-3 hover:bg-gray-100"><Minus size={16}/></button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="px-4 py-3 hover:bg-gray-100"><Plus size={16}/></button>
                </div>

                {/* Add To Cart */}
                <button 
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    className="flex-1 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    {addingCart ? <Loader2 className="animate-spin"/> : <ShoppingCart />} Add to Cart
                </button>

                {/* Wishlist */}
                <button onClick={handleWishlist} className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-red-500">
                    {addingWish ? <Loader2 className="animate-spin"/> : <Heart />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;