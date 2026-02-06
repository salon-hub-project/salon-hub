"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { authApi } from "../../../services/auth.api";
import LoginHeader from "../../salon-login/components/LoginHeader";

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Reset Password - Salonvala";

    // Extract token from params - handle both string and array cases
    const tokenParam = params?.token;
    if (tokenParam) {
      const extractedToken = Array.isArray(tokenParam)
        ? tokenParam[0]
        : String(tokenParam);
      setToken(extractedToken);
      console.log("Token extracted from URL:", extractedToken);
    } else {
      console.log("No token found in params:", params);
    }
    setIsLoading(false);
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <p className="text-center text-destructive mb-4">
            Invalid reset token. Please request a new password reset link.
          </p>
          <Button
            onClick={() => router.push("/salon-login")}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <LoginHeader />

          <h2 className="text-2xl font-semibold text-center mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your new password below
          </p>

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={async (values) => {
              if (!token) {
                return;
              }

              setIsSubmitting(true);
              try {
                await authApi.resetPassword({
                  token: token,
                  newPassword: values.newPassword,
                });
                // Wait a bit before redirecting to show success message
                setTimeout(() => {
                  router.push("/salon-login");
                }, 1000);
              } catch (error: any) {
                // Error is handled by the API
                console.error("Reset password error:", error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={values.newPassword}
                    onChange={(e) => {
                      setFieldValue("newPassword", e.target.value);
                    }}
                    error={touched.newPassword ? errors.newPassword : undefined}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-muted-foreground"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={values.confirmPassword}
                    onChange={(e) => {
                      setFieldValue("confirmPassword", e.target.value);
                    }}
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-muted-foreground"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Reset Password
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/salon-login")}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
