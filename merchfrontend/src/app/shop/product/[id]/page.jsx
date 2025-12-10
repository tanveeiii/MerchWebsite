"use client";
import React, { useEffect, useState, use } from 'react'; // Import 'use'
import { NavbarFinal } from "@/components/Navbar";
import { Loader2, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { mapProductFromBackend } from "@/utils/productMapper";
import ReviewsSection from "@/components/ReviewsSection"; 

const ProductPage = ({ params }) => {
  // FIX: In Next.js 15, params is a Promise. Unwrap it with React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

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
        const res = await fetch("http://localhost:5000/api/product/fetch");
        const json = await res.json();
        
        if (json.data) {
          const found = json.data.find(p => p.product_id === Number(productId));
          if (found) {
            const mapped = mapProductFromBackend(found);
            setProduct(mapped);
            setActiveImage(mapped.img);
            // Default to first variant if available
            if (mapped.variants.length > 0) setSelectedVariant(mapped.variants[0]);
          }
        }
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    
    if (productId) {
        fetchDetails();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in.");
    if (!selectedVariant && product.variants.length > 0) return alert("Please select a size/color.");

    setAddingCart(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.id,
          product_variant_id: selectedVariant?.product_variant_id || product.defaultVariantId, 
          quantity: quantity
        }),
      });
      if (res.ok) alert("Added to Cart!");
      else throw new Error("Failed to add");
    } catch (e) { 
        console.error(e); 
        alert("Error adding to cart");
    } finally { 
        setAddingCart(false); 
    }
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
            product_variant_id: selectedVariant?.product_variant_id || product.defaultVariantId || 0
          }),
        });
        if (res.ok) alert("Added to Wishlist!");
        else throw new Error("Failed");
    } catch (e) { 
        console.error(e); 
        alert("Error adding to wishlist");
    } finally { 
        setAddingWish(false); 
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-xl font-bold text-gray-400">Product Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Grid: Images & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveImage(img.image_url)} 
                                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img.image_url ? "border-black ring-1 ring-black" : "border-gray-200 hover:border-gray-400"}`}
                            >
                                <img src={img.image_url} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    <span>•</span>
                    <span>SKU: {product.sku}</span>
                </div>
                
                <div className="mt-6 flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>}
                </div>

                <p className="mt-6 text-gray-600 leading-relaxed text-lg">{product.description}</p>

                {/* Variant Selector */}
                {product.variants.length > 0 && (
                    <div className="mt-8 border-t border-b py-6 border-gray-100">
                        <label className="font-bold text-gray-900 block mb-3">Select Option</label>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((v) => (
                                <button
                                    key={v.product_variant_id}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`px-6 py-3 border rounded-xl font-medium transition-all ${
                                        selectedVariant?.product_variant_id === v.product_variant_id 
                                        ? "bg-black text-white border-black shadow-lg" 
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-800"
                                    }`}
                                >
                                    {v.size} {v.color && `• ${v.color}`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions Row */}
                <div className="mt-8 flex gap-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                        <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-4 hover:bg-gray-200 rounded-l-xl text-gray-600"><Minus size={18}/></button>
                        <span className="px-4 font-bold text-lg w-12 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(q => q+1)} className="px-4 py-4 hover:bg-gray-200 rounded-r-xl text-gray-600"><Plus size={18}/></button>
                    </div>

                    {/* Add To Cart */}
                    <button 
                        onClick={handleAddToCart}
                        disabled={addingCart}
                        className="flex-1 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        {addingCart ? <Loader2 className="animate-spin"/> : <ShoppingCart />} 
                        {addingCart ? "Adding..." : "Add to Cart"}
                    </button>

                    {/* Wishlist Button */}
                    <button 
                        onClick={handleWishlist} 
                        disabled={addingWish}
                        className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-red-500 transition-colors"
                        title="Add to Wishlist"
                    >
                        {addingWish ? <Loader2 className="animate-spin"/> : <Heart size={24} />}
                    </button>
                </div>
            </div>
        </div>

        {/* REVIEWS SECTION INTEGRATION */}
        <ReviewsSection productId={product.id} />

      </div>
    </div>
  );
};

export default ProductPage;