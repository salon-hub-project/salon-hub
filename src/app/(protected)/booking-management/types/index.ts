export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender: "male" | "female" | "other";
  tags: string[];
  avatar?: string;
  totalVisits: number;
  lastVisit?: Date;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  isPopular: boolean;
  isActive: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar?: string;
  specializations: string[];
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  serviceDuration: number;
  servicePrice: number;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "Confirmed" | "Completed" | "cancelled";
  notes?: string;
  paymentStatus: "pending" | "paid";
  createdAt: Date;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  bookings: Booking[];
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  bookingCount: number;
}

export type ViewMode = "day" | "week";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid";

export interface BookingFormData {
  customerId: string;
  services: string[];
  staffId: string;
  date: Date;
  startTime: string;
  notes: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  staffId?: string;
  serviceId?: string;
  searchQuery?: string;
}

export interface BookingFormProps {
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  selectedDate?: Date;
  selectedTime?: string;
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
