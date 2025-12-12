export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const handleRazorpayPayment = async (orderTotal, userDetails, onSuccess, onFailure) => {
    const res = await loadRazorpayScript();

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    try {
        // 1. Create Order on Backend
        const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: orderTotal }),
        });
        
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || "Server error");

        // 2. Options for Razorpay Modal
        const options = {
            key: orderData.key_id, 
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Merch Store",
            description: "Thank you for your purchase",
            image: "https://readymadeui.com/images/product14.webp", // Your logo
            order_id: orderData.order_id, 
            handler: async function (response) {
                // 3. Verify Payment on Backend
                try {
                    const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });
                    
                    const verifyData = await verifyRes.json();
                    
                    if (verifyRes.ok && verifyData.status === 'success') {
                        onSuccess(response);
                    } else {
                        onFailure("Payment verification failed");
                    }
                } catch (error) {
                    onFailure("Verification API error");
                }
            },
            prefill: {
                name: userDetails.name || "User",
                email: userDetails.email || "user@example.com",
                contact: userDetails.mobile || "9999999999",
            },
            notes: {
                address: "Merch Store Order",
            },
            theme: {
                color: "#2563EB", // Blue color matching your buttons
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (error) {
        console.error("Payment Error:", error);
        onFailure(error.message);
    }
};