"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AuthForms from "../AuthForm"; // Check this path matches your folder structure
import { AlertCircle, Link, Mail, RefreshCcw } from "lucide-react";
import { checkAuth } from "@/utils/checkauth";

// Modal Component (No changes needed here)
const ForgotPasswordModal = ({ setShowForgotPasswordModal }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // Add logic here to call your forgot-password API
    console.log("Reset password for:", email);
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-gray-100 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4 shadow-lg">
            <RefreshCcw className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email to receive reset instructions
          </p>
        </div>
        <form onSubmit={handleForgotPassword}>
          <div className="space-y-3">
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-black" />
              Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 pl-12 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg bg-black hover:shadow-black/25 transition-all"
            >
              Send Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (isAuth) router.replace("/discover");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  const handleLogin = async (formData) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Invalid email or password"
        );
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.id) {
        localStorage.setItem("userId", data.id);
      }
      router.push("/discover");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForms
        type={"login"}
        onSubmit={handleLogin} // This now points to the function with actual logic
        onToggleForm={() => router.push("/auth/signup")} // Ensure this path exists
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
