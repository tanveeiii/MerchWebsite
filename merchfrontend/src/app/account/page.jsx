"use client"
import { NavbarFinal } from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'; // Import Router
import Sidebar from './components/sidebar';
import { User, Package, RotateCcw, MapPin, Lock } from "lucide-react"; 
import OrderCard from './components/orderCard';
import Overview from './components/overview';
import AddressBook from './components/addressBook'; 

const Account = () => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("overview");
    
    // Data States
    const [orders, setOrders] = useState([]); 
    const [returns, setReturns] = useState([]);
    const [userData, setUserData] = useState(null); 
    
    const [loading, setLoading] = useState(false);

    // --- Main Fetch Function ---
    useEffect(() => {
        // 1. GET USER ID DYNAMICALLY
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        // 2. Redirect if not logged in
        if (!userId || !token) {
            router.push('/login'); 
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // 3. Use dynamic 'userId' in all fetch calls
                
                // Fetch User Profile
                if (activeSection === "overview" || activeSection === "address") {
                    const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
                    const json = await res.json();
                    if (json.data) setUserData(json.data);
                }

                // Fetch Orders
                if (activeSection === "orders") {
                    const res = await fetch(`http://localhost:5000/api/order/${userId}`);
                    const json = await res.json();
                    if (json.data) {
                        const mappedOrders = json.data.map(order => ({
                            status: order.order_status.toUpperCase(),
                            date: new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                            deliveryDate: "Pending",
                            orderNo: order.order_number,
                            image: order.order_items?.[0]?.product?.image_url || "https://readymadeui.com/images/product14.webp",
                            delivered: order.order_status === "DELIVERED"
                        }));
                        setOrders(mappedOrders);
                    }
                } 
                
                // Fetch Returns
                if (activeSection === "returns") {
                    const res = await fetch(`http://localhost:5000/api/return/${userId}`);
                    const json = await res.json();
                    if (json.data) setReturns(json.data);
                }

            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection, router]); // Add router to dependencies

    // --- Action Handlers (Keep as is) ---
    const handleUpdateProfile = async (updatedData) => {
        try {
            const res = await fetch('http://localhost:5000/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                alert("Profile Updated Successfully!");
                // Trigger reload by temporarily switching section or forcing update
                window.location.reload(); 
            } else {
                const err = await res.json();
                alert(`Update failed: ${err.message}`);
            }
        } catch (e) { 
            console.error(e);
            alert("Network error updating profile");
        }
    };

    const handleAddAddress = async (addressData) => {
        try {
            const res = await fetch('http://localhost:5000/api/user/address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            if (res.ok) {
                alert("Address Added Successfully!");
                window.location.reload();
            } else {
                const err = await res.json();
                alert(`Failed to add address: ${err.message}`);
            }
        } catch (e) { 
            console.error(e);
            alert("Network error adding address");
        }
    };

    return (
        <div>
            <NavbarFinal />
            <div className="flex bg-gray-50 min-h-screen">
                <Sidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                userData={userData}  // <--- ADD THIS PROP
            />

                <div className="flex-1 p-8">
                    {/* OVERVIEW */}
                    {activeSection === "overview" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                                <User size={22} />
                                <div>ACCOUNT OVERVIEW</div>
                            </h1>
                            <div className='space-y-6'>
                                {userData ? (
                                    <Overview userData={userData} onUpdate={handleUpdateProfile} />
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Loading Profile...</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ORDERS */}
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

                    {/* RETURNS */}
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
                                        const firstItem = ret.ReturnItem?.[0]?.order_item?.product;
                                        const productImg = firstItem?.image_url || "https://readymadeui.com/images/product14.webp";
                                        const formattedDate = new Date(ret.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                                        return (
                                            <div key={ret.return_id} className="bg-white shadow-sm border rounded-md p-4 flex flex-col md:flex-row justify-between items-start gap-4 text-[Poppins]">
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden">
                                                        <img src={productImg} alt="Product" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm font-bold text-gray-800">RETURN #{ret.return_number}</div>
                                                        <div className="text-sm text-gray-600">Requested: {formattedDate}</div>
                                                        <div className={`text-sm font-semibold uppercase ${ret.return_status === 'APPROVED' ? 'text-green-600' : 'text-orange-500'}`}>
                                                            {ret.return_status}
                                                        </div>
                                                        <div className="text-sm text-gray-500">Refund: <span className="font-medium text-black">${ret.refund_amount}</span></div>
                                                    </div>
                                                </div>
                                                <button className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 transition rounded-sm">VIEW DETAILS</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-white rounded shadow-sm">No return requests found.</div>
                            )}
                        </div>
                    )}

                    {/* ADDRESS BOOK */}
                    {activeSection === "address" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                                <MapPin size={22} /> 
                                <div>ADDRESS BOOK</div>
                            </h1>
                            {userData ? (
                                <AddressBook 
                                    addresses={userData.Address || []} 
                                    userEmail={userData.email} 
                                    onAddAddress={handleAddAddress} 
                                />
                            ) : (
                                <div className="text-center py-10 text-gray-500">Loading Addresses...</div>
                            )}
                        </div>
                    )}

                    {/* CHANGE PASSWORD */}
                    {activeSection === "password" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                                <Lock size={22} /> 
                                <div>CHANGE PASSWORD</div>
                            </h1>
                            <div className="bg-white p-6 rounded shadow-sm border">
                                <p className="text-gray-600">Password update functionality coming soon.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Account