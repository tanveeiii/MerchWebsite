"use client";
import React, { useEffect, useState } from 'react';
import { NavbarFinal } from '@/components/Navbar';
import { Loader2, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- Fetch Wishlist Data ---
  useEffect(() => {
    const fetchWishlist = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setLoading(false);
        return; // Alternatively, redirect to login
      }

      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          // Map Backend Data to Frontend UI Structure
          const mappedItems = data.map(item => {
            const product = item.product || {};
            // Get first image or fallback
            const imgUrl = product.ProductImage?.[0]?.image_url || 'https://readymadeui.com/images/product14.webp';
            
            return {
              id: item.wishlist_id, // Important: Use wishlist_id for deletion
              title: product.product_name || 'Unknown Item',
              price: product.base_price || '0.00',
              image: imgUrl,
              section: product.category?.category_name || 'General',
              url: `/products/${product.slug || '#'}`
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

  // --- Remove Item Handler ---
  const removeItem = async (wishlistId) => {
    // 1. Optimistic UI Update
    const previousItems = [...items];
    setItems(items.filter(i => i.id !== wishlistId));

    try {
      // 2. Call Backend
      const res = await fetch(`http://localhost:5000/api/wishlist/remove/${wishlistId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Failed to delete");
      
    } catch (error) {
      console.error("Error deleting item:", error);
      // Revert if failed
      setItems(previousItems);
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearAll = () => {
    // Optional: Implement a 'Delete All' endpoint in backend if needed
    // For now, we can loop delete or just alert
    alert("Clear all functionality requires a specific backend endpoint. Please remove items individually.");
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-gray-500" size={40} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <NavbarFinal />
      <main style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>Your Wishlist</h1>
          {items.length > 0 && (
            <button
              onClick={() => items.forEach(i => removeItem(i.id))} // Quick client-side clear loop
              style={{ background: '#e53e3e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#718096' }}>
            <ShoppingBag size={64} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p style={{ fontSize: 18, fontWeight: 500 }}>Your wishlist is empty.</p>
            <p style={{ marginTop: 8 }}>Save items you love to revisit them later.</p>
            <button 
              onClick={() => router.push('/discover')}
              style={{ marginTop: 20, background: '#3182ce', color: 'white', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid #edf2f7' }}>
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', padding: 20 }}>
                  <img src={item.image} alt={item.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ color: '#2b6cb0', fontSize: 18 }}>${Number(item.price).toFixed(2)}</strong>
                    <span style={{ fontSize: 12, background: '#edf2f7', padding: '2px 8px', borderRadius: 4, color: '#718096' }}>{item.section}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove from wishlist"
                      style={{ padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#e53e3e', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <a
                      href={item.url}
                      style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, background: '#3182ce', color: '#fff', textDecoration: 'none', fontWeight: 500, display: 'block' }}
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