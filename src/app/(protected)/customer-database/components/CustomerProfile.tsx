"use client";
import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Customer, CustomerTag, ServiceHistory } from '../types';
import Loader from '@/app/components/Loader';

interface CustomerProfileProps {
  customer: Customer | null;
  serviceHistory: ServiceHistory[];
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onBookAppointment: (customerId: string) => void;
  onDelete? : (customerId: string) => void;
  onSendMessage: (customerId: string) => void;
  loading?: boolean;
}

const CustomerProfile = ({
  customer,
  serviceHistory,
  onClose,
  onEdit,
  onBookAppointment,
  onSendMessage,
  loading
}: CustomerProfileProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  if (!customer && !loading) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Customer Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              iconSize={20}
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
          <div className="p-6">
            <Loader label="Loading customer details..." />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) return null;
  const getTagColor = (tag: CustomerTag): string => {
    const colors: Record<CustomerTag, string> = {
      VIP: 'bg-accent text-accent-foreground',
      New: 'bg-primary text-primary-foreground',
      Frequent: 'bg-success text-success-foreground',
      Inactive: 'bg-muted text-muted-foreground',
    };
    return colors[tag];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      paid: 'text-success',
      pending: 'text-warning',
      cancelled: 'text-error',
    };
    return colors[status] || 'text-muted-foreground';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Customer Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close profile"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {customer.avatar ? (
                  <Image
                    src={customer.avatar}
                    alt={`${customer.name} profile photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-3xl font-medium">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {customer.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-md text-xs font-medium ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Edit"
                    iconPosition="left"
                    onClick={() => onEdit(customer)}
                  >
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Total Visits</div>
                    <div className="text-2xl font-semibold text-foreground">
                      {customer.totalVisits}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
                    <div className="text-2xl font-semibold text-foreground">
                      INR {customer.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  {/* <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Last Visit</div>
                    <div className="text-sm font-medium text-foreground">
                      {customer.lastVisit
                        ? new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }).format(customer.lastVisit)
                        : 'Never'}
                    </div>
                  </div> */}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    iconName="Calendar"
                    iconPosition="left"
                    onClick={() => onBookAppointment(customer.id)}
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex gap-4 mb-6 border-b border-border">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium transition-smooth border-b-2 ${
                    activeTab === 'details' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Details
                </button>
                {/* <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium transition-smooth border-b-2 ${
                    activeTab === 'history' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Service History ({serviceHistory.length})
                </button> */}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <div className="text-sm text-foreground mt-1">{customer.phone}</div>
                    </div>
                    {customer.email && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="text-sm text-foreground mt-1">{customer.email}</div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <div className="text-sm text-foreground mt-1 capitalize">
                        {customer.gender}
                      </div>
                    </div>
                    {customer.dateOfBirth && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Date of Birth
                        </label>
                        <div className="text-sm text-foreground mt-1">{customer.dateOfBirth}</div>
                      </div>
                    )}
                    {customer.preferredStaff && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Preferred Staff
                        </label>
                        <div className="text-sm text-foreground mt-1">
                          {customer.preferredStaff}
                        </div>
                      </div>
                    )}
                  </div>

                  {customer.address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <div className="text-sm text-foreground mt-1">{customer.address}</div>
                    </div>
                  )}

                  {customer.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                      <div className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                        {customer.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  {serviceHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No service history available</p>
                    </div>
                  ) : (
                    serviceHistory.map((history) => (
                      <div
                        key={history.id}
                        className="bg-muted/30 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-foreground mb-1">
                              {formatDate(history.date)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Staff: {history.staffName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-foreground">
                              INR {history.totalAmount.toFixed(2)}
                            </div>
                            <div
                              className={`text-xs font-medium capitalize ${getPaymentStatusColor(
                                history.paymentStatus
                              )}`}
                            >
                              {history.paymentStatus}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {history.services.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div>
                                <span className="text-foreground font-medium">{service.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  ({service.duration} min)
                                </span>
                              </div>
                              <div className="text-foreground">INR {service.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        {history.notes && (
                          <div className="pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">{history.notes}</div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;