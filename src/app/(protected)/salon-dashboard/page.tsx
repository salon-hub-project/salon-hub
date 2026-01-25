"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MetricCard from "./components/MetricCard";
import AppointmentCard from "./components/AppointmentCard";
import QuickBookingWidget from "./components/QuickBookingWidget";
import ActivityFeed from "./components/ActivityFeed";
import QuickActions from "./components/QuickActions";
import StaffUtilizationCard from "./components/StaffUtilizationCard";
import NotificationPanel from "./components/NotificationPanel";
import {
  TodayAppointment,
  QuickAction,
  StaffUtilization,
  Notification,
} from "./types";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import AuthGuard from "../../components/AuthGuard";
import { normalizeRole } from "@/app/utils/normalizeRole";
import { appointmentApi } from "@/app/services/appointment.api";
import { customerApi } from "@/app/services/customer.api";
import { staffApi } from "@/app/services/staff.api";
import { notificationApi } from "@/app/services/notification.api";
import { Icon } from "lucide-react";
import SalesReportPanel from "./components/SalesReportPanel";

const SalonDashboard = () => {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const { profile } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state: any) => state.auth);
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointmentNotifications, setAppointmentNotifications] = useState<
    Notification[]
  >([]);
  const [customerNotifications, setCustomerNotifications] = useState<
    Notification[]
  >([]);
  const [showAppointmentNotifications, setShowAppointmentNotifications] =
    useState(false);
  const [showCustomerNotifications, setShowCustomerNotifications] =
    useState(false);
  const [activeNotificationType, setActiveNotificationType] = useState<
    "appointment" | "customer" | null
  >(null);

  const normalizedUserRole = normalizeRole(user?.role);

  const [todayAppointments, setTodayAppointments] = useState<
    TodayAppointment[]
  >([]);
  const [activeCustomersCount, setActiveCustomersCount] = useState(0);
  const [staffUtilization, setStaffUtilization] = useState<StaffUtilization[]>(
    [],
  );

  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);

    return d.getTime() === today.getTime();
  };

  const currentUser = {
    name:
      authUser?.firstName || authUser?.lastName
        ? `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim()
        : profile?.ownerName || "Salon Owner",
    email: authUser?.email || "",
    role: authUser?.role || "salon_owner",
    avatar: profile?.salonImage || authUser?.avatar || "",
    salonName: profile?.salonName || "Salon Hub",
  };

  const getServiceDuration = (services: any[] = []) => {
    return services.reduce((total, s) => {
      const d = s?.duration;

      if (!d) return total;

      // number → minutes
      if (typeof d === "number") return total + d;

      // string → parse
      if (typeof d === "string") {
        const num = parseInt(d, 10);
        if (isNaN(num)) return total;

        return d.toLowerCase().includes("hour")
          ? total + num * 60
          : total + num;
      }

      return total;
    }, 0);
  };

  //fetch Today Appointments:-
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchTodayAppointments = async () => {
      try {
        const res = await appointmentApi.getAllAppointments({ limit: 500 });
        const todaysAppointments = res.filter(
          (appt: any) => appt.appointmentDate && isToday(appt.appointmentDate),
        );

        setTodayAppointments(
          todaysAppointments.map((appt: any) => ({
            id: appt._id,
            customerName: appt.customerId?.fullName || "N/A",
            service: "Service", // service details not populated
            time: appt.appointmentTime,
            duration: getServiceDuration(appt.services),
            staffName: appt.staffId?.fullName || "N/A",
            status: appt.status,
            amount: appt.amount || 0, // no price in appointment API
          })),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchTodayAppointments();
  }, [isAuthenticated]);

  //fetch active customers:-
  useEffect(() => {
    if (!isAuthenticated) return;
    // Skip customer API call for staff - they don't have access to customer data
    if (normalizedUserRole === "STAFF") return;

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
  }, [isAuthenticated, normalizedUserRole]);

  //staff utilization
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStaffUtilization = async () => {
      try {
        const staffRes = await staffApi.getAllStaff({ limit: 100 });
        const apptRes = await appointmentApi.getAllAppointments({ limit: 500 });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysAppointments = apptRes?.filter((appt: any) => {
          const d = new Date(appt.appointmentDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });

        const WORKING_MINUTES = 8 * 60;

        const staffPerformance = staffRes.data.map((staff: any) => {
          const staffAppts = todaysAppointments.filter(
            (a: any) => a.staffId?._id === staff._id,
          );

          const appointmentsToday = staffAppts.length;

          const bookedMinutes = staffAppts.length * 60; // temp logic
          const utilizationRate = Math.round(
            (bookedMinutes / WORKING_MINUTES) * 100,
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
  }, [isAuthenticated]);

  //fetch notifications:-
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAllNotifications = async () => {
      try {
        const res = await notificationApi.getAllNotifications();
        if (!res?.data) return;

        const { newAppointments = [], newCustomers = [] } = res.data;

        // Appointment Notifications
        const appointmentNotifications: Notification[] = newAppointments.map(
          (appt: any) => ({
            id: appt._id,
            type: "info",
            title: "New Appointment",
            message: `${
              appt.customerId?.fullName || "Customer"
            } booked an appointment at ${appt.appointmentTime}`,
            timestamp: new Date(appt.createdAt),
            read: false,
            path: `/booking-management?appointmentId=${appt._id}`,
          }),
        );

        // Customer Notifications (ignore deleted)
        const customerNotifications: Notification[] = newCustomers
          .filter((cust: any) => !cust.isDeleted)
          .map((cust: any) => ({
            id: cust._id,
            type: "success",
            title: "New Customer",
            message: `${cust.fullName} joined your salon`,
            timestamp: new Date(cust.createdAt),
            read: false,
            path: `/customer-database?customerId=${cust._id}`,
          }));

        setAppointmentNotifications(appointmentNotifications);
        setCustomerNotifications(customerNotifications);

        // Merge & sort (latest first)
        const allNotifications = [
          ...appointmentNotifications,
          ...customerNotifications,
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setNotifications(allNotifications);
      } catch (error) {
        console.error("Notification fetch failed", error);
      }
    };

    fetchAllNotifications();

    // Poll every 30 seconds
    const intervalId = setInterval(fetchAllNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

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
      color: "bg-primary",
      description: "Edit services",
    },
    {
      id: "3",
      label: "Customer Database",
      icon: "Users",
      path: "/customer-database",
      color: "bg-primary",
      description: "View customers",
    },
    {
      id: "4",
      label: "Staff Management",
      icon: "UserCog",
      path: "/staff-management",
      color: "bg-primary",
      description: "Manage team",
    },
  ];

  // const [notifications, setNotifications] = useState<Notification[]>([
  //   {
  //     id: "1",
  //     type: "warning",
  //     title: "Upcoming Appointment",
  //     message: "Emma Wilson's appointment starts in 15 minutes",
  //     timestamp: new Date(Date.now() - 60000),
  //     read: false,
  //   },
  //   {
  //     id: "2",
  //     type: "info",
  //     title: "New Customer",
  //     message: "Robert Garcia registered as a new customer",
  //     timestamp: new Date(Date.now() - 300000),
  //     read: false,
  //   }
  // ]);

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
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
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
        <main className="ml-0 lg:pb-8">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Welcome back, {currentUser.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your salon today
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <QuickActions actions={quickActions} />
              </div>
              <div className="lg:col-span-1">
                <QuickBookingWidget onCreateBooking={handleCreateBooking} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-10">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Sales Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Track revenue, commission & appointments
                  </p>
                </div>
                <SalesReportPanel />
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
                {/* <ActivityFeed activities={recentActivities} /> */}
                <StaffUtilizationCard staff={staffUtilization} />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Notifications
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Appointment Notifications */}
              <div
                onClick={() =>
                  setActiveNotificationType((prev) =>
                    prev === "appointment" ? null : "appointment",
                  )
                }
                className="cursor-pointer bg-card border border-border rounded-lg p-4 hover:bg-muted transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Appointments
                  </h3>
                  {appointmentNotifications.length > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {appointmentNotifications.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to view today's appointment alerts
                </p>

                {activeNotificationType === "appointment" && (
                  <div className="mt-4">
                    <NotificationPanel
                      notifications={appointmentNotifications}
                    />
                  </div>
                )}
              </div>

              {/* Customer Notifications */}
              <div
                onClick={() =>
                  setActiveNotificationType((prev) =>
                    prev === "customer" ? null : "customer",
                  )
                }
                className="cursor-pointer bg-card border border-border rounded-lg p-4 hover:bg-muted transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Customers</h3>
                  {customerNotifications.length > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {customerNotifications.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to view customer notifications
                </p>

                {activeNotificationType === "customer" && (
                  <div className="mt-4">
                    <NotificationPanel notifications={customerNotifications} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default SalonDashboard;
