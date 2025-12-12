"use client";
import { NavbarFinal } from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CartItems from './components/cartItems';
import PriceDetails from './components/priceDetails';
import { handleRazorpayPayment } from './utils/handlePayment'; 
import { useRouter } from 'next/navigation';

const Cart = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Coupon State
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [couponMessage, setCouponMessage] = useState("");

  // User State
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: "User", email: "", mobile: "" });

  // --- 1. Load User & Fetch Data ---
  useEffect(() => {
    // Get ID from Storage safely
    const storedUserId = localStorage.getItem("userId");
    
    if (!storedUserId) {
        setLoading(false);
        // Optional: Redirect to login if cart requires auth
        // router.push('/auth/login');
        return;
    }

    setUserId(storedUserId);

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Cart
        const cartRes = await fetch(`http://localhost:5000/api/cart/${storedUserId}`);
        const cartData = await cartRes.json();
        
        if (Array.isArray(cartData)) {
            const formattedItems = cartData.map(item => ({
                id: item.cart_id,
                name: item.product?.product_name || "Unknown Product",
                price: Number(item.product?.base_price) || 0,
                quantity: item.quantity,
                // Handle different image structures (array or single string)
                image: Array.isArray(item.product?.ProductImage) 
                    ? item.product.ProductImage[0]?.image_url 
                    : (item.product?.image_url || "https://readymadeui.com/images/product14.webp"),
                product_id: item.product_id,
                product_variant_id: item.product_variant_id
            }));
            setItems(formattedItems);
        }

        // Fetch User Profile (For Payment)
        const userRes = await fetch(`http://localhost:5000/api/user/profile/${storedUserId}`);
        const userData = await userRes.json();
        if(userData.data) {
            setUserProfile({
                name: `${userData.data.first_name} ${userData.data.last_name}`,
                email: userData.data.email,
                mobile: userData.data.mobile || "9999999999"
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
    // Optimistic UI Update
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
    
    try {
      await fetch(`http://localhost:5000/api/cart/update/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }) 
      });
    } catch (error) { 
        console.error("Update failed", error);
        // Ideally revert UI here on failure
    }
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

  // --- 5. Checkout Handler ---
  const handleCheckout = async () => {
    if (!userId) return alert("Please log in to checkout.");
    if (items.length === 0) return alert("Your cart is empty");

    await handleRazorpayPayment(
        total,
        userProfile,
        async (response) => {
            // SUCCESS
            try {
                // Create Order
                const orderRes = await fetch('http://localhost:5000/api/order/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_number: `ORD-${Date.now()}`,
                        shipping_address: 1, // Placeholder
                        subtotal: subtotal,
                        tax_amount: tax,
                        shipping_cost: 0,
                        discount_amount: couponDiscount,
                        total_amount: total,
                        payment_type: "Razorpay",
                        order_status: "PAID",
                        user_id: Number(userId)
                    })
                });
                
                const orderData = await orderRes.json();
                
                // Record Coupon Usage
                if (appliedCoupon && orderData.order) {
                    await fetch('http://localhost:5000/api/coupon_usage/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            coupon_id: appliedCoupon.id,
                            user_id: Number(userId),
                            order_id: orderData.order.order_id,
                            discount_applied: couponDiscount
                        })
                    });
                }

                // Create Payment Record (Optional, if you have a Payment Table)
                /*
                await fetch('http://localhost:5000/api/payment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: orderData.order.order_id,
                        payment_method: 'Razorpay',
                        transaction_id: response.razorpay_payment_id,
                        amount: total,
                        payment_status: 'SUCCESS',
                        payment_date: new Date().toISOString(),
                        payment_details: JSON.stringify(response)
                    })
                });
                */

                alert(`Order Placed Successfully! ID: ${orderData.order.order_number}`);
                setItems([]); // Clear Cart UI
                window.location.href = "/account"; 

            } catch (e) {
                console.error("Order creation failed:", e);
                alert("Payment successful but order creation failed. Contact support.");
            }
        },
        (errorMessage) => {
            // FAILURE
            alert(`Payment Failed: ${errorMessage}`);
        }
    );
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading Cart...</div>;

  return (
    <div className="bg-white min-h-screen">
      <NavbarFinal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CartItems items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
          </div>
          <div className="lg:w-1/3">
            <PriceDetails 
              subtotal={subtotal} discount={couponDiscount} tax={tax} total={total}
              onCheckout={handleCheckout} onApplyCoupon={handleApplyCoupon} couponError={couponMessage}       
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;