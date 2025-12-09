"use client";
import { NavbarFinal } from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CartItems from './components/cartItems';
import PriceDetails from './components/priceDetails';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Cart Data ---
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // TODO: Get actual logged-in user ID here
        const userId = 1; // HARDCODED FOR TESTING
        
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();

        // Format backend data to match UI structure
        const formattedItems = data.map(item => ({
          id: item.cart_id,
          name: item.product?.product_name || "Unknown Product",
          // Use base_price or fallback to 0. Update 'base_price' if your DB field is named differently
          price: item.product?.base_price || 0, 
          quantity: item.quantity,
          // Use a placeholder if no image exists yet in DB
          image: item.product?.image_url || "https://readymadeui.com/images/product14.webp", 
        }));

        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  // --- 2. Calculate Totals ---
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal > 2000 ? 100 : 0; 
  const tax = subtotal * 0.05; 
  const total = subtotal - discount + tax;

  // --- 3. Handlers ---
  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    
    // 1. Optimistic UI Update (Update screen instantly)
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );

    // 2. Call Backend API
    try {
      await fetch(`http://localhost:5000/api/cart/update/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }) 
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Optional: Revert UI if error occurs
    }
  };

  const handleRemove = async (id) => {
    // 1. Optimistic UI Update
    setItems((prev) => prev.filter((item) => item.id !== id));

    // 2. Call Backend API
    try {
      await fetch(`http://localhost:5000/api/cart/remove/${id}`, { 
        method: 'DELETE' 
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout with Total: $" + total.toFixed(2));
    // router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-500">Loading Cart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Cart Items */}
          <div className="lg:w-2/3">
            <CartItems 
              items={items} 
              onQuantityChange={handleQuantityChange} 
              onRemove={handleRemove} 
            />
          </div>

          {/* Right Side: Price Details */}
          <div className="lg:w-1/3">
            <PriceDetails 
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;