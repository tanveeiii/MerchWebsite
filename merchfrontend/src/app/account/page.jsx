"use client"
import { NavbarFinal } from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import Sidebar from './components/sidebar';
import { User, Package, RotateCcw } from "lucide-react"; 
import OrderCard from './components/orderCard';
import Overview from './components/overview';

const Account = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [orders, setOrders] = useState([]); 
    const [returns, setReturns] = useState([]); // NEW: State for returns
    const [loading, setLoading] = useState(false);

    // --- Fetch Data Logic ---
    useEffect(() => {
        const userId = 1; // TODO: Replace with dynamic User ID from auth

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Orders
                if (activeSection === "orders") {
                    const res = await fetch(`http://localhost:5000/api/order/${userId}`);
                    const responseJson = await res.json();
                    
                    if (responseJson.data) {
                        const mappedOrders = responseJson.data.map(order => {
                            const firstItem = order.order_items?.[0];
                            const productImg = firstItem?.product?.image_url || "https://readymadeui.com/images/product14.webp";
                            
                            const orderDate = new Date(order.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            });

                            const deliveryObj = new Date(order.created_at);
                            deliveryObj.setDate(deliveryObj.getDate() + 7);
                            const deliveryDate = deliveryObj.toLocaleDateString('en-GB', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            });

                            return {
                                status: order.order_status.toUpperCase(),
                                date: orderDate,
                                deliveryDate: deliveryDate,
                                orderNo: order.order_number,
                                image: productImg,
                                delivered: order.order_status === "DELIVERED"
                            };
                        });
                        setOrders(mappedOrders);
                    }
                } 
                
                // 2. Fetch Returns (NEW LOGIC)
                else if (activeSection === "returns") {
                    const res = await fetch(`http://localhost:5000/api/return/${userId}`);
                    const responseJson = await res.json();

                    if (responseJson.data) {
                        setReturns(responseJson.data);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection]);

    return (
        <div>
            <NavbarFinal />
            <div className="flex bg-gray-50 min-h-screen">
                {/* Sidebar */}
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                {/* Main content */}
                <div className="flex-1 p-8">
                    {/* OVERVIEW SECTION */}
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

                    {/* ORDERS SECTION */}
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

                    {/* RETURNS SECTION (UPDATED) */}
                    {activeSection === "returns" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                                <RotateCcw size={22} />
                                <div>MY RETURNS</div>
                            </h1>

                            {loading ? (
                                <div className="text-center py-10 text-gray-500">Loading returns...</div>
                            ) : returns.length > 0 ? (
                                <div className="space-y-6">
                                    {returns.map((ret) => {
                                        // Helper to get image from first returned item
                                        const firstItem = ret.ReturnItem?.[0]?.order_item?.product;
                                        const productImg = firstItem?.image_url || "https://readymadeui.com/images/product14.webp";
                                        const formattedDate = new Date(ret.requested_at).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        });

                                        return (
                                            <div key={ret.return_id} className="bg-white shadow-sm border rounded-md p-4 flex flex-col md:flex-row justify-between items-start gap-4 text-[Poppins]">
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden">
                                                        <img src={productImg} alt="Returned Product" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm font-bold text-gray-800">
                                                            RETURN #{ret.return_number}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Requested: {formattedDate}
                                                        </div>
                                                        <div className={`text-sm font-semibold uppercase ${
                                                            ret.return_status === 'APPROVED' ? 'text-green-600' : 
                                                            ret.return_status === 'REJECTED' ? 'text-red-600' : 'text-orange-500'
                                                        }`}>
                                                            {ret.return_status}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Refund Amount: <span className="font-medium text-black">${ret.refund_amount}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 transition rounded-sm">
                                                    VIEW DETAILS
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-white rounded shadow-sm">
                                    No return requests found.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADDRESS SECTION */}
                    {activeSection === "address" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Address Book</h1>
                            <p>Manage your addresses here.</p>
                        </div>
                    )}

                    {/* PASSWORD SECTION */}
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