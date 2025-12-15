"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { LoginFormData, ValidationErrors } from "./types";
// import { LoginFormData, ValidationErrors } from "./types";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Login - SalonHub";
  }, []);

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    const phoneRegex = /^\+?\d{10,14}$/;

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!phoneRegex.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Enter a valid mobile number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // mock login
      await new Promise((res) => setTimeout(res, 1200));
      router.push("/salon-dashboard");
    } catch (err) {
      console.error("Login error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <LoginHeader />
          <LoginForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
