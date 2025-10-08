"use client";

const PriceDetails = () => {
  // const subtotal = items.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );
  // const discount = subtotal > 1000 ? 100 : 0;
  // const delivery = subtotal > 500 ? 0 : 50;
  // const total = subtotal - discount + delivery;

  return (
    <div className="bg-gray-100 rounded-md p-6 md:sticky top-0 h-max w-full mr-5">
      <h3 className="text-lg font-semibold text-slate-900">Order details</h3>
      <hr className="border-gray-300 mt-4 mb-8" />

      <ul className="text-slate-500 font-medium mt-8 space-y-4">
        <li className="flex flex-wrap gap-4 text-sm">
          Discount <span className="ml-auto text-slate-900 font-semibold">$0.00</span>
        </li>
        <li className="flex flex-wrap gap-4 text-sm">
          Shipping <span className="ml-auto text-slate-900 font-semibold">$2.00</span>
        </li>
        <li className="flex flex-wrap gap-4 text-sm">
          Tax <span className="ml-auto text-slate-900 font-semibold">$4.00</span>
        </li>
        <li className="flex flex-wrap gap-4 text-sm text-slate-900">
          Total <span className="ml-auto font-semibold">$216.00</span>
        </li>
      </ul>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
        >
          Checkout
        </button>
        <button
          type="button"
          className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-slate-900 border border-gray-300 rounded-md cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      <div className="mt-6">
        <p className="text-slate-900 text-sm font-medium mb-2">
          Do you have a promo code?
        </p>
        <div className="flex border border-blue-600 overflow-hidden rounded-md">
          <input
            type="email"
            placeholder="Promo code"
            className="w-full outline-0 bg-white text-slate-600 text-sm px-4 py-2.5"
          />
          <button
            type="button"
            className="flex items-center justify-center font-medium tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
