"use client";
import Image from "next/image";

const CartItems = ({ items, onQuantityChange, onRemove }) => {
  return (
    <div className="grid lg:grid-cols-2 w-full mx-5">
      <div className="lg:col-span-2 bg-gray-100 p-6 rounded-md w-full">
        <h3 className="text-lg font-semibold text-slate-900">Your Cart</h3>
        <hr className="border-gray-300 mt-4 mb-8" />

        <div className="sm:space-y-6 space-y-8">
          <div className="grid sm:grid-cols-3 items-center gap-4">
            <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
              <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                <img
                  src="https://readymadeui.com/images/product14.webp"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-slate-900">
                  Velvet Sneaker
                </h4>
                <h6 className="text-xs font-medium text-red-500 cursor-pointer mt-1">
                  Remove
                </h6>
                <div className="flex gap-4 mt-4">
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs font-medium cursor-pointer outline-0 bg-transparent rounded-md"
                    >
                      XL
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-2.5 fill-gray-500 inline ml-2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                          clipRule="evenodd"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                    <ul className="group-hover:block hidden absolute rounded-md min-w-[80px] shadow-lg bg-white z-[1000]">
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        SM
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        MD
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        XL
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        XXL
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs rounded-md">
                      <span className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 124 124"
                        >
                          <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                        </svg>
                      </span>

                      <span className="mx-3">2</span>
                      <span className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 42 42"
                        >
                          <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:ml-auto">
              <h4 className="text-[15px] font-semibold text-slate-900">$20.00</h4>
            </div>
          </div>

          {/* Additional cart items can follow the same structure */}
        </div>
        <div className="sm:space-y-6 space-y-8 py-2">
          <div className="grid sm:grid-cols-3 items-center gap-4">
            <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
              <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                <img
                  src="https://readymadeui.com/images/product14.webp"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-slate-900">
                  Velvet Sneaker
                </h4>
                <h6 className="text-xs font-medium text-red-500 cursor-pointer mt-1">
                  Remove
                </h6>
                <div className="flex gap-4 mt-4">
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs font-medium cursor-pointer outline-0 bg-transparent rounded-md"
                    >
                      XL
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-2.5 fill-gray-500 inline ml-2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                          clipRule="evenodd"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                    <ul className="group-hover:block hidden absolute rounded-md min-w-[80px] shadow-lg bg-white z-[1000]">
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        SM
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        MD
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        XL
                      </li>
                      <li className="py-2 px-4 hover:bg-gray-100 text-slate-900 text-xs font-medium cursor-pointer">
                        XXL
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs rounded-md">
                      <span className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 124 124"
                        >
                          <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                        </svg>
                      </span>

                      <span className="mx-3">2</span>
                      <span className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 42 42"
                        >
                          <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:ml-auto">
              <h4 className="text-[15px] font-semibold text-slate-900">$20.00</h4>
            </div>
          </div>

          {/* Additional cart items can follow the same structure */}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
