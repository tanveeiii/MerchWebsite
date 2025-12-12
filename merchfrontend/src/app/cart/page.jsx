"use client";
import { NavbarFinal } from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CartItems from './components/cartItems';
import PriceDetails from './components/priceDetails';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Coupon State
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { id: 1, code: 'SAVE10' }
  const [couponMessage, setCouponMessage] = useState("");

  const userId = 1; // TODO: Replace with dynamic user ID

  // --- 1. Fetch Cart Data ---
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        const formattedItems = data.map(item => ({
          id: item.cart_id,
          name: item.product?.product_name || "Unknown Product",
          price: Number(item.product?.base_price) || 0,
          quantity: item.quantity,
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
  const tax = subtotal * 0.05; 
  // Total logic: (Subtotal - Coupon) + Tax
  const total = Math.max(0, subtotal - couponDiscount + tax);

  // --- 3. Handlers ---
  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
    try {
      await fetch(`http://localhost:5000/api/cart/update/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }) 
      });
    } catch (error) { console.error("Update failed", error); }
  };

  const handleRemove = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`http://localhost:5000/api/cart/remove/${id}`, { method: 'DELETE' });
    } catch (error) { console.error("Remove failed", error); }
  };

  // --- 4. Coupon Handler ---
  const handleApplyCoupon = async (code) => {
    setCouponMessage(""); 
    setCouponDiscount(0); // Reset previous discount before check
    
    try {
        const res = await fetch(`http://localhost:5000/api/coupon/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code, orderTotal: subtotal })
        });

        const data = await res.json();

        if (!res.ok) {
            setCouponMessage(data.message || "Invalid Coupon");
            setAppliedCoupon(null);
            return;
        }

        // Success
        setCouponDiscount(data.data.discount_amount);
        setAppliedCoupon({ id: data.data.coupon_id, code: data.data.coupon_code });
        setCouponMessage(`Coupon '${data.data.coupon_code}' Applied! Saved $${data.data.discount_amount.toFixed(2)}`);

    } catch (error) {
        console.error("Coupon error:", error);
        setCouponMessage("Error applying coupon");
    }
  };

  const handleCheckout = async () => {
    // Here you would usually create an Order first.
    // For "Complete Integration", we will mock the Order creation and save Coupon Usage.
    
    // 1. Record Coupon Usage (if applied)
    if (appliedCoupon) {
        try {
            await fetch('http://localhost:5000/api/coupon_usage/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    coupon_id: appliedCoupon.id,
                    user_id: userId,
                    order_id: 12345, // MOCK Order ID (In real app, get this from Order API response)
                    discount_applied: couponDiscount
                })
            });
            console.log("Coupon usage recorded");
        } catch (e) { console.error("Failed to record usage", e); }
    }

    alert(`Proceeding to checkout. Final Total: $${total.toFixed(2)}`);
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
              discount={couponDiscount}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
              onApplyCoupon={handleApplyCoupon} // Pass handler
              couponError={couponMessage}       // Pass status message
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;