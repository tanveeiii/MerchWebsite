"use client"
import { NavbarFinal } from '@/components/Navbar'
import React from 'react'
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import { User, Package, MapPin, Lock, Gift } from "lucide-react";
import OrderCard from './components/orderCard';
import Overview from './components/overview';

const Account = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const orders = [
        {
            status: "IT'S ORDERED!",
            date: "06 Sep, 2023",
            deliveryDate: "Saturday 9th September 2023",
            orderNo: "862682274",
            image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
            delivered: false,
        },
        {
            status: "IT'S DELIVERED!",
            date: "27 Nov, 2020",
            deliveryDate: "Saturday 28th November 2020",
            orderNo: "562353358",
            image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
            delivered: true,
        },
    ];

    return (
        <div>
            <NavbarFinal />
            <div className="flex bg-gray-50 min-h-screen">
                {/* Sidebar */}
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                {/* Main content */}
                <div className="flex-1 p-8">
                    {activeSection === "overview" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                                <User size={22}/>
                                <div>ACCOUNT OVERVIEW</div>
                            </h1>
                            <div className='space-y-6'>
                                <Overview/>
                            </div>
                        </div>
                    )}

                    {activeSection === "orders" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4"> <Package size={22} /> <div>MY ORDERS</div></h1>
                            <div className="space-y-6">
                                {orders.map((order, idx) => (
                                    <OrderCard key={idx} {...order} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "returns" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">My Returns</h1>
                            <p>No return orders yet.</p>
                        </div>
                    )}

                    {activeSection === "address" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Address Book</h1>
                            <p>Manage your addresses here.</p>
                        </div>
                    )}

                    {activeSection === "password" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Change Password</h1>
                            <p>Update your password here.</p>
                        </div>
                    )}

                    {activeSection === "gifts" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Gift Cards & Vouchers</h1>
                            <p>You have no active vouchers.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Account