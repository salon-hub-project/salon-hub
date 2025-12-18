'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from './AppIcon';

interface User {
  name: string;
  email: string;
  role: string;  // Made flexible to accept any role format from API
  avatar?: string;
  salonName?: string;
}

// Normalize role to standard format
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
  const profileRef = useRef<HTMLDivElement>(null);
  const salonSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (salonSwitcherRef.current && !salonSwitcherRef.current.contains(event.target as Node)) {
        setIsSalonSwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = (role: string) => {
    const normalizedRole = normalizeRole(role);
    const roleMap: Record<string, string> = {
      super_admin: 'Super Admin',
      salon_owner: 'Salon Owner',
      staff: 'Staff Member',
    };
    return roleMap[normalizedRole] || role;
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleSalonSwitch = (salonId: string) => {
    setIsSalonSwitcherOpen(false);
    if (onSalonSwitch) {
      onSalonSwitch(salonId);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-sidebar h-header bg-card border-b border-border z-[90] lg:left-sidebar">
      <div className="flex items-center justify-between h-full pr-6">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {normalizeRole(user.role) === 'super_admin' && availableSalons.length > 0 && (
            <div className="relative" ref={salonSwitcherRef}>
              <button
                onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-smooth min-h-touch"
                aria-label="Switch salon"
              >
                <Icon name="Building2" size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {user.salonName || 'Select Salon'}
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground transition-smooth ${
                    isSalonSwitcherOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSalonSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                  <div className="py-2">
                    {availableSalons.map((salon) => (
                      <button
                        key={salon.id}
                        onClick={() => handleSalonSwitch(salon.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                      >
                        <Icon name="Building2" size={16} className="text-muted-foreground" />
                        <span className="text-popover-foreground">{salon.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onNotificationClick}
            className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-smooth"
            aria-label="Notifications"
          >
            <Icon name="Bell" size={20} className="text-muted-foreground" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-smooth min-h-touch"
              aria-label="User menu"
            >
              {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-white text-sm font-medium">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div> */}
              <div
  className="flex items-center justify-center w-8 h-8 rounded-full 
             bg-secondary text-secondary-foreground text-sm font-semibold
             border border-border shadow-sm overflow-hidden"
>
  {user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    user.name.charAt(0).toUpperCase()
  )}
</div>

              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</div>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`text-muted-foreground transition-smooth hidden md:block ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{user.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">{getRoleLabel(user.role)}</div>
                  {user.salonName && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Icon name="Building2" size={12} />
                      {user.salonName}
                    </div>
                  )}
                </div>

                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                  >
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <span className="text-popover-foreground">Profile Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center gap-2"
                  >
                    <Icon name="LogOut" size={16} className="text-muted-foreground" />
                    <span className="text-popover-foreground">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;