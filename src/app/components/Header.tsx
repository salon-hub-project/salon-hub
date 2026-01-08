"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "./AppIcon";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { getProfile, clearProfile } from "../store/slices/profileSlice";
import { showToast } from "./ui/toast";
import ConfirmModal from "./ui/ConfirmModal";
import { normalizeRole } from "../utils/normalizeRole";

interface User {
  name: string;
  email: string;
  role: unknown;
  avatar?: string;
  salonName?: string;
}

interface HeaderProps {
  user: User;
  notifications?: number;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onSalonSwitch?: (salonId: string) => void;
  availableSalons?: Array<{ id: string; name: string }>;
}

const Header = ({
  user,
  notifications = 0,
  onLogout,
  onProfileClick,
  onNotificationClick,
  onSalonSwitch,
  availableSalons = [],
}: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSalonSwitcherOpen, setIsSalonSwitcherOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const profileRef = useRef<HTMLDivElement>(null);
  const salonSwitcherRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fetchInitiatedRef = useRef(false);

  const normalizedUserRole = normalizeRole(user.role);

  useEffect(() => {
    if (normalizedUserRole !== "OWNER") return;
    if (!profile && !isLoading && !fetchInitiatedRef.current) {
      fetchInitiatedRef.current = true;
      dispatch(getProfile());
    }
  }, [dispatch, normalizedUserRole]);

  useEffect(() => {
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleLabel = (role: unknown) => {
    const roleMap: Record<string, string> = {
      SUPERADMIN: "Super Admin",
      OWNER: "Owner",
      STAFF: "Staff",
    };
    return roleMap[normalizeRole(role)] ?? "Owner";
  };

  const handleLogout = () => {
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
    // setIsProfileOpen(false);
    // onProfileClick?.();
    router.push("/profile");
  };

  const handleSalonSwitch = (salonId: string) => {
    setIsSalonSwitcherOpen(false);
    onSalonSwitch?.(salonId);
  };
  
  return (
    <header className="fixed top-0 right-0 left-sidebar h-header bg-card border-b border-border z-[90]">
      <div className="flex items-center justify-between h-full pr-6">
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold capitalize">
            {profile?.salonName ?? "Salon"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Salon Switcher (Super Admin only) */}
          {normalizedUserRole === "SUPERADMIN" &&
            availableSalons.length > 0 && (
              <div className="relative" ref={salonSwitcherRef}>
                <button
                  onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                >
                  <Icon name="Building2" size={20} />
                  <span className="hidden sm:inline text-sm">
                    {user.salonName || "Select Salon"}
                  </span>
                  <Icon name="ChevronDown" size={16} />
                </button>

                {isSalonSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-popover border rounded-lg shadow-lg">
                    {availableSalons.map((salon) => (
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

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative w-10 h-10 rounded-md hover:bg-muted"
          >
            <Icon name="Bell" size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 text-xs bg-accent rounded-full px-1">
                {notifications > 99 ? "99+" : notifications}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold">
                {user.avatar || profile?.salonImage ? (
                  <img
                    src={user.avatar || profile?.salonImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
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
