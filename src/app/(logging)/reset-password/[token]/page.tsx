"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@nextui-org/react";
import Link from "next/link"; // Import Link for navigation

import { useResetPassword } from "@/src/hooks/auth.hooks";
import CFInput from "@/src/components/form/CFInput";
import CFForm from "@/src/components/form/CFForm";

export default function ResetPasswordPage() {
  // Using useParams to get the token from the dynamic route
  const { token } = useParams();
  const { mutate: resetPassword, isError } = useResetPassword();
  const [passwordReset, setPasswordReset] = useState(false);

  const onSubmit = (data: { password: string }) => {
    // Ensure the token is a string
    if (typeof token === "string") {
      resetPassword(
        { token, newPassword: data.password },
        {
          onSuccess: () => setPasswordReset(true),
        },
      );
    } else {
      console.error("Invalid token format");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <h3 className="mb-4 text-2xl font-bold">Reset Password</h3>
      <div className="w-[75%] md:w-[55%] lg:w-[35%]">
        {passwordReset ? (
          <p>Your password has been successfully reset.</p>
        ) : (
          <CFForm onSubmit={onSubmit}>
            <div className="py-3">
              <CFInput label="New Password" name="password" type="password" />
            </div>
            <Button
              className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
              size="lg"
              type="submit"
            >
              Reset Password
            </Button>
          </CFForm>
        )}

        {/* Add Login Page Link */}
        <div className="text-center mt-4">
          Go back to&nbsp;
          <Link
            className="text-[#daa611] hover:text-[#a58a40] underline"
            href="/login"
          >
            Login
          </Link>
        </div>
      </div>
      {isError && (
        <p className="text-red-600">Error resetting password. Try again.</p>
      )}
    </div>
  );
}