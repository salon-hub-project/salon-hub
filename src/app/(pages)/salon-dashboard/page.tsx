"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MobileBottomNav from "../../components/MobileBottomNav";
import MetricCard from "./components/MetricCard";
import AppointmentCard from "./components/AppointmentCard";
import QuickBookingWidget from "./components/QuickBookingWidget";
import ActivityFeed from "./components/ActivityFeed";
import QuickActions from "./components/QuickActions";
import StaffUtilizationCard from "./components/StaffUtilizationCard";
import NotificationPanel from "./components/NotificationPanel";
import {
  DashboardMetric,
  TodayAppointment,
  RecentActivity,
  QuickAction,
  StaffUtilization,
  Notification,
} from "./types";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import AuthGuard from "../../components/AuthGuard";

import { appointmentApi } from "@/app/services/appointment.api";
import { customerApi } from "@/app/services/customer.api";
import { staffApi } from "@/app/services/staff.api";

const SalonDashboard = () => {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [todayAppointments, setTodayAppointments] = useState<
    TodayAppointment[]
  >([]);
  const [activeCustomersCount, setActiveCustomersCount] = useState(0);
  const [staffUtilization, setStaffUtilization] = useState<StaffUtilization[]>(
    []
  );
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);

    return d.getTime() === today.getTime();
  };

  const DEFAULT_APPOINTMENT_MINUTES = 60;
  const WORKING_HOURS_PER_DAY = 8 * 60;

  const currentUser = {
    name: "Sarah Johnson",
    email: authUser?.email || "sarah@salonhub.com",
    role: authUser?.role || "salon_owner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    salonName: "Elegance Beauty Salon",
  };

  const dashboardMetrics: DashboardMetric[] = [
    {
      id: "1",
      label: "Today's Appointments",
      value: todayAppointments.length,
      icon: "Calendar",
      color: "bg-primary",
    },
    {
      id: "2",
      label: "Today's Revenue",
      value: `INR ${todayAppointments.reduce(
        (sum, a) => sum + (a.price || 0),
        0
      )}`,
      icon: "IndianRupee",
      color: "bg-success",
    },
    {
      id: "3",
      label: "Active Customers",
      value: activeCustomersCount,
      icon: "Users",
      color: "bg-accent",
    },
    {
      id: "4",
      label: "Staff Utilization",
      value: `${Math.round(
        staffUtilization.reduce((a, b) => a + b.utilizationRate, 0) /
          (staffUtilization.length || 1)
      )}%`,
      icon: "TrendingUp",
      color: "bg-warning",
    },
  ];

  //fetch Today Appointments:-
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const res = await appointmentApi.getAllAppointments({ limit: 500 });

        const todaysAppointments = res.data.filter(
          (appt: any) => appt.appointmentDate && isToday(appt.appointmentDate)
        );

        setTodayAppointments(
          todaysAppointments.map((appt: any) => ({
            id: appt._id,
            customerName: appt.customerId?.fullName || "N/A",
            service: "Service", // service details not populated
            time: appt.appointmentTime,
            duration: null,
            staffName: appt.staffId?.fullName || "N/A",
            status: appt.status,
            price: 0, // no price in appointment API
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchTodayAppointments();
  }, []);

  //fetch active customers:-
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerApi.getCustomers({
          page: 1,
          limit: 1000,
        });

        setActiveCustomersCount(res.data?.length || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCustomers();
  }, []);

  //staff utilization
  useEffect(() => {
    const fetchStaffUtilization = async () => {
      try {
        const staffRes = await staffApi.getAllStaff({ limit: 100 });
        const apptRes = await appointmentApi.getAllAppointments({ limit: 500 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysAppointments = apptRes.data.filter((appt: any) => {
          const d = new Date(appt.appointmentDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });

        const WORKING_MINUTES = 8 * 60;

        const staffPerformance = staffRes.data.map((staff: any) => {
          const staffAppts = todaysAppointments.filter(
            (a: any) => a.staffId?._id === staff._id
          );

          const appointmentsToday = staffAppts.length;

          const bookedMinutes = staffAppts.length * 60; // temp logic
          const utilizationRate = Math.round(
            (bookedMinutes / WORKING_MINUTES) * 100
          );

          return {
            id: staff._id,
            name: staff.fullName,
            avatar: staff.staffImage,
            avatarAlt: staff.fullName,
            appointmentsToday,
            revenue: 0,
            utilizationRate: Math.min(utilizationRate, 100),
          };
        });

        setStaffUtilization(staffPerformance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStaffUtilization();
  }, []);

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

  // const staffUtilization: StaffUtilization[] = [
  //   {
  //     id: "1",
  //     name: "Sarah Johnson",
  //     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  //     avatarAlt: "Blonde woman in professional salon uniform with friendly smile",
  //     appointmentsToday: 8,
  //     revenue: 680,
  //     utilizationRate: 92,
  //   },
  //   {
  //     id: "2",
  //     name: "Emily Davis",
  //     avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  //     avatarAlt: "Brunette stylist in black salon apron with professional appearance",
  //     appointmentsToday: 7,
  //     revenue: 595,
  //     utilizationRate: 85,
  //   },
  //   {
  //     id: "3",
  //     name: "Michael Brown",
  //     avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  //     avatarAlt: "Male stylist in professional salon attire",
  //     appointmentsToday: 6,
  //     revenue: 510,
  //     utilizationRate: 78,
  //   },
  //   {
  //     id: "4",
  //     name: "Jessica Wilson",
  //     avatar: "https://randomuser.me/api/portraits/women/47.jpg",
  //     avatarAlt: "Esthetician in white uniform with warm smile",
  //     appointmentsToday: 5,
  //     revenue: 425,
  //     utilizationRate: 71,
  //   },
  // ];

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
    router.push("/salon-registration");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleViewDetails = (id: string) => {
    router.push("/booking-management");
    console.log("View appointment details:", id);
  };

  const handleCreateBooking = (data: any) => {
    console.log("Create booking:", data);
    router.push("/booking-management");
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
    <AuthGuard>
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
          // onProfileClick={handleProfileClick}
          onProfileClick={() => router.push("/profile")}
          onNotificationClick={handleNotificationClick}
        />

        <main className="ml-0 pb-bottom-nav lg:pb-8">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Welcome back, {currentUser.name.split(" ")[0]}!
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
                      onClick={() => router.push("/booking-management")}
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
    </AuthGuard>
  );
};

export default SalonDashboard;
