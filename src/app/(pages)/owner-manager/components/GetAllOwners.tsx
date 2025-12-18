'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchOwners } from '@/app/store/slices/ownerSlice';
import { useEffect } from 'react';

import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import MobileBottomNav from '@/app/components/MobileBottomNav';
import Icon from '@/app/components/AppIcon';

const GetAllOwners = () => {
  const dispatch = useAppDispatch();
  const { owners, isLoading, error } = useAppSelector(
    (state) => state.owner
  );

  useEffect(() => {
    dispatch(fetchOwners({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar userRole="super_admin" />

      {/* Header */}
      <Header
        user={{
          name: 'Super Admin',
          email: 'admin@salonhub.com',
          role: 'super_admin',
        }}
        notifications={0}
        onLogout={() => {}}
        onProfileClick={() => {}}
        onNotificationClick={() => {}}
      />

      {/* Main Content */}
      <main className="lg:ml-sidebar pt-header pb-bottom-nav lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Salon Owners
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered salon owners
            </p>
          </div>

          {/* States */}
          {isLoading && (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon
                name="Loader"
                size={40}
                className="mx-auto mb-4 animate-spin text-muted-foreground"
              />
              <p className="text-muted-foreground">Loading owners...</p>
            </div>
          )}

          {error && (
            <div className="bg-card border border-destructive rounded-lg p-6 text-center text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && owners.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Icon
                name="Users"
                size={64}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No owners found
              </h3>
              <p className="text-muted-foreground">
                There are no salon owners registered yet.
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && owners.length > 0 && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {owners.map((owner) => (
                      <tr
                        key={owner._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-foreground">
                          {owner.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {owner.phoneNumber || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {owner.address || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {owner.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <Icon name="CheckCircle" size={16} />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                              <Icon name="Clock" size={16} />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav userRole="super_admin" />
    </div>
  );
};

export default GetAllOwners;
