import React, { forwardRef } from "react";

export const InvoicePrint = forwardRef(function InvoicePrint({ order }, ref) {
  if (!order) return null;

  return (
    <div ref={ref} className="p-10 bg-white text-black w-[800px]">
      <h1 className="text-3xl font-bold mb-6">INVOICE</h1>

      <div className="mb-6">
        <p><strong>Order No:</strong> {order.order_number}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.order_status}</p>
      </div>

      <hr className="my-4" />

      <h3 className="font-bold mb-2">Customer</h3>
      <p>{order.user?.first_name} {order.user?.last_name}</p>
      <p>{order.user?.email}</p>
      <p>{order.user?.mobile}</p>

      <hr className="my-4" />

      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.OrderItem?.map(item => (
            <tr key={item.order_item_id}>
              <td className="border p-2">{item.product?.product_name}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-right">
                ₹{Number(item.total_price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-6 text-xl font-bold">
        Total: ₹{Number(order.total_amount).toFixed(2)}
      </div>
    </div>
  );
});
