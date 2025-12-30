"use client";
import { useEffect } from "react";
import { trackEvent } from "@/utils/analytics";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { checkAuth } from "@/utils/checkauth";
import { useRouter } from "next/navigation";

export default function CheckoutFailure() {
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
    const logFailure = async () => {
      await trackEvent(
        "PURCHASE_FAILED",
        "User checkout failed",
        null,
        "/checkout/failure"
      );
    };
    logFailure();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <XCircle size={64} className="text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong with your payment. Please try again.
      </p>

      <Link href="/cart" className="bg-black text-white px-6 py-3 rounded-lg">
        Go Back to Cart
      </Link>
    </div>
  );
}
