"use client";

import { useState, useEffect } from "react";
import RegistrationHeader from "./components/RegistrationHeader";
import RegistrationForm from "./components/RegistrationForm";
import OTPVerificationModal from "./components/OTPVerificationModal";
import SuccessMessage from "./components/SuccessMessage";
import { RegistrationFormData, ValidationErrors } from "./types";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  registerOwner,
  clearError,
  clearRegistrationSuccess,
} from "../../store/slices/authSlice";

const SalonRegistrationClient = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, registrationSuccess, isAuthenticated } =
    useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState<"form" | "otp" | "success">(
    "form"
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  const [formData, setFormData] = useState<RegistrationFormData>({
    salonName: "",
    ownerName: "",
    mobileNumber: "",
    address: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    document.title = "Salon Registration - SalonHub";
  }, []);

  // If already authenticated, do not allow returning to registration page
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/salon-dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (registrationSuccess) {
      router.push("/salon-login");
      dispatch(clearRegistrationSuccess());
    }
  }, [registrationSuccess, router, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRegistrationSuccess());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!emailRegex.test(formData.emailId.trim())) {
      newErrors.emailId = "Please enter a valid email address";
    }

    // Phone number validation
    const phoneRegex = /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!phoneRegex.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string | boolean
  ) => {
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

    if (!validateForm()) {
      return;
    }

    dispatch(
      registerOwner({
        email: formData.emailId.trim(),
        address: formData.address.trim(),
        password: formData.password,
        phoneNumber: formData.mobileNumber.trim(),
      })
    );
  };

  const handleOTPVerify = async (otp: string) => {
    setIsVerifying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockRegistrationId = `REG${Date.now().toString().slice(-8)}`;
      setRegistrationId(mockRegistrationId);
      setCurrentStep("success");
    } catch (err) {
      console.error("OTP verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPResend = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP resent successfully");
    } catch (err) {
      console.error("OTP resend error:", err);
    }
  };

  const handleContinue = () => {
    router.push("/salon-login");
    console.log("Navigated to salon dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {currentStep === "form" && (
            <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
              <RegistrationHeader />

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <RegistrationForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={isLoading}
              />
            </div>
          )}

          {currentStep === "success" && (
            <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
              <SuccessMessage
                salonName={formData.salonName}
                registrationId={registrationId}
                onContinue={handleContinue}
              />
            </div>
          )}
        </div>
      </div>

      <OTPVerificationModal
        isOpen={currentStep === "otp"}
        mobileNumber={formData.mobileNumber}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => setCurrentStep("form")}
        isVerifying={isVerifying}
      />
    </div>
  );
};

export default SalonRegistrationClient;




