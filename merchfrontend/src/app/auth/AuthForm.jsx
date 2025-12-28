import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  Sparkles,
  Phone,    // New Icon
  Calendar, // New Icon
  Users,    // New Icon
} from "lucide-react";

const AuthForms = ({
  type,
  onSubmit,
  onToggleForm,
  error,
  isLoading = false,
  setShowForgotPasswordModal,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "", // Added
    dob: "",    // Added
    gender: "", // Added
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "signup") {
      // --- SIGNUP LOGIC ---
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".";

      const submissionData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        first_name: firstName,
        last_name: lastName,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
      };
      
      onSubmit(submissionData);

    } else {
      // --- LOGIN LOGIC ---
      const submissionData = {
        identity: formData.email, // <--- CHANGED: "email" to "identity" to match your Backend
        password: formData.password,
      };
      
      onSubmit(submissionData);
    }
  };

  const isSignup = type === "signup";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* ... (Background divs remain the same) ... */}
      
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 backdrop-blur-sm">
        {/* ... (Header section remains the same) ... */}
        
        <div className="text-center mb-8">
            {/* Header Icon and Title code here... (omitted for brevity, keep your original) */}
             <h2 className="text-3xl font-bold mb-2 bg-black bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {/* Toggle Buttons (Login/Signup) */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-2xl p-2 border border-gray-200">
             {/* ... (Keep your original toggle buttons) ... */}
              <div className="flex">
              <button
                type="button"
                onClick={onToggleForm}
                className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !isSignup
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                type="button"
                onClick={onToggleForm}
                className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isSignup
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Signup
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          {isSignup && (
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> Full Name
              </label>
              <div className="relative">
                <input
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={isSignup}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-black" /> Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* NEW FIELDS: Mobile, DOB, Gender (Only show on Signup) */}
          {isSignup && (
            <>
              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" /> Mobile Number
                </label>
                <div className="relative">
                  <input
                    name="mobile"
                    type="tel"
                    placeholder="1234567890"
                    className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                    value={formData.mobile}
                    onChange={handleChange}
                    required={isSignup}
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Date of Birth */}
                <div className="space-y-2 flex-1">
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black" /> DOB
                  </label>
                  <div className="relative">
                    <input
                      name="dob"
                      type="date"
                      className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-gray-500"
                      value={formData.dob}
                      onChange={handleChange}
                      required={isSignup}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Gender Dropdown */}
                <div className="space-y-2 flex-1">
                  <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" /> Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      className="w-full p-3 pl-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none appearance-none bg-none"
                      value={formData.gender}
                      onChange={handleChange}
                      required={isSignup}
                    >
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Password Input */}
          <div className="space-y-2">
             {/* ... (Keep your original Password Logic) ... */}
              <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 pl-10 pr-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {isSignup && (
             // ... (Keep your original Confirm Password Logic) ...
             <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-black" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-3 pl-10 pr-10 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                  required={isSignup}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                {/* Updated error display to handle long backend messages better */}
                <p className="text-red-700 text-sm break-words">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-500 flex items-center justify-center gap-3 ${
              !isLoading
                ? "bg-black text-white hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02] transform"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
             {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignup ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              <>
                {isSignup ? (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    Sign In
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
             {/* Footer logic (keep your original) */}
              <p className="text-gray-600 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-gray-500 hover:text-gray-600 font-semibold transition-colors"
            >
              {isSignup ? "Sign in here" : "Create one now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;