"use client';"
import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { RegistrationFormData, ValidationErrors, PasswordStrength } from '../types';

interface RegistrationFormProps {
  formData: RegistrationFormData;
  errors: ValidationErrors;
  onInputChange: (field: keyof RegistrationFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
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

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score++;
    else suggestions.push('Use at least 8 characters');

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push('Include both uppercase and lowercase letters');

    if (/\d/.test(password)) score++;
    else suggestions.push('Add at least one number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else suggestions.push('Include at least one special character');

    const strengthMap = [
      { label: 'Weak', color: 'bg-error' },
      { label: 'Fair', color: 'bg-warning' },
      { label: 'Good', color: 'bg-accent' },
      { label: 'Strong', color: 'bg-success' },
      { label: 'Very Strong', color: 'bg-success' },
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
        label="Salon Name"
        type="text"
        placeholder="Enter your salon name"
        value={formData.salonName}
        onChange={(e) => onInputChange('salonName', e.target.value)}
        error={errors.salonName}
        required
        disabled={isSubmitting}
      />

      <Input
        label="Owner Name"
        type="text"
        placeholder="Enter owner's full name"
        value={formData.ownerName}
        onChange={(e) => onInputChange('ownerName', e.target.value)}
        error={errors.ownerName}
        required
        disabled={isSubmitting}
      />

      <Input
        label="Mobile Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={formData.mobileNumber}
        onChange={(e) => onInputChange('mobileNumber', e.target.value)}
        error={errors.mobileNumber}
        description="We'll send an OTP to this number via WhatsApp"
        required
        disabled={isSubmitting}
      />

      <Input
        label="Address"
        type="text"
        placeholder="Enter salon address"
        value={formData.address}
        onChange={(e) => onInputChange('address', e.target.value)}
        error={errors.address}
        required
        disabled={isSubmitting}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          error={errors.password}
          required
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
        <PasswordStrengthIndicator strength={passwordStrength} password={formData.password} />
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          required
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <div className="space-y-4">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData.termsAccepted}
          onChange={(e) => onInputChange('termsAccepted', e.target.checked)}
          error={errors.termsAccepted}
          // required
          disabled={isSubmitting}
        />

        <div className="flex gap-2 text-sm text-muted-foreground">
          <a
            href="#"
            className="text-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </a>
          <span>•</span>
          <a
            href="#"
            className="text-primary hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Register Salon
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <a href="/salon-login" className="text-primary hover:underline font-medium">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default RegistrationForm;