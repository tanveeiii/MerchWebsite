"use client";
import { useEffect } from "react";
import { trackEvent } from "@/utils/analytics";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccess() {

  useEffect(() => {
    // Track the Purchase Event once the component loads
    const logPurchase = async () => {
       // Ideally, you pass the Order ID or Total Amount in the event_data
       await trackEvent("PURCHASE", "User completed a purchase", null, "/checkout/success");
    };

    logPurchase();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <CheckCircle size={64} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
      <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-lg">
        Continue Shopping
      </Link>
    </div>
  );
}