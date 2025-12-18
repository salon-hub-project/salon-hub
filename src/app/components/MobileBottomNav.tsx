// import { Link, useLocation } from 'react-router-dom';
// import Icon from './AppIcon';

// interface MobileBottomNavProps {
//   userRole?: 'super_admin' | 'salon_owner' | 'staff';
//   notificationCounts?: Record<string, number>;
//   onNavigate?: (path: string) => void;
// }

// interface NavItem {
//   label: string;
//   path: string;
//   icon: string;
//   roles: string[];
// }

// const MobileBottomNav = ({
//   userRole = 'salon_owner',
//   notificationCounts = {},
//   onNavigate,
// }: MobileBottomNavProps) => {
//   const location = useLocation();

//   const navItems: NavItem[] = [
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
//   ];

//   const filteredNavItems = navItems.filter(item => 
//     item.roles.includes(userRole)
//   ).slice(0, 5);

//   const handleNavigation = (path: string) => {
//     if (onNavigate) {
//       onNavigate(path);
//     }
//   };

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 h-bottom-nav bg-card border-t border-border z-mobile-nav lg:hidden safe-area-inset-bottom">
//       <ul className="flex items-center justify-around h-full px-2">
//         {filteredNavItems.map((item) => {
//           const active = isActive(item.path);
//           const badgeCount = notificationCounts[item.path] || 0;

//           return (
//             <li key={item.path} className="flex-1">
//               <Link
//                 to={item.path}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md transition-smooth min-h-touch relative ${
//                   active ? 'text-primary' : 'text-muted-foreground'
//                 }`}
//               >
//                 <div className="relative">
//                   <Icon
//                     name={item.icon}
//                     size={24}
//                     className={active ? 'text-primary' : 'text-muted-foreground'}
//                   />
//                   {badgeCount > 0 && (
//                     <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-medium rounded-full bg-accent text-accent-foreground">
//                       {badgeCount > 9 ? '9+' : badgeCount}
//                     </span>
//                   )}
//                 </div>
//                 <span
//                   className={`text-[10px] font-medium ${
//                     active ? 'text-primary' : 'text-muted-foreground'
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// export default MobileBottomNav;

"use client";

import { usePathname, useRouter } from "next/navigation";
import Icon from "./AppIcon";

interface MobileBottomNavProps {
  userRole?: string;
  notificationCounts?: Record<string, number>;
  onNavigate?: (path: string) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

// Normalize role to standard format (handles API returning OWNER, owner, salon_owner, etc.)
const normalizeRole = (role: string): string => {
  const normalizedRole = role.toLowerCase().trim();
  
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin' || normalizedRole === 'admin') {
    return 'super_admin';
  }
  if (normalizedRole === 'owner' || normalizedRole === 'salon_owner') {
    return 'salon_owner';
  }
  if (normalizedRole === 'staff' || normalizedRole === 'employee') {
    return 'staff';
  }
  
  return normalizedRole;
};

const MobileBottomNav = ({
  userRole = "salon_owner",
  notificationCounts = {},
  onNavigate,
}: MobileBottomNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Normalize the user role for consistent matching
  const normalizedUserRole = normalizeRole(userRole);

  const navItems: NavItem[] = [
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
  ];

  const filteredNavItems = navItems
    .filter((item) => item.roles.includes(normalizedUserRole))
    .slice(0, 5);

  const handleNavigation = (path: string) => {
    if (onNavigate) onNavigate(path);
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-bottom-nav bg-card border-t border-border z-mobile-nav lg:hidden safe-area-inset-bottom">
      <ul className="flex items-center justify-around h-full px-2">
        {filteredNavItems.map((item) => {
          const active = isActive(item.path);
          const badgeCount = notificationCounts[item.path] || 0;

          return (
            <li key={item.path} className="flex-1">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md transition-smooth min-h-touch relative ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <Icon
                    name={item.icon}
                    size={24}
                    className={
                      active ? "text-primary" : "text-muted-foreground"
                    }
                  />

                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-medium rounded-full bg-accent text-accent-foreground">
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
