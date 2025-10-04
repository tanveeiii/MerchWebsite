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
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isSignup = type === "signup";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-orange-200 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 rounded-full mb-4 shadow-lg">
            {isSignup ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <LogIn className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {isSignup
              ? "Join us and start deploying"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-orange-50 rounded-2xl p-2 border border-orange-200">
            <div className="flex">
              <button
                type="button"
                onClick={onToggleForm}
                className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !isSignup
                    ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white shadow-lg"
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
                    ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Signup
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Full Name
              </label>
              <div className="relative">
                <input
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 pl-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  required={isSignup}
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

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
                className="w-full p-4 pl-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-4 pl-12 pr-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

          {isSignup && (
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-500" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-4 pl-12 pr-12 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                  required={isSignup}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!isSignup && (
            <div className="text-right">
              <button
                type="button"
                className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
                onClick={() => setShowForgotPasswordModal(true)}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-500 flex items-center justify-center gap-3 ${
              !isLoading
                ? "bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transform"
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
          <p className="text-gray-600 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              {isSignup ? "Sign in here" : "Create one now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [type, setType] = useState("login");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setError("");
  };

  const handleToggleForm = () => {
    setType((prev) => (prev === "login" ? "signup" : "login"));
    setError("");
  };

  return (
    <AuthForms
      type={type}
      onSubmit={handleSubmit}
      onToggleForm={handleToggleForm}
      error={error}
      isLoading={isLoading}
      setShowForgotPasswordModal={setShowForgotPasswordModal}
    />
  );
}

export default AuthForms;
