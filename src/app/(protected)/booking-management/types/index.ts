import { ComboOffer } from "../../combo-offers-management/types";

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
  preferredStaff?: any;
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
  status: "Confirmed" | "Completed" | "cancelled";
  notes?: string;
  paymentStatus: "pending" | "paid";
  createdAt: Date;
  commisionEarned?: number;
  comboOffers?: {
    id: string;
    name: string;
  }[];
  amount: number;
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

export type ViewMode = "day" | "week" | "viewAll";
export type BookingStatus = "Confirmed" | "Completed" | "cancelled";
export type PaymentStatus = "pending" | "paid";

export interface SelectedItem {
  value: string;
  label: string;
  type: "service" | "combo";
}

export interface BookingFormData {
  customerId: string;
  selectedItems: SelectedItem[];
  staffId: string;
  date: Date;
  startTime: string;
  notes: string;
}

// export interface BookingFormData {
//   customerId: string;
//   services: string[];
//   comboOffers: string[];
//   staffId: string;
//   date: Date;
//   startTime: string;
//   notes: string;
// }

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
  comboOffers: ComboOffer[];
  setComboOffers?: (c: ComboOffer[])=> void;
  selectedDate?: Date;
  selectedTime?: string;
  onSubmit?: (data: BookingFormData) => void;
  onCancel: () => void;
  onSuccess: () => void;
  isLoading?: boolean;
  bookingToEdit?: Booking | null;
  changeStaffOnly?: boolean;
  onDateChange?: (date: Date) => void;
  initialCustomerId?: string;
}
