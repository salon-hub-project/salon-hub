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

  termsAccepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

export const customerValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  preferredStaff: Yup.string().required("Please select one member"),
  dateOfBirth: Yup.string().required("DOB is required"),
});

export const appointmentValidationSchema = Yup.object({
  customerId: Yup.string().required("Please select a customer"),
  services: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one service"),
  staffId: Yup.string().required("Please select a staff member"),
  startTime: Yup.string().required("Please select a time"),
  date: Yup.date().required("Date is required"),
  notes: Yup.string(),
});


export const comboValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Combo name is required"),
  description: Yup.string().nullable(),
  services: Yup.array()
    .min(2, "Please select at least 2 services")
    .required(),
  discountedPrice: Yup.number()
    .moreThan(0, "Price must be greater than 0")
    .required(),
  validFrom: Yup.date().required(),
  validUntil: Yup.date()
    .min(Yup.ref("validFrom"), "End date must be after start date")
    .required(),
  minBookingRequirement: Yup.number().nullable(),
  customerEligibility: Yup.string().oneOf(["all", "new", "existing", "vip"]),
  staffCommissionRate: Yup.number()
    .min(0)
    .max(100)
    .required(),
});

//Service Component Validation SChema:-
export const serviceValidationSchema = Yup.object({
  name: Yup.string().trim().required("Service name is required"),
  category: Yup.string().required("Category is required"),
  duration: Yup.number().min(1, "Duration must be greater than 0"),
  price: Yup.number().min(1, "Price must be greater than 0"),
  description: Yup.string().optional(),
});

//Staff Components validation Schema:-
export const addValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  role: Yup.string().required("Role is required"),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  commissionRate: Yup.number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Commission rate is required"),
  assignedServices: Yup.array()
    .of(Yup.string())
    .min(1, "At least one service must be assigned"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  rating: Yup.number()
    .min(0, "Minimum rating is 0")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
});

export const updateValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  role: Yup.string().required("Role is required"),
  commissionRate: Yup.number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Commission rate is required"),
  assignedServices: Yup.array()
    .of(Yup.string())
    .min(1, "At least one service must be assigned"),
});