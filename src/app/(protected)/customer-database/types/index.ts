export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    address?: string;
    notes: string;
    tags: string[];
    lastVisit: Date | null;
    totalVisits: number;
    totalSpent: number;
    createdAt: Date;
    preferredStaff?: string;
    avatar?: string;
    tagIds?: string[];
  }
  
  export type CustomerTag = string;
  
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
    notes?: string;
    tags: CustomerTag[];
    preferredStaff: string;
  }

  export interface CustomerFormikValues {
  name: string;
  phone: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  tags: CustomerTag[];
  preferredStaff: string;
  notes?:string;
}

export interface CustomerApiResponse {
  _id: string;
  fullName: string;
  gender: string;
  DOB: string;
  preferredStaff?: {
    _id: string;
    fullName: string;
  };
  customerTag: string[];
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
  userId: {
    email?: string;
    phoneNumber: string;
  };
}

