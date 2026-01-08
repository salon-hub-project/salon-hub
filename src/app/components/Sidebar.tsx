 "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./AppIcon";
import { useAppSelector } from "../store/hooks";

interface SidebarProps {
  isCollapsed?: boolean;
  userRole?: string;
  notificationCounts?: Record<string, number>;
  onNavigate?: (path: string) => void; 
}

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
  badge?: number;
}

/* ============================
   ✅ ROLE NORMALIZER (FINAL)
=============================== */
const normalizeRole = (role: unknown): string => {
  // null / undefined
  if (!role) return "salon_owner";

  // ARRAY case → take first value
  if (Array.isArray(role)) {
    return normalizeRole(role[0]);
  }

  // OBJECT case
  if (typeof role === "object") {
    const extractedRole =
      (role as any).role ??
      (role as any).name ??
      (role as any).type ??
      (role as any).value;

    return normalizeRole(extractedRole);
  }

  // Non-string primitive
  if (typeof role !== "string") {
    return "salon_owner";
  }

  const normalizedRole = role.toLowerCase().trim();

  if (["superadmin", "super_admin", "admin"].includes(normalizedRole)) {
    return "super_admin";
  }

  if (["owner", "salon_owner"].includes(normalizedRole)) {
    return "salon_owner";
  }

  if (["staff", "employee"].includes(normalizedRole)) {
    return "staff";
  }

  return "salon_owner";
};

/* ============================
   ✅ SIDEBAR COMPONENT
=============================== */
const Sidebar = ({
  isCollapsed = false,
  userRole,
  notificationCounts = {},
}: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  // Auto-expand on desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redux user
  const authUser = useAppSelector((state) => state.auth.user);
  const roleFromStore = authUser?.role;

  const effectiveRole = userRole ?? roleFromStore ?? "salon_owner";
  const normalizedUserRole = normalizeRole(effectiveRole);

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/salon-dashboard",
      icon: "LayoutDashboard",
      roles: ["super_admin", "salon_owner"],
    },
    {
      label: "Appointments",
      path: "/booking-management",
      icon: "Calendar",
      roles: ["super_admin", "salon_owner", "staff"],
    },
    {
      label: "Customers",
      path: "/customer-database",
      icon: "Users",
      roles: ["super_admin", "salon_owner"],
    },
    {
      label: "Services",
      path: "/service-management",
      icon: "Scissors",
      roles: ["super_admin", "salon_owner"],
    },
    {
      label: "Staff",
      path: "/staff-management",
      icon: "UserCog",
      roles: ["super_admin", "salon_owner"],
    },
    {
      label: "Registration",
      path: "/salon-registration",
      icon: "ClipboardList",
      roles: ["super_admin"],
    },
    {
      label: "Combo-Offers",
      path: "/combo-offers-management",
      icon: "BadgePercent",
      roles: ["super_admin", "salon_owner"],
    },
    {
      label: "Owner-Manager",
      path: "/owner-manager",
      icon: "BadgePercent",
      roles: ["super_admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(normalizedUserRole)
  );

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link
              href="/salon-dashboard"
              className="flex items-center gap-3 hover:opacity-80"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
                <span className="text-white font-bold">S</span>
              </div>
              {!collapsed && (
                <span className="text-xl font-semibold">SalonHub</span>
              )}
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const active = isActive(item.path);
                const badgeCount = notificationCounts[item.path] || 0;

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition ${
                        active
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        className={active ? "text-white" : ""}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {badgeCount > 0 && (
                            <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Toggle */}
          <div className="p-4 border-t">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex justify-center h-10 rounded-md hover:bg-muted"
            >
              <Icon
                name={collapsed ? "ChevronRight" : "ChevronLeft"}
                size={20}
              />
            </button>
          </div>
        </div>
      </aside>

      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
