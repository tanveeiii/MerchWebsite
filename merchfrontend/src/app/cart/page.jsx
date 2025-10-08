"use client"
import { NavbarFinal } from '@/components/Navbar'
import React from 'react'
import CartItems from './components/cartItems'
import {useState} from 'react'
import PriceDetails from './components/priceDetails'

const Cart = () => {
     const [items, setItems] = useState([
    {
      id: 1,
      name: "Classic Sky Blue Hoodie",
      price: 799,
      quantity: 1,
      image: "/hoodie1.png",
    },
    {
      id: 2,
      name: "Pixelverse T-Shirt",
      price: 499,
      quantity: 2,
      image: "/tshirt1.png",
    },
  ]);

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
    <NavbarFinal/>
    <div className='flex w-full justify-center'>
    <CartItems items={items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}/>
    <PriceDetails />
    </div>
    </div>
  )
}

export default Cart