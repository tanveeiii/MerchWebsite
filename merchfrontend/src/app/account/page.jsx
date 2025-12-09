"use client"
import { NavbarFinal } from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import Sidebar from './components/sidebar';
import { User, Package } from "lucide-react"; // Removed unused icons
import OrderCard from './components/orderCard';
import Overview from './components/overview';

const Account = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [orders, setOrders] = useState([]); // State for orders
    const [loading, setLoading] = useState(false);

    // --- Fetch Orders Logic ---
    useEffect(() => {
        if (activeSection === "orders") {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    // TODO: Replace '1' with actual dynamic User ID from auth
                    const userId = 1; 
                    const res = await fetch(`http://localhost:5000/api/order/${userId}`);
                    const responseJson = await res.json();
                    
                    if (responseJson.data) {
                        // Map backend data to the format OrderCard expects
                        const mappedOrders = responseJson.data.map(order => {
                            // Try to get image from the first product in the order, or use default
                            const firstItem = order.order_items?.[0];
                            const productImg = firstItem?.product?.image_url || "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800";
                            
                            // Format date
                            const orderDate = new Date(order.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            });

                            // Calculate estimated delivery (e.g., +7 days)
                            const deliveryObj = new Date(order.created_at);
                            deliveryObj.setDate(deliveryObj.getDate() + 7);
                            const deliveryDate = deliveryObj.toLocaleDateString('en-GB', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            });

                            return {
                                status: order.order_status.toUpperCase(), // "PENDING" -> "PENDING"
                                date: orderDate,
                                deliveryDate: deliveryDate,
                                orderNo: order.order_number,
                                image: productImg,
                                delivered: order.order_status === "DELIVERED"
                            };
                        });
                        setOrders(mappedOrders);
                    }
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    }, [activeSection]);

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
                                <User size={22} />
                                <div>ACCOUNT OVERVIEW</div>
                            </h1>
                            <div className='space-y-6'>
                                <Overview />
                            </div>
                        </div>
                    )}

                    {activeSection === "orders" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4"> 
                                <Package size={22} /> 
                                <div>MY ORDERS</div>
                            </h1>
                            
                            {loading ? (
                                <div className="text-center py-10 text-gray-500">Loading orders...</div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order, idx) => (
                                        <OrderCard key={idx} {...order} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-white rounded shadow-sm">
                                    No orders found.
                                </div>
                            )}
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
                </div>
            </div>
        </div>
    )
}

export default Account