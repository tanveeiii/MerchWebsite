"use client";
import { useEffect } from "react";
import { trackEvent } from "@/utils/analytics";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function CheckoutSuccess() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/auth/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  useEffect(() => {
    const logPurchase = async () => {
      await trackEvent(
        "PURCHASE",
        "User completed a purchase",
        null,
        "/checkout/success"
      );
    };
    logPurchase();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <CheckCircle size={64} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
      <Link
        href="/discover"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
