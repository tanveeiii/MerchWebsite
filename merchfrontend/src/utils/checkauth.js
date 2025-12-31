export const checkAuth = async () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const adminAuthenticated = localStorage.getItem("adminAuthenticated");
  if (adminAuthenticated) return true;
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    if (!payload || typeof payload.exp !== "number") return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (err) {
    console.error("checkAuth error:", err);
    return false;
  }
};
