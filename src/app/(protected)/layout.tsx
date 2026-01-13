"use client";

import { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter ,usePathname} from "next/navigation";
import { useAppSelector } from "../store/hooks";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);

  const pathname = usePathname();

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
          notifications={3}
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
