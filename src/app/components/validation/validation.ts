import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registrationSchema = Yup.object({
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(
      /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      "Please enter a valid mobile number"
    ),

  emailId: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Please enter a complete address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),

  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

