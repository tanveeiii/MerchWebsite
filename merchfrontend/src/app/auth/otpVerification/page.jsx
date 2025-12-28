"use client";

import { useState, useEffect } from "react";
import { Sparkles, KeyRound, AlertCircle } from "lucide-react";

const OtpVerificationPage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    setTimeLeft(60);
  };

  const handleSubmit = async () => {
    console.log("OTP submitted:", otp);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-black/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 backdrop-blur-sm z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-black rounded-full mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-black bg-clip-text text-transparent">
            OTP Verification
          </h2>
          <p className="text-gray-600">Enter the OTP sent to your mail</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-500" />
              OTP Code
            </label>
            <div className="relative">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onInput={(e) => {
                  const maxLength = 6;
                  if (e.target.value.length > maxLength) {
                    e.target.value = e.target.value.slice(0, maxLength);
                  }
                }}
                type="number"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                className="no-spinner w-full p-4 pl-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 backdrop-blur-sm text-center text-lg tracking-widest"
              />
              <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-500 flex items-center justify-center gap-3 ${
              otp.length === 6 && !isLoading
                ? "bg-black text-white hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02] transform"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={otp.length !== 6}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <KeyRound className="w-6 h-6" />
                Verify OTP
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          {timeLeft > 0 ? (
            <span className="text-gray-600 text-sm">
              Didn't get the code?{" "}
              <span className="text-gray-400 font-semibold opacity-60 cursor-not-allowed select-none">
                Resend in {timeLeft}s
              </span>
            </span>
          ) : (
            <button
              type="button"
              className="text-gray-500 font-semibold text-sm hover:text-gray-600 transition-colors"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
