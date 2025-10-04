import React, { Suspense } from "react";
import ResetPasswordPage from "./ResetPassword";

const page = () => {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;
