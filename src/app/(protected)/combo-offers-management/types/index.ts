export interface ComboOffer {
    id: string;
    name: string;
    description: string;
    services: ComboService[];
    originalPrice: number;
    discountedPrice: number;
    savingsPercentage: number;
    isActive: boolean;
    validFrom: Date;
    validUntil: Date;
    minBookingRequirement?: number;
    customerEligibility: 'all' | 'new' | 'existing' | 'vip';
    staffCommissionRate: number | null;
    popularity: number;
    totalBookings: number;
    revenueGenerated: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ComboService {
    id: string;
    name: string;
    duration: number;
    originalPrice: number;
  }
  
  export interface ComboFormData {
    name: string;
    description: string;
    services: ComboService[];
    discountedPrice: number | null;
    validFrom: Date;
    validUntil: Date;
    minBookingRequirement?: number;
    customerEligibility: 'all' | 'new' | 'existing' | 'vip';
    staffCommissionRate: number | null;
  }
  
  export interface ComboFilters {
    status: 'all' | 'active' | 'inactive' | 'expired';
    searchQuery: string;
    sortBy: 'name' | 'savings' | 'popularity' | 'revenue';
    sortOrder: 'asc' | 'desc';
    minSavings?: number;
  }
  
  export interface PerformanceMetrics {
    totalCombos: number;
    activeCombos: number;
    totalRevenue: number;
    averageSavings: number;
    mostPopular: ComboOffer | null;
  }