"use client";

import { useState, useEffect } from "react";
import RegistrationHeader from "./components/RegistrationHeader";
import RegistrationForm from "./components/RegistrationForm";
import OTPVerificationModal from "./components/OTPVerificationModal";
import SuccessMessage from "./components/SuccessMessage";
import { RegistrationFormData } from "./types";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  registerOwner,
  clearError,
  clearRegistrationSuccess,
} from "../../store/slices/authSlice";

import { Formik } from "formik";
import { registrationSchema } from "@/app/components/validation/validation";

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

  useEffect(() => {
    document.title = "Salon Registration - SalonHub";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/salon-dashboard");
    }
  }, [isAuthenticated, router]);

  // Registration success redirects
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

  // OTP verify (unchanged)
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

              <Formik
                initialValues={{
                  mobileNumber: "",
                  emailId: "",
                  address: "",
                  password: "",
                  confirmPassword: "",
                  termsAccepted: false,
                }}
                validationSchema={registrationSchema}
                validateOnBlur
                validateOnChange
                onSubmit={(values) => {
                  dispatch(
                    registerOwner({
                      email: values.emailId.trim(),
                      address: values.address.trim(),
                      password: values.password,
                      phoneNumber: values.mobileNumber.trim(),
                    })
                  );
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <RegistrationForm
                    formData={values}
                    errors={Object.fromEntries(
                      Object.entries(errors).map(([k, v]) => [
                        k,
                        touched[k as keyof typeof touched] ? v : undefined,
                      ])
                    )}
                    onInputChange={(field, value) => {
                      setFieldValue(field, value);

                      if (error) dispatch(clearError());
                    }}
                    onSubmit={handleSubmit}
                    isSubmitting={isLoading}
                  />
                )}
              </Formik>
            </div>
          )}

          {currentStep === "success" && (
            <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
              <SuccessMessage
                salonName="Salon"
                registrationId={registrationId}
                onContinue={handleContinue}
              />
            </div>
          )}
        </div>
      </div>

      <OTPVerificationModal
        isOpen={currentStep === "otp"}
        mobileNumber=""
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => setCurrentStep("form")}
        isVerifying={isVerifying}
      />
    </div>
  );
};

export default SalonRegistrationClient;














