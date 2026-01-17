"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { useRouter ,usePathname} from "next/navigation";
import { useAppSelector } from "../store/hooks";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { notificationApi } from "../services/notification.api";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [notificationCount, setNotificationCount] = useState(0);

  const pathname = usePathname();

  //Show notification count
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await notificationApi.getAllNotifications();

    const total =
      res.data.newAppointments.length +
      (res.data.newCustomers?.length || 0);

    setNotificationCount(total);
  };

  // 🔹 UPDATE LAST VISITED PROTECTED ROUTE
  useEffect(() => {
    localStorage.setItem("lastProtectedRoute", pathname);
  }, [pathname]);
  
  const user = {
    name: authUser
      ? `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim()
      : "User",
    email: authUser?.email ?? "",
    role: Array.isArray(authUser?.role)
      ? authUser.role[0]
      : authUser?.role ?? "salon_owner",
    salonName: "Salon",
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role} />

        <Header
          user={user}
          notifications={notificationCount}
          onLogout={() => router.push("/salon-login")}
          onProfileClick={() => router.push("/profile")}
        />

        <main className="ml-16 lg:ml-sidebar pt-header lg:pb-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
