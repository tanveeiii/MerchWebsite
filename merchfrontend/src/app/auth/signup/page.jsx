"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AuthForms from "../AuthForm";
import { checkAuth } from "@/utils/checkauth";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (isAuth) router.replace("/discover");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

  const handleSignup = async (formData) => {
    setError("");
    setIsLoading(true);

    try {
      // Replace with your actual backend URL
      // If you are testing locally without a backend yet, this will fail unless you comment the fetch out.
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success! Redirect to login
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForms
      type="signup"
      onSubmit={handleSignup}
      onToggleForm={() => router.push("/auth/login")}
      error={error}
      isLoading={isLoading}
    />
  );
};

export default SignupPage;
