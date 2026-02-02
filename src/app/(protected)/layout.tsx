"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import Header, { Notification } from "../components/Header";
import { notificationApi } from "../services/notification.api";
import AccountExpiryModal from "../components/AccountExpiryModal";
import { profileApi } from "../services/profile.api";
import PlansModal from "../components/PlansModal";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAccountExpired, setIsAccountExpired] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const pathname = usePathname();

  //Show notification count
  useEffect(() => {
    if (!authUser?.role) return;

    const userRole = Array.isArray(authUser.role)
      ? authUser.role[0]
      : authUser.role;

    if (userRole === "OWNER") {
      fetchNotifications();
    }
    if (userRole === "STAFF") {
      fetchStaffNotifications();
    }
  }, [authUser]);

  const fetchStaffNotifications = async () => {
    try {
      const res = await notificationApi.getAllStaffNotifications();
      if (!res?.data?.appointments) return;

      const staffNotifications: Notification[] = res.data.appointments.map(
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

      setNotifications(staffNotifications);
      setNotificationCount(staffNotifications.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAllNotifications();
      if (!res?.data) return;

      const { newAppointments = [], newCustomers = [] } = res.data;

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

      const allNotifications = [
        ...appointmentNotifications,
        ...customerNotifications,
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(allNotifications);
      setNotificationCount(allNotifications.length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("lastProtectedRoute", pathname);
  }, [pathname]);

  // Account Expiry Check
  useEffect(() => {
    if (!authUser || !authUser.role) return;

    const userRole = Array.isArray(authUser.role)
      ? authUser.role[0]
      : authUser.role;

    if (userRole === "OWNER" || userRole === "STAFF") {
      const checkSubscription = async () => {
        try {
          const res = await profileApi.getSubscriptionDetail();
          if (res?.success && res.data?.subscriptionEndDate) {
            const expiryDate = new Date(res.data.subscriptionEndDate);
            const currentDate = new Date();

            if (currentDate > expiryDate) {
              setIsAccountExpired(true);
            } else {
              setIsAccountExpired(false);
            }
          }
        } catch (error) {
          console.error("Failed to fetch subscription details", error);
        }
      };

      checkSubscription();
    }
  }, [authUser]);

  const user = {
    name: authUser
      ? `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim()
      : "User",
    email: authUser?.email ?? "",
    role: Array.isArray(authUser?.role)
      ? authUser.role[0]
      : (authUser?.role ?? "salon_owner"),
    salonName: "Salon",
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role} />

        <Header
          user={user}
          notifications={notificationCount}
          notificationList={notifications}
          onLogout={() => router.push("/salon-login")}
          onProfileClick={() => router.push("/profile")}
        />

        <main
          className={`ml-16 lg:ml-sidebar pt-header lg:pb-0 ${isAccountExpired ? "blur-sm pointer-events-none" : ""}`}
        >
          {children}
        </main>

        <AccountExpiryModal
          isOpen={isAccountExpired}
          onRenew={() => setIsPlansModalOpen(true)}
          role={user?.role}
        />

        <PlansModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
