"use client";
import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";

const ChangePassword = ({ userId }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resetPasswordRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identity: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        CustomToast("Password changed successfully!");
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error("Password change error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex items-center gap-2 mb-4 lg:mb-0">
          <Lock size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">
            Change Your Password
          </h2>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? "Updating..." : "Get Reset Password Link"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
