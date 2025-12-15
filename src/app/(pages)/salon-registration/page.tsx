"use client";
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import OTPVerificationModal from './components/OTPVerificationModal';
import SuccessMessage from './components/SuccessMessage';
import { RegistrationFormData, ValidationErrors } from './types';
import { useRouter } from 'next/navigation';

const SalonRegistration = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'otp' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const [formData, setFormData] = useState<RegistrationFormData>({
    salonName: '',
    ownerName: '',
    mobileNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    document.title = 'Salon Registration - SalonHub';
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.salonName.trim()) {
      newErrors.salonName = 'Salon name is required';
    } else if (formData.salonName.trim().length < 3) {
      newErrors.salonName = 'Salon name must be at least 3 characters';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    } else if (formData.ownerName.trim().length < 3) {
      newErrors.ownerName = 'Owner name must be at least 3 characters';
    }

    const phoneRegex = /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Skip OTP for now and go straight to dashboard
      // router.push('/salon-dashboard');
      setCurrentStep('otp');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const handleOTPVerify = async (otp: string) => {
    setIsVerifying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockRegistrationId = `REG${Date.now().toString().slice(-8)}`;
      setRegistrationId(mockRegistrationId);
      setCurrentStep('success');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPResend = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('OTP resent successfully');
    } catch (error) {
      console.error('OTP resend error:', error);
    }
  };

  const handleContinue = () => {
    router.push('/salon-dashboard');
    console.log('Navigated to salon dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {currentStep === 'form' && (
            <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
              <RegistrationHeader />
              <RegistrationForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                // onSubmit={handleContinue}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {currentStep === 'success' && (
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
        isOpen={currentStep === 'otp'}
        mobileNumber={formData.mobileNumber}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onClose={() => setCurrentStep('form')}
        isVerifying={isVerifying}
      />
    </div>
  );
};

export default SalonRegistration;