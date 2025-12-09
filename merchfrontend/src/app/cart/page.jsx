"use client";
import { NavbarFinal } from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CartItems from './components/cartItems';
import PriceDetails from './components/priceDetails';

const Cart = () => {
  const [items, setItems] = useState([
    // Mock Data - Replace with empty array [] once backend is ready
    {
      id: 1,
      name: "Classic Sky Blue Hoodie",
      price: 799,
      quantity: 1,
      image: "https://readymadeui.com/images/product14.webp",
    },
    {
      id: 2,
      name: "Pixelverse T-Shirt",
      price: 499,
      quantity: 2,
      image: "https://readymadeui.com/images/product14.webp",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // --- 1. Fetch Cart Data (Uncomment when Backend GET endpoint is ready) ---
  /*
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId"); // Assuming you store ID on login
        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await res.json();
        setItems(data); // Backend must return array of items
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  */

  // --- 2. Calculate Totals ---
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal > 2000 ? 100 : 0; // Example logic
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal - discount + tax;

  // --- 3. Handlers ---
  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    
    // Optimistic UI Update (Update screen immediately)
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );

    // TODO: Call Backend API to update quantity
    // await fetch(`http://localhost:5000/api/cart/update/${id}`, { method: 'PUT', body: JSON.stringify({ quantity: newQty }) });
  };

  const handleRemove = async (id) => {
    // Optimistic UI Update
    setItems((prev) => prev.filter((item) => item.id !== id));

    // TODO: Call Backend API to delete
    // await fetch(`http://localhost:5000/api/cart/remove/${id}`, { method: 'DELETE' });
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout with Total: $" + total.toFixed(2));
    // router.push('/checkout');
  };

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