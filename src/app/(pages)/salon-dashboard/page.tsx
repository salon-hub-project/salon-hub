"use client";
import { useState } from 'react'; 
// import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import MetricCard from './components/MetricCard';
import AppointmentCard from './components/AppointmentCard';
import QuickBookingWidget from './components/QuickBookingWidget';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import StaffUtilizationCard from './components/StaffUtilizationCard';
import NotificationPanel from './components/NotificationPanel';
import {
  DashboardMetric,
  TodayAppointment,
  RecentActivity,
  QuickAction,
  StaffUtilization,
  Notification,
} from './types';
import { useRouter } from 'next/navigation';

const SalonDashboard = () => {
  // const navigate = useNavigate();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah@salonhub.com",
    role: "salon_owner" as const,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    salonName: "Elegance Beauty Salon",
  };

  const dashboardMetrics: DashboardMetric[] = [
    {
      id: "1",
      label: "Today's Appointments",
      value: 24,
      change: 12,
      changeType: "increase",
      icon: "Calendar",
      color: "bg-primary",
    },
    {
      id: "2",
      label: "Today's Revenue",
      value: "INR 1,850",
      change: 8,
      changeType: "increase",
      icon: "IndianRupee",
      color: "bg-success",
    },
    {
      id: "3",
      label: "Active Customers",
      value: 156,
      change: 5,
      changeType: "increase",
      icon: "Users",
      color: "bg-accent",
    },
    {
      id: "4",
      label: "Staff Utilization",
      value: "87%",
      change: 3,
      changeType: "decrease",
      icon: "TrendingUp",
      color: "bg-warning",
    },
  ];

  const todayAppointments: TodayAppointment[] = [
    {
      id: "1",
      customerName: "Emma Wilson",
      customerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
      customerAvatarAlt: "Professional woman with brown hair in business attire smiling at camera",
      service: "Haircut & Styling",
      time: "09:00 AM",
      duration: 60,
      staffName: "Sarah Johnson",
      staffAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      staffAvatarAlt: "Blonde woman in professional salon uniform with friendly smile",
      status: "confirmed",
      price: 85,
    },
    {
      id: "2",
      customerName: "Michael Brown",
      customerAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
      customerAvatarAlt: "Young man with short dark hair in casual blue shirt",
      service: "Hair Coloring",
      time: "10:30 AM",
      duration: 120,
      staffName: "Emily Davis",
      staffAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      staffAvatarAlt: "Brunette stylist in black salon apron with professional appearance",
      status: "in-progress",
      price: 150,
    },
    {
      id: "3",
      customerName: "Jessica Taylor",
      customerAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
      customerAvatarAlt: "Woman with long red hair in elegant white blouse",
      service: "Manicure & Pedicure",
      time: "11:00 AM",
      duration: 90,
      staffName: "Michael Brown",
      staffAvatar: "https://randomuser.me/api/portraits/men/46.jpg",
      staffAvatarAlt: "Male nail technician in professional salon attire",
      status: "pending",
      price: 65,
    },
    {
      id: "4",
      customerName: "David Martinez",
      customerAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
      customerAvatarAlt: "Middle-aged man with gray hair in business suit",
      service: "Facial Treatment",
      time: "02:00 PM",
      duration: 75,
      staffName: "Jessica Wilson",
      staffAvatar: "https://randomuser.me/api/portraits/women/47.jpg",
      staffAvatarAlt: "Esthetician in white uniform with warm smile",
      status: "confirmed",
      price: 95,
    },
    {
      id: "5",
      customerName: "Lisa Anderson",
      customerAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
      customerAvatarAlt: "Young woman with blonde hair in casual summer dress",
      service: "Hair Styling",
      time: "03:30 PM",
      duration: 45,
      staffName: "Sarah Johnson",
      staffAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      staffAvatarAlt: "Blonde woman in professional salon uniform with friendly smile",
      status: "confirmed",
      price: 55,
    },
    {
      id: "6",
      customerName: "Robert Garcia",
      customerAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
      customerAvatarAlt: "Man with dark beard in casual polo shirt",
      service: "Haircut",
      time: "04:00 PM",
      duration: 30,
      staffName: "Michael Brown",
      staffAvatar: "https://randomuser.me/api/portraits/men/46.jpg",
      staffAvatarAlt: "Male stylist in professional salon attire",
      status: "pending",
      price: 45,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "booking",
      message: "New booking from Emma Wilson for Haircut & Styling",
      timestamp: new Date(Date.now() - 300000),
      icon: "Calendar",
      color: "bg-primary",
    },
    {
      id: "2",
      type: "completion",
      message: "Service completed for Michael Brown - Hair Coloring",
      timestamp: new Date(Date.now() - 600000),
      icon: "CheckCircle",
      color: "bg-success",
    },
    {
      id: "3",
      type: "cancellation",
      message: "Appointment cancelled by Jessica Taylor",
      timestamp: new Date(Date.now() - 900000),
      icon: "XCircle",
      color: "bg-error",
    },
    {
      id: "4",
      type: "payment",
      message: "Payment received from David Martinez - INR 95",
      timestamp: new Date(Date.now() - 1200000),
      icon: "IndianRupee",
      color: "bg-success",
    },
    {
      id: "5",
      type: "booking",
      message: "New booking from Lisa Anderson for Hair Styling",
      timestamp: new Date(Date.now() - 1800000),
      icon: "Calendar",
      color: "bg-primary",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "1",
      label: "New Booking",
      icon: "CalendarPlus",
      path: "/booking-management",
      color: "bg-primary",
      description: "Create appointment",
    },
    {
      id: "2",
      label: "Manage Services",
      icon: "Scissors",
      path: "/service-management",
      color: "bg-accent",
      description: "Edit services",
    },
    {
      id: "3",
      label: "Customer Database",
      icon: "Users",
      path: "/customer-database",
      color: "bg-success",
      description: "View customers",
    },
    {
      id: "4",
      label: "Staff Management",
      icon: "UserCog",
      path: "/staff-management",
      color: "bg-warning",
      description: "Manage team",
    },
  ];

  const staffUtilization: StaffUtilization[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      avatarAlt: "Blonde woman in professional salon uniform with friendly smile",
      appointmentsToday: 8,
      revenue: 680,
      utilizationRate: 92,
    },
    {
      id: "2",
      name: "Emily Davis",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      avatarAlt: "Brunette stylist in black salon apron with professional appearance",
      appointmentsToday: 7,
      revenue: 595,
      utilizationRate: 85,
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      avatarAlt: "Male stylist in professional salon attire",
      appointmentsToday: 6,
      revenue: 510,
      utilizationRate: 78,
    },
    {
      id: "4",
      name: "Jessica Wilson",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
      avatarAlt: "Esthetician in white uniform with warm smile",
      appointmentsToday: 5,
      revenue: 425,
      utilizationRate: 71,
    },
  ];

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Upcoming Appointment",
      message: "Emma Wilson's appointment starts in 15 minutes",
      timestamp: new Date(Date.now() - 60000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "New Customer",
      message: "Robert Garcia registered as a new customer",
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Payment Received",
      message: "Payment of INR 95 received from David Martinez",
      timestamp: new Date(Date.now() - 600000),
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "Appointment Cancelled",
      message: "Jessica Taylor cancelled her 11:00 AM appointment",
      timestamp: new Date(Date.now() - 900000),
      read: true,
    },
  ]);

  const handleLogout = () => {
    router.push('/salon-registration');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleViewDetails = (id: string) => {
    router.push('/booking-management');
    console.log('View appointment details:', id);
  };

  const handleCreateBooking = (data: any) => {
    console.log('Create booking:', data);
    router.push('/booking-management');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        userRole={currentUser.role}
        onNavigate={handleNavigation}
      />

      <Header
        user={currentUser}
        notifications={notifications.filter((n) => !n.read).length}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
      />

      <main className="ml-0 lg:ml-sidebar pt-header pb-bottom-nav lg:pb-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your salon today
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <QuickActions actions={quickActions} />
            </div>
            <div className="lg:col-span-1">
              <QuickBookingWidget onCreateBooking={handleCreateBooking} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Today's Appointments
                  </h3>
                  <button
                    onClick={() => router.push('/booking-management')}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayAppointments.slice(0, 4).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <ActivityFeed activities={recentActivities} />
              <StaffUtilizationCard staff={staffUtilization} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
            />
          </div>
        </div>
      </main>

      <MobileBottomNav
        userRole={currentUser.role}
        onNavigate={handleNavigation}
      />
    </div>
  );
};

export default SalonDashboard;