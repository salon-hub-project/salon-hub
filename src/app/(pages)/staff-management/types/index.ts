
export interface Employee {
  id: string;
  name: string;
  role: 'Manager' | 'Stylist' | 'Colorist' | 'Nail Technician' | 'Receptionist';
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  assignedServices: string[];
  performanceMetrics: {
    completedServices: number;
    customerRating: number;
    revenueGenerated: number;
    bookingCompletionRate: number;
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

export interface EmployeeFormData {
  name: string;
  role: string;
  phone: string;
  email: string;
  password: string;
  rating: number;
  commissionRate: number;
  assignedServices: string[];
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
  isActive: boolean;
  createdAt: string;
  rating:number;
  userId?: {
    email?: string;
    phoneNumber?: string;
  };
}

export type SortField = 'name' | 'role' | 'rating' | 'revenue';
export type SortOrder = 'asc' | 'desc';