"use client";
import React, { useEffect, useState } from "react";
import { NavbarFinal } from "@/components/Navbar";
import { Loader2, Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
    // Ensure code runs only on client
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      // Optional: Redirect
      // router.push('/auth/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const mappedItems = data.map((item) => {
            const product = item.product || {};
            const imgUrl =
              Array.isArray(product.ProductImage) &&
              product.ProductImage.length > 0
                ? product.ProductImage[0].image_url
                : product.image_url ||
                  "https://readymadeui.com/images/product14.webp";

            return {
              id: item.wishlist_id,
              productId: product.product_id,
              title: product.product_name || "Unknown Item",
              price: product.base_price || "0.00",
              image: imgUrl,
              section: product.category?.category_name || "General",
              url: `/shop/product/${product.product_id}`,
            };
          });
          setItems(mappedItems);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeItem = async (wishlistId) => {
    const previousItems = [...items];
    setItems(items.filter((i) => i.id !== wishlistId));

    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/remove/${wishlistId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
    } catch (error) {
      console.error("Error deleting item:", error);
      setItems(previousItems);
      CustomToast("Failed to remove item.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarFinal />
      <ToastContainer />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          {items.length > 0 && (
            <button
              onClick={() => items.forEach((i) => removeItem(i.id))}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <ShoppingBag size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Your wishlist is empty.</p>
            <button
              onClick={() => router.push("/discover")}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <a
                  href={item.url}
                  className="block h-48 bg-gray-100 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                </a>
                <div className="p-4">
                  <a
                    href={item.url}
                    className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600"
                  >
                    {item.title}
                  </a>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-bold">
                      ${Number(item.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.section}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 border rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                    <a
                      href={item.url}
                      className="flex-1 text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center justify-center"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
