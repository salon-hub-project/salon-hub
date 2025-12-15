"use client";

import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { LoginFormData, ValidationErrors } from "../types";

interface Props {
  formData: LoginFormData;
  errors: ValidationErrors;
  onInputChange: (field: keyof LoginFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const LoginForm = ({
  formData,
  errors,
  onInputChange,
  onSubmit,
  isSubmitting,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Mobile Number"
        type="tel"
        placeholder="Enter registered mobile number"
        value={formData.mobileNumber}
        onChange={(e) =>
          onInputChange("mobileNumber", e.target.value)
        }
        error={errors.mobileNumber}
        disabled={isSubmitting}
        required
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            onInputChange("password", e.target.value)
          }
          error={errors.password}
          disabled={isSubmitting}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground"
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <div className="text-right">
        <a
          href="#"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Login
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href="/salon-registration"
          className="text-primary font-medium hover:underline"
        >
          Register
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
