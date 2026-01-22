"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Icon from "./AppIcon";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import {
  getProfile,
  clearProfile,
  fetchProfileTimings,
} from "../store/slices/profileSlice";
import { showToast } from "./ui/toast";
import ConfirmModal from "./ui/ConfirmModal";
import { normalizeRole } from "../utils/normalizeRole";
import { formatTo12Hour } from "../utils/formatHour";
import { welcomeNotification } from "../utils/welcomeNotification";

interface User {
  name: string;
  email: string;
  role: unknown;
  avatar?: string;
  salonName?: string;
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  path?: string;
}

interface HeaderProps {
  user: User;
  notifications?: number;
  notificationList?: Notification[];
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onSalonSwitch?: (salonId: string) => void;
  availableSalons?: Array<{ id: string; name: string }>;
}

const Header = ({
  user,
  notificationList = [],
  onSalonSwitch,
  availableSalons = [],
}: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSalonSwitcherOpen, setIsSalonSwitcherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { profile, timings, isLoading } = useAppSelector(
    (state) => state.profile,
  );
  const profileRef = useRef<HTMLDivElement>(null);
  const salonSwitcherRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  const normalizedUserRole = normalizeRole(user?.role);

  //-------Welcome logic-----------
  // const mergedNotifications = useMemo(() => {
  //   if (typeof window === "undefined") return notificationList;

  //   const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY) === "true";

  //   if (hasSeenWelcome) {
  //     return notificationList;
  //   }

  //   if (notificationList.length >= 6) {
  //     localStorage.setItem(WELCOME_SEEN_KEY, "true");
  //     localStorage.removeItem("welcome_timestamp");
  //     return notificationList;
  //   }

  //   return [...notificationList, welcomeNotification];
  // }, [notificationList]);

  const mergedNotifications = useMemo(() => {
    // Remove welcome if backend accidentally sends it
    const realNotifications = notificationList?.filter(
      (n) => n.id !== "welcome",
    );

    // If real notifications are 6 or more → hide welcome
    if (realNotifications.length >= 6) {
      return realNotifications;
    }

    // Otherwise → show welcome
    return [...realNotifications, welcomeNotification];
  }, [notificationList]);

  //------Effects----------
  useEffect(() => {
    if (normalizedUserRole !== "OWNER") return;
    if (!profile && !isLoading && isAuthenticated) {
      dispatch(getProfile());
    }
    if (!timings && !isLoading && isAuthenticated) {
      dispatch(fetchProfileTimings());
    }
  }, [normalizedUserRole, isAuthenticated, profile, timings]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        salonSwitcherRef.current &&
        !salonSwitcherRef.current.contains(event.target as Node)
      ) {
        setIsSalonSwitcherOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //   const getTimeAgo = (timestamp: Date) => {
  //     const diff =
  //       (new Date().getTime() - new Date(timestamp).getTime()) / 60000;
  //     if (diff < 1) return "Just now";
  //     if (diff < 60) return `${Math.floor(diff)}m ago`;
  //     if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  //     return `${Math.floor(diff / 1440)}d ago`;
  //   };

  //-------Helpers----------
  const getRoleLabel = (role: unknown) => {
    const roleMap: Record<string, string> = {
      SUPERADMIN: "Super Admin",
      OWNER: "Owner",
      STAFF: "Staff",
    };
    return roleMap[normalizeRole(role)] ?? "Owner";
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - new Date(timestamp).getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationItemClick = (notification: Notification) => {
    setIsNotificationsOpen(false);

    // Mark welcome as seen
    // if (notification.id === "welcome") {
    //   localStorage.setItem(WELCOME_SEEN_KEY, "true");
    //   localStorage.removeItem("welcome_timestamp");
    //   return;
    // }

    if (notification.path) {
      router.push(notification.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lastProtectedRoute");
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    dispatch(logout());
    dispatch(clearProfile());
    showToast({
      message: "Logged out successfully",
      status: "success",
    });
    router.push("/salon-login");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSalonSwitch = (salonId: string) => {
    setIsSalonSwitcherOpen(false);
    onSalonSwitch?.(salonId);
  };

  const realNotificationCount = notificationList.filter(
  (n) => n.id !== "welcome"
).length;

  // const handleNotificationItemClick = (notification: Notification) => {
  //   setIsNotificationsOpen(false);
  //   if (notification.path) {
  //     router.push(notification.path);
  //   }
  // };

  return (
    <header className="fixed top-0 right-0 left-16 lg:left-sidebar h-header bg-card border-b border-border z-[90]">
      <div className="flex items-center justify-between h-full pr-6">
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold capitalize">
            {profile?.salonName ?? "Salon"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Salon Switcher (Super Admin only) */}
          {normalizedUserRole === "SUPERADMIN" &&
            availableSalons?.length > 0 && (
              <div className="relative" ref={salonSwitcherRef}>
                <button
                  onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                >
                  <Icon name="Building2" size={20} />
                  <span className="hidden sm:inline text-sm">
                    {user?.salonName || "Select Salon"}
                  </span>
                  <Icon name="ChevronDown" size={16} />
                </button>

                {isSalonSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-popover border rounded-lg shadow-lg">
                    {availableSalons?.map((salon) => (
                      <button
                        key={salon.id}
                        onClick={() => handleSalonSwitch(salon.id)}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                      >
                        <Icon name="Building2" size={16} />
                        {salon.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Refresh Button (Mobile only) */}
          <button
            onClick={() => window.location.reload()}
            className="lg:hidden w-10 h-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Page"
          >
            <Icon name="RefreshCw" size={20} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative w-10 h-10 rounded-md hover:bg-muted flex items-center justify-center"
            >
              <Icon name="Bell" size={20} />
              {mergedNotifications.length > 0 && (
                // <span className="absolute top-1 right-1 text-xs bg-accent rounded-full px-1 min-w-[16px] h-[16px] flex items-center justify-center text-[10px] text-white">
                <span
                  className="
    absolute
    -top-0
    -right-1
    flex
    items-center
    justify-center
    min-w-[18px]
    h-[18px]
    px-1
    text-[10px]
    font-medium
    leading-none
    rounded-full
    bg-accent
    text-black
  "
                >
                  {realNotificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card border rounded-lg shadow-lg">
                <div className="p-4 border-b sticky top-0 bg-card z-10">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="p-2 space-y-2">
                  {mergedNotifications.length > 0 ? (
                    mergedNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() =>
                          handleNotificationItemClick(notification)
                        }
                        className={`p-3 rounded-md text-sm cursor-pointer ${
                          notification.id === "welcome"
                            ? "bg-primary/10"
                            : "bg-muted/30"
                        } hover:bg-muted/50 transition-colors`}
                      >
                        <div className="font-medium text-foreground mb-1">
                          {notification.title}
                        </div>
                        <div className="text-muted-foreground text-xs mb-1 line-clamp-2">
                          {notification.message}
                        </div>
                        <div className="text-[10px] text-muted-foreground/70">
                          {getTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold">
                {user?.avatar || profile?.salonImage ? (
                  <img
                    src={user?.avatar || profile?.salonImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div className="hidden md:block text-left">
                <div className="text-sm font-medium capitalize">
                  {user.role == "OWNER" && `${profile?.ownerName ?? user.name}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRoleLabel(user.role)}
                </div>
              </div>

              <Icon name="ChevronDown" size={16} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card border rounded-lg shadow-lg">
                <div className="p-4 border-b">
                  <div className="font-medium capitalize">
                    {user.role == "OWNER" &&
                      `${profile?.ownerName ?? user.name}`}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <div className="text-xs mt-1">{getRoleLabel(user.role)}</div>
                  {user.role === "OWNER" &&
                    profile?.openingTime &&
                    profile?.closingTime && (
                      <div className="text-xs text-muted-foreground">
                        ({formatTo12Hour(profile.openingTime)} -{" "}
                        {formatTo12Hour(profile.closingTime)})
                      </div>
                    )}
                </div>

                {user.role == "OWNER" && (
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 hover:bg-muted flex items-center gap-2"
                  >
                    <Icon name="User" size={16} /> Profile
                  </button>
                )}

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full px-4 py-2 hover:bg-muted flex items-center gap-2"
                >
                  <Icon name="LogOut" size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        description="Are you sure you want to logout?"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </header>
  );
};

export default Header;

// /* ---------------- COMPONENT ---------------- */

//   /* ---------------- WELCOME LOGIC ---------------- */

//   /* ---------------- HELPERS ---------------- */

//   /* ---------------- UI ---------------- */

//   return (
//     <header className="fixed top-0 right-0 left-16 h-header bg-card border-b z-50">
//       <div className="flex justify-end pr-6 h-full items-center">
//         {/* Notifications */}
//         <div className="relative" ref={notificationRef}>
//           <button
//             onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//             className="relative w-10 h-10 rounded-md hover:bg-muted flex items-center justify-center"
//           >
//             <Icon name="Bell" size={20} />
//             {mergedNotifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] rounded-full px-1">
//                 {mergedNotifications.length}
//               </span>
//             )}
//           </button>

//           {isNotificationsOpen && (
//             <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card border rounded-lg shadow-lg">
//               <div className="p-4 border-b font-semibold text-sm">
//                 Notifications
//               </div>

//               <div className="p-2 space-y-2">
//                 {mergedNotifications.length > 0 ? (
//                   mergedNotifications.map((n) => (
//                     <div
//                       key={n.id}
//                       onClick={() => handleNotificationItemClick(n)}
//                       className={`p-3 rounded-md cursor-pointer ${
//                         n.id === "welcome"
//                           ? "bg-primary/10"
//                           : "bg-muted/30"
//                       } hover:bg-muted`}
//                     >
//                       <div className="font-medium">{n.title}</div>
//                       <div className="text-xs text-muted-foreground">
//                         {n.message}
//                       </div>
//                       <div className="text-[10px] text-muted-foreground mt-1">
//                         {getTimeAgo(n.timestamp)}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-sm text-muted-foreground">
//                     No notifications
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Logout */}
//         <button
//           onClick={() => setShowLogoutModal(true)}
//           className="ml-4 text-sm"
//         >
//           Logout
//         </button>
//       </div>

//       <ConfirmModal
//         isOpen={showLogoutModal}
//         title="Logout"
//         description="Are you sure?"
//         onCancel={() => setShowLogoutModal(false)}
//         onConfirm={handleLogout}
//       />
//     </header>
//   );
// };

// export default Header;
