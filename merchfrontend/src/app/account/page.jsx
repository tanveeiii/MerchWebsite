"use client";
import { NavbarFinal } from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/sidebar";
import { User, Package, RotateCcw, MapPin, Lock } from "lucide-react";
import OrderCard from "./components/orderCard";
import Overview from "./components/overview";
import AddressBook from "./components/addressBook";
import ComplaintModal from "./components/ComplaintModal";
import ReturnModal from "./components/ReturnModal"; // <--- IMPORT ADDED
import ChangePassword from "./components/changePassword";
import { ToastContainer } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

const Account = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals State
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- RETURN MODAL STATE ---
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderData, setReturnOrderData] = useState(null);

  // Change Password Modal State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (isAuth) router.replace("/admin/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeSection === "overview" || activeSection === "address") {
          const res = await fetch(
            `http://localhost:5000/api/user/profile/${userId}`
          );
          const json = await res.json();
          if (json.data) setUserData(json.data);
        }

        if (activeSection === "orders") {
          const res = await fetch(`http://localhost:5000/api/order/${userId}`);
          const json = await res.json();
          if (json.data) {
            const mappedOrders = json.data.map((order) => ({
              // --- ADDED THESE FIELDS FOR RETURN LOGIC ---
              order_id: order.order_id,
              total_amount: order.total_amount,
              // -------------------------------------------
              status: order.order_status.toUpperCase(),
              date: new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              deliveryDate: "Pending",
              orderNo: order.order_number,
              image:
                order.order_items?.[0]?.product?.image_url ||
                "https://readymadeui.com/images/product14.webp",
              delivered: order.order_status === "DELIVERED",
            }));
            setOrders(mappedOrders);
          }
        }

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
  }, [activeSection, router]);

  // --- HANDLERS ---

  const handleUpdateProfile = async (updatedData) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        CustomToast("Profile Updated Successfully!");
        window.location.reload();
      } else {
        const err = await res.json();
        CustomToast(`Update failed: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
      CustomToast("Network error updating profile");
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      if (res.ok) {
        CustomToast("Address Added Successfully!");
        window.location.reload();
      } else {
        const err = await res.json();
        CustomToast(`Failed to add address: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
      CustomToast("Network error adding address");
    }
  };

  const handleOpenComplaint = (orderNo) => {
    const order = orders.find((o) => o.orderNo === orderNo);
    setSelectedOrder(order);
    setShowComplaintModal(true);
  };

  const handleSubmitComplaint = async (message) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch("http://localhost:5000/api/complaint/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: Number(userId),
          sender_type: "User",
          message: message,
          attachment_url: "",
        }),
      });

      if (res.ok) {
        CustomToast(
          "Complaint ticket raised successfully. Our support team will contact you."
        );
        setShowComplaintModal(false);
      } else {
        const err = await res.json();
        CustomToast(`Failed to raise complaint: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
      CustomToast("Network error raising complaint.");
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    const userId = localStorage.getItem("userId");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resetPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword,
            isLoggedIn: true,
            user_id: Number(userId),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNewPassword("");
        setConfirmPassword("");
        CustomToast("Password Changed Successfully");
      } else {
        CustomToast(data.message);
      }
    } catch (err) {
      console.error("Password change error:", err);
      CustomToast("Some error occured!");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: RETURN LOGIC HANDLERS ---
  const handleOpenReturn = (orderData) => {
    setReturnOrderData(orderData);
    setShowReturnModal(true);
  };

  const handleSubmitReturn = async (order, reason) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(
        "http://localhost:5000/api/return-request/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            return_name: `REQ-${order.orderNo}`,
            user_id: Number(userId),
            order_id: Number(order.orderId), // From OrderCard props
            reason: reason,
            return_status: "PENDING",
            refund_amount: Number(order.totalAmount || 0),
            requested_at: new Date().toISOString(),
          }),
        }
      );

      if (res.ok) {
        CustomToast(
          "Return Request Submitted Successfully! Waiting for Admin Approval."
        );
        setShowReturnModal(false);
      } else {
        const err = await res.json();
        CustomToast(`Failed: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
      CustomToast("Network error submitting return.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <NavbarFinal />
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userData={userData}
        />

        <div className="flex-1 p-8">
          {activeSection === "overview" && (
            <div>
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                <User size={22} />
                <div>ACCOUNT OVERVIEW</div>
              </h1>
              <div className="space-y-6">
                {userData ? (
                  <Overview
                    userData={userData}
                    onUpdate={handleUpdateProfile}
                  />
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Loading Profile...
                  </div>
                )}
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
                <div className="text-center py-10 text-gray-500">
                  Loading orders...
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order, idx) => (
                    <OrderCard
                      key={idx}
                      {...order}
                      // --- Pass Data Needed for Return ---
                      orderId={order.order_id}
                      totalAmount={order.total_amount}
                      onReturn={handleOpenReturn}
                      // -----------------------------------
                      onComplaint={handleOpenComplaint}
                    />
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
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                <RotateCcw size={22} />
                <div>MY RETURNS</div>
              </h1>
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading returns...
                </div>
              ) : returns.length > 0 ? (
                <div className="space-y-6">
                  {returns.map((ret) => {
                    const firstItem = ret.ReturnItem?.[0]?.order_item?.product;
                    const productImg =
                      firstItem?.image_url ||
                      "https://readymadeui.com/images/product14.webp";
                    const formattedDate = new Date(
                      ret.requested_at
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={ret.return_id}
                        className="bg-white shadow-sm border rounded-md p-4 flex flex-col md:flex-row justify-between items-start gap-4 text-[Poppins]"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden">
                            <img
                              src={productImg}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-bold text-gray-800">
                              RETURN #{ret.return_number}
                            </div>
                            <div className="text-sm text-gray-600">
                              Requested: {formattedDate}
                            </div>
                            <div
                              className={`text-sm font-semibold uppercase ${
                                ret.return_status === "APPROVED"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                            >
                              {ret.return_status}
                            </div>
                            <div className="text-sm text-gray-500">
                              Refund:{" "}
                              <span className="font-medium text-black">
                                ${ret.refund_amount}
                              </span>
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
                <div className="text-center py-10 text-gray-500">
                  Loading Addresses...
                </div>
              )}
            </div>
          )}

          {activeSection === "password" && (
            <div>
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-1.5 w-full border-gray-300 border rounded-md p-4">
                <Lock size={22} />
                <div>CHANGE PASSWORD</div>
              </h1>
              <ChangePassword
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                error={error}
                setError={setError}
                loading={loading}
                handleChangePassword={handleChangePassword}
              />
            </div>
          )}
        </div>
      </div>

      {/* --- COMPLAINT MODAL --- */}
      {showComplaintModal && selectedOrder && (
        <ComplaintModal
          order={selectedOrder}
          onClose={() => setShowComplaintModal(false)}
          onSubmit={handleSubmitComplaint}
        />
      )}

      {/* --- RETURN MODAL (NEW) --- */}
      {showReturnModal && returnOrderData && (
        <ReturnModal
          order={returnOrderData}
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleSubmitReturn}
        />
      )}
    </div>
  );
};

export default Account;
