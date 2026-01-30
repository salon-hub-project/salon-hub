export interface DashboardMetric {
    id: string;
    label: string;
    value: string | number;
    change?: number;
    changeType?: 'increase' | 'decrease';
    icon: string;
    color: string;
  }
  
  export interface TodayAppointment {
    id: string;
    customerName: string;
    customerAvatar: string;
    customerAvatarAlt: string;
    service: string;
    serviceId: string;
    time: string;
    endTime: string;
    duration: number;
    staffName: string;
    staffAvatar: string;
    staffAvatarAlt: string;
    status: "Confirmed" | "Completed" | "Pending";
    amount: number;
    comboOffers: string[];
    createdAt: Date
  }
  
  export interface RecentActivity {
    id: string;
    type: 'booking' | 'cancellation' | 'completion' | 'payment';
    message: string;
    timestamp: Date;
    icon: string;
    color: string;
  }
  
  export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    path: string;
    color: string;
    description: string;
  }
  
  export interface StaffUtilization {
    id: string;
    name: string;
    avatar: string;
    avatarAlt: string;
    appointmentsToday: number;
    revenue: number;
    utilizationRate: number;
  }
  
    export interface Notification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    path?: string;
  }