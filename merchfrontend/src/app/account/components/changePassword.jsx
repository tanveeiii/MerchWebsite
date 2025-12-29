"use client";
import React, { useState } from "react";
import { Lock } from "lucide-react";

const ChangePassword = ({ handleChangePassword, loading }) => {
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
          onClick={handleChangePassword}
          disabled={loading}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? "Sending..." : "Get Reset Password Link"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
