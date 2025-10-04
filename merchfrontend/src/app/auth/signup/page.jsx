"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AuthForms from "../AuthForm";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (formData) => {
    setError("");

    setIsLoading(false);
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
