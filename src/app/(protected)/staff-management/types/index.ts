export interface Employee {
  id: string;
  name: string;
  role: {
    _id: string;
    name: string;
  };
  phone: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  isActive?: boolean;
  joinDate: string;
  assignedServices: string[];
  staffImage: File | string | null;
  target: number;
  targetType: string;
  performanceMetrics: {
    completedServices: number;
    customerRating: number;
    revenueGenerated: number;
    bookingCompletionRate: number;
    achievedAmount: number;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  commissionRate: number;
}

export interface PerformancePeriod {
  value: string;
  label: string;
}

export interface RoleFilter {
  value: string;
  label: string;
}

export interface StaffRoles {
  _id: string;
  name: string;
}
export interface EmployeeFormData {
  name: string;
  role: string;
  phone: string;
  email: string;
  password: string;
  rating: number | null;
  commissionRate: number | null;
  target: number | null;
  targetType: string;
  salary: number | null;
  breakStartTime: string; // ✅ ADD
  breakEndTime: string;
  assignedServices: string[];
  staffImage: File | string | null;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface Service {
  id: string;
  name: string;
  category: string;
}

export interface EmployeeApiResponse {
  _id: string;
  fullName: string;
  role: Employee["role"];
  commissionRate: number;
  assignedServices: { serviceName: string }[];
  workingDays: string[];
  status?: "active" | "inActive";
  isActive: boolean;
  createdAt: string;
  rating: number | null;
  userId?: {
    email?: string;
    phoneNumber?: string;
  };
  target: number;
  targetType: string;
  staffImage?: File | string | null;
  lifetimeRevenue: number;
  completedAppointments: number;
  achievedAmount: number;
}

export interface ServiceApiResponse {
  _id: string;
  serviceName: string;
  category: {
    _id: string;
    name: string;
  };
  duration: string;
  price: number;
  description?: string;
  markAsPopularService: boolean;
  isActive: boolean;
  ownerId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ServicesApiResponse {
  success: boolean;
  data: ServiceApiResponse[];
  pagination?: {
    totalServices: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  message?: string;
}

export type SortField = "name" | "role" | "rating" | "revenue" | "joinDate";
export type SortOrder = "asc" | "desc";
