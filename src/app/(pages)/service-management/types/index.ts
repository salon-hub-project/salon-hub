export interface Service {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
    isPopular: boolean;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ServiceCategory {
    id: string;
    name: string;
    order: number;
    serviceCount: number;
  }
  
  export interface ServiceFormData {
    name: string;
    category: string;
    duration: number;
    price: number;
    isPopular: boolean;
    description?: string;
  }
  
  export interface BulkOperation {
    type: 'price' | 'status' | 'category';
    value: number | boolean | string;
    serviceIds: string[];
  }
  
  export interface ServiceFilters {
    category: string;
    status: 'all' | 'active' | 'inactive';
    searchQuery: string;
    sortBy: 'name' | 'price' | 'duration' | 'category';
    sortOrder: 'asc' | 'desc';
  }
  
  export interface ServiceStats {
    totalServices: number;
    activeServices: number;
    popularServices: number;
    categories: number;
  }