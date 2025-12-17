"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { LoginFormData, ValidationErrors } from "./types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    document.title = "Login - SalonHub";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/salon-dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <LoginHeader />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <LoginForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
