"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AuthForms from "../AuthForm";
import { AlertCircle, Mail, RefreshCcw } from "lucide-react";

const ForgotPasswordModal = ({ setShowForgotPasswordModal }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleForgotPassword = async (e) => {
    setError("");
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-25 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50 p-6 rounded-3xl shadow-lg max-w-sm w-full border-2 border-orange-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-pink-500 to-orange-500 rounded-full mb-4 shadow-lg">
            <RefreshCcw className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-orange-500 mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text">
            Reset Password
          </h2>
          <p className="text-gray-600">Reset your current password</p>
        </div>
        <form action="" onSubmit={handleForgotPassword}>
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-500" />
              Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 pl-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-4 justify-end">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className={`w-full py-4 rounded-xl border-2 border-pink-400 font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 transition-all`}
            >
              Cancel
            </button>
            <button
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-500 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transform`}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleLogin = async (formData) => {
    setError("");

    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <>
      <AuthForms
        type={"login"}
        onSubmit={handleLogin}
        onToggleForm={() => router.push("/auth/signup")}
        error={error}
        isLoading={isLoading}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          setShowForgotPasswordModal={setShowForgotPasswordModal}
        />
      )}
    </>
  );
}
