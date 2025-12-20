// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Icon from './AppIcon';

// interface SidebarProps {
//   isCollapsed?: boolean;
//   userRole?: 'super_admin' | 'salon_owner' | 'staff';
//   notificationCounts?: Record<string, number>;
//   onNavigate?: (path: string) => void;
// }

// interface MenuItem {
//   label: string;
//   path: string;
//   icon: string;
//   roles: string[];
//   badge?: number;
// }

// const Sidebar = ({ 
//   isCollapsed = false, 
//   userRole = 'salon_owner',
//   notificationCounts = {},
//   onNavigate 
// }: SidebarProps) => {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(isCollapsed);

//   const menuItems: MenuItem[] = [
//     {
//       label: 'Dashboard',
//       path: '/salon-dashboard',
//       icon: 'LayoutDashboard',
//       roles: ['super_admin', 'salon_owner', 'staff'],
//     },
//     {
//       label: 'Appointments',
//       path: '/booking-management',
//       icon: 'Calendar',
//       roles: ['super_admin', 'salon_owner', 'staff'],
//     },
//     {
//       label: 'Customers',
//       path: '/customer-database',
//       icon: 'Users',
//       roles: ['super_admin', 'salon_owner', 'staff'],
//     },
//     {
//       label: 'Services',
//       path: '/service-management',
//       icon: 'Scissors',
//       roles: ['super_admin', 'salon_owner'],
//     },
//     {
//       label: 'Staff',
//       path: '/staff-management',
//       icon: 'UserCog',
//       roles: ['super_admin', 'salon_owner'],
//     },
//     {
//       label: 'Registration',
//       path: '/salon-registration',
//       icon: 'ClipboardList',
//       roles: ['super_admin'],
//     },
//   ];

//   const filteredMenuItems = menuItems.filter(item => 
//     item.roles.includes(userRole)
//   );

//   const handleNavigation = (path: string) => {
//     if (onNavigate) {
//       onNavigate(path);
//     }
//   };

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <>
//       <aside
//         className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-layout z-sidebar ${
//           collapsed ? 'w-16' : 'w-sidebar'
//         } lg:fixed`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex items-center h-header px-4 border-b border-border">
//             <Link 
//               to="/salon-dashboard" 
//               className="flex items-center gap-3 transition-smooth hover:opacity-80"
//               onClick={() => handleNavigation('/salon-dashboard')}
//             >
//               <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
//                 <svg
//                   viewBox="0 0 40 40"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-6 h-6"
//                 >
//                   <path
//                     d="M20 8C15.5817 8 12 11.5817 12 16C12 18.2091 13.7909 22 20 28C26.2091 22 28 18.2091 28 16C28 11.5817 24.4183 8 20 8Z"
//                     fill="white"
//                   />
//                   <circle cx="20" cy="16" r="3" fill="#2D5A4A" />
//                   <path
//                     d="M8 24C8 22.8954 8.89543 22 10 22H30C31.1046 22 32 22.8954 32 24V30C32 31.1046 31.1046 32 30 32H10C8.89543 32 8 31.1046 8 30V24Z"
//                     fill="white"
//                   />
//                 </svg>
//               </div>
//               {!collapsed && (
//                 <span className="text-xl font-semibold text-foreground">
//                   SalonHub
//                 </span>
//               )}
//             </Link>
//           </div>

//           <nav className="flex-1 overflow-y-auto py-4 px-2">
//             <ul className="space-y-1">
//               {filteredMenuItems.map((item) => {
//                 const active = isActive(item.path);
//                 const badgeCount = notificationCounts[item.path] || 0;

//                 return (
//                   <li key={item.path}>
//                     <Link
//                       to={item.path}
//                       onClick={() => handleNavigation(item.path)}
//                       className={`flex items-center gap-3 px-3 py-3 rounded-md transition-smooth min-h-touch group relative ${
//                         active
//                           ? 'bg-primary text-primary-foreground'
//                           : 'text-foreground hover:bg-muted'
//                       }`}
//                     >
//                       <Icon
//                         name={item.icon}
//                         size={20}
//                         className={`flex-shrink-0 ${
//                           active ? 'text-primary-foreground' : 'text-muted-foreground'
//                         }`}
//                       />
//                       {!collapsed && (
//                         <>
//                           <span className="text-nav flex-1">{item.label}</span>
//                           {badgeCount > 0 && (
//                             <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-accent text-accent-foreground">
//                               {badgeCount > 99 ? '99+' : badgeCount}
//                             </span>
//                           )}
//                         </>
//                       )}
//                       {collapsed && badgeCount > 0 && (
//                         <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
//                       )}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="p-4 border-t border-border">
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="flex items-center justify-center w-full h-10 rounded-md hover:bg-muted transition-smooth"
//               aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//             >
//               <Icon
//                 name={collapsed ? 'ChevronRight' : 'ChevronLeft'}
//                 size={20}
//                 className="text-muted-foreground"
//               />
//             </button>
//           </div>
//         </div>
//       </aside>

//       {!collapsed && (
//         <div
//           className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
//           onClick={() => setCollapsed(true)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;









"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./AppIcon";
import { useAppSelector } from "../store/hooks";

interface SidebarProps {
  isCollapsed?: boolean;
  userRole?: string;
  notificationCounts?: Record<string, number>;
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
      roles: ["super_admin", "salon_owner", "staff"],
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
      roles: ["super_admin", "salon_owner", "staff"],
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
      roles: ["super_admin", "salon_owner", "staff"],
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
