"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Package, User, MapPin, Printer, Download, FileText, CheckCircle } from "lucide-react";
import { InvoicePrint } from "@/utils/invoice";
import { useReactToPrint } from "react-to-print";

export default function OrderDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const invoiceRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Invoice-${order?.order_number}`,
    });


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `order/detail/${id}`);
                const json = await res.json();
                console.log("Order DAta", json);
                if (json.data) {
                    const order = json.data;

                    const mappedOrder = {
                        ...order,
                        status: order.order_status.toUpperCase(),
                        date: new Date(order.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }),
                        delivered: order.order_status === "DELIVERED",
                    };

                    setOrder(mappedOrder);
                } else {
                    setOrder(null);
                }
            } catch (error) {
                console.error(error);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);


    const handleBack = () => router.back();

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        setActionLoading(true);
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + `order/cancel/${id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const res = await response.json();

            if (!res.ok) {
                alert(json.message || "Failed to cancel order");
            } else {
                setOrder((prev) => ({ ...prev, order_status: "CANCELLED" }));
                alert("Order cancelled successfully");
            }
        } catch (e) {
            alert("Network error cancelling order");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestReturn = async () => {
        const reason = prompt("Please enter a reason for return (optional):");
        if (reason === null) return;
        setActionLoading(true);
        try {
            const userId = Number(localStorage.getItem("userId"));
            const payload = {
                return_name: `REQ-${order?.order_number}`,
                user_id: userId || undefined,
                order_id: Number(id),
                reason: reason || "",
                return_status: "PENDING",
                refund_amount: Number(order?.total_amount || 0),
                requested_at: new Date().toISOString(),
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5000'}/api/return-request/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) {
                alert(json.message || "Failed to submit return request");
            } else {
                alert("Return request submitted. Admin will review shortly.");
            }
        } catch (e) {
            alert("Network error submitting return");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!order) return <div className="p-10 text-center text-gray-500">Order not found</div>;

    const formatDate = (d) => new Date(d).toLocaleString();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <main className="max-w-6xl mx-auto p-6 flex-1 w-full">
                <div className="mb-6">
                    <button onClick={handleBack} className="flex items-center text-gray-500 hover:text-blue-600 transition">
                        <ArrowLeft size={18} className="mr-1" /> Back to Orders
                    </button>
                </div>

                <div className="flex justify-between items-start mb-8 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            Order #{order.order_number}
                            <span className={`text-sm px-3 py-1 rounded-full border ${order.order_status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.order_status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    order.order_status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                {order.order_status}
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-2">Placed on {formatDate(order.created_at)}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            <Printer size={18} /> Print Invoice
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2">
                                <Package size={20} /> Order Items
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.OrderItem?.map((item) => (
                                    <div key={item.order_item_id} className="p-6">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
                                                <img
                                                    src={item.product?.ProductImage?.[0]?.image_url || "https://readymadeui.com/images/product14.webp"}
                                                    alt={item.product?.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="font-bold text-gray-900">{item.product?.product_name}</h3>
                                                    <p className="font-bold text-gray-900">${Number(item.total_price).toFixed(2)}</p>
                                                </div>

                                                <div className="text-sm text-gray-500 mt-1 flex gap-4">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.product_variant && (
                                                        <span className="flex items-center gap-1">Variant: {item.product_variant.size} / {item.product_variant.color}</span>
                                                    )}
                                                </div>

                                                {item.Customization && item.Customization.length > 0 && (
                                                    <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                                        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                                                            <FileText size={14} /> Customization Requirements
                                                        </h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {item.Customization[0].custom_text && (
                                                                <div className="bg-white p-3 rounded border border-blue-100">
                                                                    <span className="text-xs text-gray-400 block mb-1">Text to Print</span>
                                                                    <p className="font-bold text-gray-800 text-lg" style={{
                                                                        fontFamily: item.Customization[0].font_style || 'inherit',
                                                                        color: item.Customization[0].text_color || '#000'
                                                                    }}>
                                                                        "{item.Customization[0].custom_text}"
                                                                    </p>
                                                                    <div className="text-xs text-gray-400 mt-2 flex gap-2">
                                                                        <span>Font: {item.Customization[0].font_style}</span>
                                                                        <span>Color: {item.Customization[0].text_color}</span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="space-y-2">
                                                                {item.Customization[0].front_image_url && (
                                                                    <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                                                                        <img src={item.Customization[0].front_image_url} className="w-10 h-10 object-cover rounded bg-gray-100" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-xs font-medium truncate">Front_Design.png</p>
                                                                            <a href={item.Customization[0].front_image_url} target="_blank" download className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                                                <Download size={12} /> Download Asset
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {item.Customization[0].back_image_url && (
                                                                    <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                                                                        <img src={item.Customization[0].back_image_url} className="w-10 h-10 object-cover rounded bg-gray-100" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-xs font-medium truncate">Back_Design.png</p>
                                                                            <a href={item.Customization[0].back_image_url} target="_blank" download className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                                                <Download size={12} /> Download Asset
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-medium text-gray-600">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><User size={18} className="text-gray-400" /> Customer Details</h3>
                            <p className="font-medium text-gray-900">{order.user?.first_name} {order.user?.last_name}</p>
                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                            <p className="text-sm text-gray-500">{order.user?.mobile}</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={18} className="text-gray-400" /> Shipping Address</h3>
                            {order.s_address ? (
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>{order.s_address.street_address}</p>
                                    <p>{order.s_address.apartment_suite}</p>
                                    <p>{order.s_address.city}, {order.s_address.state_province}</p>
                                    <p className="font-medium text-gray-900">{order.s_address.postal_code}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No shipping info</p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-gray-400" /> Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => router.push(`/track/${order.order_number}`)} className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Track Order</button>
                                <button disabled={order.order_status === 'CANCELLED' || order.order_status === 'DELIVERED' || actionLoading} onClick={handleCancel} className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm disabled:opacity-50">{actionLoading ? 'Processing...' : 'Cancel Order'}</button>
                                <button disabled={order.order_status !== 'DELIVERED' || actionLoading} onClick={handleRequestReturn} className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Request Return</button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <div className="hidden">
                <InvoicePrint ref={invoiceRef} order={order} />
            </div>


        </div>
    );
}
