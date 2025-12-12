"use client";
import { NavbarFinal } from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CartItems from './components/cartItems';
import PriceDetails from './components/priceDetails';
import { handleRazorpayPayment } from './utils/handlePayment'; // Import handler

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Coupon State
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [couponMessage, setCouponMessage] = useState("");

  // User State (Ideally fetched from Profile API)
  const [userProfile, setUserProfile] = useState({ name: "User", email: "user@example.com", mobile: "9999999999" });

  const userId = 1; // TODO: Replace with dynamic user ID

  // --- 1. Fetch Cart & User Data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Cart
        const cartRes = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const cartData = await cartRes.json();
        
        if (cartData) {
            const formattedItems = cartData.map(item => ({
                id: item.cart_id,
                name: item.product?.product_name || "Unknown Product",
                price: Number(item.product?.base_price) || 0,
                quantity: item.quantity,
                image: item.product?.image_url || "https://readymadeui.com/images/product14.webp",
                product_id: item.product_id, // Needed for order creation
                product_variant_id: item.product_variant_id // Needed for order creation
            }));
            setItems(formattedItems);
        }

        // Fetch User (For Razorpay Prefill)
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const userData = await userRes.json();
        if(userData.data) {
            setUserProfile({
                name: `${userData.data.first_name} ${userData.data.last_name}`,
                email: userData.data.email,
                mobile: userData.data.mobile
            });
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Calculate Totals ---
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; 
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
    setCouponDiscount(0); 
    
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

        setCouponDiscount(data.data.discount_amount);
        setAppliedCoupon({ id: data.data.coupon_id, code: data.data.coupon_code });
        setCouponMessage(`Coupon '${data.data.coupon_code}' Applied! Saved $${data.data.discount_amount.toFixed(2)}`);

    } catch (error) {
        console.error("Coupon error:", error);
        setCouponMessage("Error applying coupon");
    }
  };

  // --- 5. Checkout & Payment Handler ---
  const handleCheckout = async () => {
    if (items.length === 0) return alert("Your cart is empty");

    // Initiate Razorpay Payment
    await handleRazorpayPayment(
        total,
        userProfile,
        async (response) => {
            // --- SUCCESS CALLBACK ---
            alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
            
            // 1. Create Order in Database
            try {
                const orderRes = await fetch('http://localhost:5000/api/order/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_number: `ORD-${Date.now()}`,
                        shipping_address: 1, // Defaulting to 1 for now, implement address selection later
                        subtotal: subtotal,
                        tax_amount: tax,
                        shipping_cost: 0,
                        discount_amount: couponDiscount,
                        total_amount: total,
                        payment_type: "Razorpay",
                        order_status: "PAID",
                        user_id: userId
                    })
                });
                
                const orderData = await orderRes.json();
                
                // 2. Record Coupon Usage (if any)
                if (appliedCoupon && orderData.order) {
                    await fetch('http://localhost:5000/api/coupon_usage/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            coupon_id: appliedCoupon.id,
                            user_id: userId,
                            order_id: orderData.order.order_id,
                            discount_applied: couponDiscount
                        })
                    });
                }

                // 3. Clear Cart (Optional UI cleanup)
                setItems([]);
                window.location.href = "/account"; // Redirect to Orders page

            } catch (e) {
                console.error("Order creation failed:", e);
                alert("Payment successful but failed to create order record. Please contact support.");
            }
        },
        (errorMessage) => {
            // --- FAILURE CALLBACK ---
            alert(`Payment Failed: ${errorMessage}`);
        }
    );
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
              onApplyCoupon={handleApplyCoupon} 
              couponError={couponMessage}       
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;