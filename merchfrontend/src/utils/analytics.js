export const trackEvent = async (eventType, eventData, productId = null, pageUrl = window.location.pathname) => {
  const userEmail = localStorage.getItem("userEmail"); // Or however you store logged-in user info
  if (!userEmail) return;

  try {
    await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "analytics/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        product_id: productId ? Number(productId) : undefined, // Optional
        event_type: eventType, // 'VIEW', 'ADD_TO_CART', 'PURCHASE', 'SEARCH'
        page_url: pageUrl,
        ip_address: "127.0.0.1",
        event_data: eventData
      }),
    });
  } catch (err) {
    console.error("Analytics Error:", err);
  }
};