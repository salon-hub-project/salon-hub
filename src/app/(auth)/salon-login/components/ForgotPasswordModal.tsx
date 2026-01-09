"use client";

import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { authApi } from "../../../services/auth.api";
import { Formik } from "formik";
import * as Yup from "yup";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-md p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Forgot Password</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            try {
              await authApi.forgotPassword({ email: values.email.trim() });
              onClose();
            } catch (error) {
              // Error is handled by the API
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={values.email}
                onChange={(e) => {
                  setFieldValue("email", e.target.value);
                }}
                error={touched.email ? errors.email : undefined}
                disabled={isSubmitting}
                required
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

