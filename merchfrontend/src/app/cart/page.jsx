"use client";
import { NavbarFinal } from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import CartItems from "./components/cartItems";
import PriceDetails from "./components/priceDetails";
import { handleRazorpayPayment } from "./utils/handlePayment";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";

const Cart = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      setLoading(false);
      return;
    }
    setUserId(storedUserId);

    const fetchData = async () => {
      setLoading(true);
      try {
        const cartRes = await fetch(
          `http://localhost:5000/api/cart/${storedUserId}`
        );
        const cartData = await cartRes.json();

        if (Array.isArray(cartData)) {
          const formattedItems = cartData.map((item) => ({
            id: item.cart_id,
            name: item.product?.product_name || "Unknown Product",
            price: Number(item.product?.base_price) || 0,
            quantity: item.quantity,
            image: Array.isArray(item.product?.ProductImage)
              ? item.product.ProductImage[0]?.image_url
              : item.product?.image_url ||
                "https://readymadeui.com/images/product14.webp",
            product_id: item.product_id,
            product_variant_id: item.product_variant_id,
          }));
          setItems(formattedItems);
        }

        // Fetch User Profile (For Payment)
        const userRes = await fetch(
          `http://localhost:5000/api/user/profile/${storedUserId}`
        );
        const userData = await userRes.json();
        if (userData.data) {
          setUserProfile({
            name: `${userData.data.first_name} ${userData.data.last_name}`,
            email: userData.data.email,
            mobile: userData.data.mobile || "9999999999",
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

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - couponDiscount);

  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await fetch(`http://localhost:5000/api/cart/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleRemove = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`http://localhost:5000/api/cart/remove/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Remove failed", error);
    }
  };
  const handleApplyCoupon = async (code) => {
    setCouponMessage("");
    setCouponDiscount(0);

    try {
      const res = await fetch(`http://localhost:5000/api/coupon/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, orderTotal: subtotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponMessage(data.message || "Invalid Coupon");
        setAppliedCoupon(null);
        return;
      }

      setCouponDiscount(data.data.discount_amount);
      setAppliedCoupon({
        id: data.data.coupon_id,
        code: data.data.coupon_code,
      });
      setCouponMessage(
        `Coupon '${
          data.data.coupon_code
        }' Applied! Saved $${data.data.discount_amount.toFixed(2)}`
      );
    } catch (error) {
      console.error("Coupon error:", error);
      setCouponMessage("Error applying coupon");
    }
  };

  const handleCheckout = async () => {
    if (!userId) return CustomToast("Please log in to checkout.");
    if (items.length === 0) return CustomToast("Your cart is empty");
    try {
      const response = await fetch(
        "http://localhost:5000/api/razorpay/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.floor(total * 83),
            current: "INR",
            user: userProfile,
            product: items,
          }),
        }
      );
      const res = await response.json();
      console.log(res);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        amount: Math.floor(total * 83),
        currency: "INR",
        name: "Suryansh Nagar",
        description: "Order Payment",
        order_id: res.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/api/razorpay/payment-success",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  userId,
                  items,
                  subtotal: subtotal,
                  amount: total,
                  coupon: couponDiscount,
                }),
              }
            );

            const result = await verifyRes.json();
            console.log("VERIFY RESULT:", result);

            if (result.success === true) {
              router.push("/checkout/success");
            } else {
              router.push("/checkout/failed");
            }
          } catch (err) {
            console.error("Verification failed", err);
            router.push("/checkout/failed");
          }
        },
        prefill: userProfile,
        theme: { color: "#F37254" },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (e) {
      CustomToast(`Payment Failed: ${e}`);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading Cart...
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <ToastContainer />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <NavbarFinal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CartItems
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          </div>
          <div className="lg:w-1/3">
            <PriceDetails
              subtotal={subtotal}
              discount={couponDiscount}
              // tax={tax}
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
