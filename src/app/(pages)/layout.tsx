"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import AuthGuard from "../components/AuthGuard";
import { useAppSelector } from "../store/hooks";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authUser = useAppSelector((state) => state.auth.user);

  // const user = {
  //   name: authUser?.name || authUser?.fullName || "User",
  //   email: authUser?.email || "",
  //   role: authUser?.role || "salon_owner",
  //   salonName: "Salon",
  // };
  const user = {
    name:
      authUser?.firstName || authUser?.lastName
        ? `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim()
        : "User",
    email: authUser?.email ?? "",
    role: Array.isArray(authUser?.role)
      ? authUser?.role[0]
      : authUser?.role ?? "salon_owner",
    salonName: "Salon",
  };
  
  

  // Check if current route is an auth route (login/registration)
  const isAuthRoute = pathname === "/salon-login" || pathname === "/salon-registration";

  // Don't render protected layout for auth routes
  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user.role} />
        <Header
          user={user}
          notifications={3}
          onLogout={() => router.push("/salon-login")}
          onProfileClick={() => router.push("/profile")}
          onNotificationClick={() => console.log("Notifications clicked")}
        />
        <main className="lg:ml-sidebar pt-header pb-bottom-nav lg:pb-0">
          {children}
        </main>
        <MobileBottomNav userRole={user.role} />
      </div>
    </AuthGuard>
  );
}

