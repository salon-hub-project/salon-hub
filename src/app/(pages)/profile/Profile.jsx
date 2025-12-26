'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import AuthGuard from '../../components/AuthGuard';
import { useAppSelector } from '../../store/hooks';

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.profile);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
console.log('User data:', user);
  // if (!user) {
  //   return (
  //     <div className="p-6 text-center">
  //       <p className="text-muted-foreground">
  //         User information not available
  //       </p>
  //     </div>
  //   );
  // }
  if (!user) {
    return (
      <AuthGuard>
        <div className="p-6 text-center text-muted-foreground">
          Loading profile...
        </div>
      </AuthGuard>
    );
  }
  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : 'Salon Owner';

  const currentUser = {
    name: fullName,
    email: user.email,
    role: user.role || 'salon_owner',
    avatar: profile?.salonImage || '',
    salonName: profile?.salonName || '—',
    salonOwner: profile?.ownerName || '—',
  };

  return (<>
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          userRole={currentUser.role}
          onNavigate={(path) => router.push(path)}
        />

        {/* Header */}
        <Header
          user={currentUser}
          notifications={0}
          onLogout={() => router.push('/salon-registration')}
          onProfileClick={() => router.push('/profile')}
          onNotificationClick={() => {}}
        />

        {/* Main Content */}
        <main className="ml-0 lg:ml-sidebar pt-header pb-bottom-nav lg:pb-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Profile
              </h1>
              <p className="text-muted-foreground">
                View and manage your account information
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileItem icon="Mail" label="Email" value={user.email} />
                <ProfileItem
                  icon="Phone"
                  label="Phone Number"
                  value={user.phoneNumber ?? '—'}
                />
                <ProfileItem
                  icon="MapPin"
                  label="Address"
                  value={user.address ?? '—'}
                />
                <ProfileItem
                  icon="Shield"
                  label="Role"
                  value={user.role ?? 'Salon Owner'}
                />
                 <ProfileItem icon="User" label="Owner Name" value={profile?.ownerName ?? '—'} />
                 <ProfileItem icon="Scissors" label="Salon Name" value={profile?.salonName ?? '—'} />
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Nav */}
        <MobileBottomNav
          userRole={currentUser.role}
          onNavigate={(path) => router.push(path)}
        />
         {/* Profile Actions */}
<div className="p-6 border-t flex flex-col sm:flex-row gap-3 justify-end">
  <button className="px-4 py-2 rounded-md border border-border text-sm hover:bg-secondary transition"
          onClick={() => router.push('/profile/create')}>
    Create Profile
  </button>

  <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 transition">
    Update Profile
  </button>

  <button className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition">
    Delete Profile
  </button>
</div>
      </div>
    </AuthGuard>
   

    </>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-muted-foreground">
      <Icon name={icon} size={18} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
    
  </div>
  
);

export default ProfilePage;

