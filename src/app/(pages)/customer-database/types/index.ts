export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    address?: string;
    notes: string;
    tags: CustomerTag[];
    lastVisit: Date | null;
    totalVisits: number;
    totalSpent: number;
    createdAt: Date;
    preferredStaff?: string;
    avatar?: string;
  }
  
  export type CustomerTag = 'VIP' | 'New' | 'Frequent' | 'Inactive';
  
  export interface ServiceHistory {
    id: string;
    customerId: string;
    date: Date;
    services: ServiceItem[];
    staffName: string;
    totalAmount: number;
    paymentStatus: 'paid' | 'pending' | 'cancelled';
    notes?: string;
  }
  
  export interface ServiceItem {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
  }
  
  export interface CustomerFilters {
    searchQuery: string;
    tags: CustomerTag[];
    gender: string;
    sortBy: 'name' | 'lastVisit' | 'totalVisits' | 'totalSpent';
    sortOrder: 'asc' | 'desc';
  }
  
  export interface CustomerFormData {
    name: string;
    phone: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    address: string;
    notes: string;
    tags: CustomerTag[];
    preferredStaff: string;
  }