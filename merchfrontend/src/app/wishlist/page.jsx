"use client";
import React, { useEffect, useState } from 'react'
import { NavbarFinal } from '@/components/Navbar'

// ...existing code...
const sampleItems = [
  {
    id: 'sample-1',
    title: 'Classic Merch Tee',
    price: 24.99,
    image: 'https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400',
    section: 'T-Shirts',
    url: '/products/classic-merch-tee'
  },
  {
    id: 'sample-2',
    title: 'Cozy Hoodie',
    price: 49.5,
    image: 'https://via.placeholder.com/400x400?text=Cozy+Hoodie',
    section: 'Hoodies',
    url: '/products/cozy-hoodie'
  },
  {
    id: 'sample-3',
    title: 'Sticker Pack',
    price: 6.0,
    image: 'https://via.placeholder.com/400x400?text=Sticker+Pack',
    section: 'Accessories',
    url: '/products/sticker-pack'
  }
]

const Wishlist = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishlist')
      if (raw === null) {
        // No wishlist exists yet — seed with demo items
        localStorage.setItem('wishlist', JSON.stringify(sampleItems))
        setItems(sampleItems)
        return
      }
      const stored = JSON.parse(raw || '[]')
      setItems(Array.isArray(stored) ? stored : [])
    } catch {
      setItems([])
    }
  }, [])

  const removeItem = (id) => {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    localStorage.setItem('wishlist', JSON.stringify(next))
  }

  const clearAll = () => {
    setItems([])
    localStorage.removeItem('wishlist')
  }

  const loadDemo = () => {
    localStorage.setItem('wishlist', JSON.stringify(sampleItems))
    setItems(sampleItems)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <NavbarFinal />
      <main style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Your Wishlist</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                style={{ background: '#e53e3e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
              >
                Clear all
              </button>
            )}
            {items.length === 0 && (
              <button
                onClick={loadDemo}
                style={{ background: '#2b6cb0', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
              >
                Load demo items
              </button>
            )}
          </div>
        </header>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#666' }}>
            <p style={{ fontSize: 18 }}>No items in wishlist yet.</p>
            <p style={{ marginTop: 8 }}>Save items from product pages — they will appear here with the section they were saved from. You can also load demo items to preview the layout.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: '#999' }}>No image</div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{item.title}</h3>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
                    <strong style={{ color: '#111' }}>{item.price ? `$${item.price}` : 'Price N/A'}</strong>
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
                    Saved from: <span style={{ fontWeight: 600 }}>{item.section || 'Unknown section'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                    <a
                      href={item.url || '#'}
                      style={{ flex: 1, textAlign: 'center', padding: '8px 10px', borderRadius: 6, background: '#2b6cb0', color: '#fff', textDecoration: 'none' }}
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Wishlist
// ...existing code...