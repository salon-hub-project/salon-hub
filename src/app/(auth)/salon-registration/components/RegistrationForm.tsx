"use client";

import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import {
  RegistrationFormData,
  ValidationErrors,
} from "../types";

interface RegistrationFormProps {
  formData: RegistrationFormData;
  errors: ValidationErrors;
  onInputChange: (
    field: keyof RegistrationFormData,
    value: string | boolean
  ) => void;
  onSubmit: any;
  isSubmitting: boolean;
}

const RegistrationForm = ({
  formData,
  errors,
  onInputChange,
  onSubmit,
  isSubmitting,
}: RegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score++;
    else suggestions.push("Use at least 8 characters");

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push("Include upper + lower case");

    if (/\d/.test(password)) score++;
    else suggestions.push("Add a number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else suggestions.push("Add a special character");

    const strengthMap = [
      { label: "Weak", color: "bg-error" },
      { label: "Fair", color: "bg-warning" },
      { label: "Good", color: "bg-accent" },
      { label: "Strong", color: "bg-success" },
      { label: "Very Strong", color: "bg-success" },
    ];

    return {
      score,
      label: strengthMap[score].label,
      color: strengthMap[score].color,
      suggestions,
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Mobile Number"
        type="tel"
        placeholder="Enter your mobile number"
        value={formData.mobileNumber}
        onChange={(e) => onInputChange("mobileNumber", e.target.value)}
        error={errors.mobileNumber}
        required
        disabled={isSubmitting}
        maxLength={10}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email address"
        value={formData.emailId}
        onChange={(e) => onInputChange("emailId", e.target.value)}
        error={errors.emailId}
        required
        disabled={isSubmitting}
      />

      <Input
        label="Address"
        placeholder="Add your address"
        value={formData.address}
        onChange={(e) => onInputChange("address", e.target.value)}
        error={errors.address}
        required
        disabled={isSubmitting}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => onInputChange("password", e.target.value)}
          error={errors.password}
          required
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9"
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>

        <PasswordStrengthIndicator
          strength={passwordStrength}
          password={formData.password}
        />
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9"
        >
          {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        checked={formData.termsAccepted}
        onChange={(e) =>
          onInputChange("termsAccepted", e.target.checked)
        }
        error={errors.termsAccepted}
        required
        disabled={isSubmitting}
      />

      <Button fullWidth type="submit" loading={isSubmitting}>
        Register Salon
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <a href="/salon-login" className="text-primary font-medium">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default RegistrationForm;
