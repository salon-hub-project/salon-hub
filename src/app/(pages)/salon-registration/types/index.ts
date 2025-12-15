export interface RegistrationFormData {
    salonName: string;
    ownerName: string;
    mobileNumber: string;
    address: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }
  
  export interface ValidationErrors {
    salonName?: string;
    ownerName?: string;
    mobileNumber?: string;
    address?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
  }
  
  export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    suggestions: string[];
  }
  
  export interface OTPVerificationData {
    otp: string;
    mobileNumber: string;
  }
  
  export interface RegistrationResponse {
    success: boolean;
    message: string;
    registrationId?: string;
  }