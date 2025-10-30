import React from "react";
import { NavbarFinal } from "../../../components/Navbar"; // Adjusted path (2 levels up)
import Footer from "../../../components/Footer"; // Adjusted path (2 levels up)
import {
  Mail,
  User,
  Lock,
  Phone,
  Home,
  MapPin,
  Hash,
} from "lucide-react";

// Main Page Component
const SignUpPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarFinal />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Increased max-width to accommodate new fields */}
        <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              And get exclusive deals and updates!
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm flex flex-col gap-4">
              {/* Personal Info Fields */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-medium text-gray-900 mb-2">
                  Personal Information
                </legend>
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="full-name"
                      name="name"
                      type="text"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Shipping Address Fields */}
              <fieldset className="space-y-4 pt-4">
                <legend className="text-lg font-medium text-gray-900 mb-2">
                  Shipping Address
                </legend>
                <div>
                  <label htmlFor="street-address" className="sr-only">
                    Street Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Home className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      id="street-address"
                      name="street-address"
                      type="text"
                      autoComplete="street-address"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Street Address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="sr-only">
                      City
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        required
                        className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="state" className="sr-only">
                      State / Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="address-level1"
                      required
                      className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="State / Province"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip-code" className="sr-only">
                      ZIP / Postal Code
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        id="zip-code"
                        name="zip-code"
                        type="text"
                        autoComplete="postal-code"
                        required
                        className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;

