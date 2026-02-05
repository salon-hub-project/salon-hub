'use client';

import React from 'react';
import Icon from '@/app/components/AppIcon';
import RenewalStatusBadge from './RenewalStatusBadge';

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: string;
}

interface RenewalRecord {
  id: number;
  salonName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planType: string;
  amount: number;
  paymentMethod: string;
  renewalDate: string;
  status: 'overdue' | 'upcoming' | 'completed' | 'pending';
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  autoRenewal: boolean;
  renewalCount: number;
  lifetimePayment: number;
  paymentHistory: PaymentHistory[];
}

interface RenewalDetailsModalProps {
  renewal: RenewalRecord | null;
  onClose: () => void;
}

const RenewalDetailsModal: React.FC<RenewalDetailsModalProps> = ({ renewal, onClose }) => {
  if (!renewal) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-foreground">Renewal Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Salon Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Salon Name</p>
                    <p className="text-base font-medium text-foreground">{renewal.salonName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Owner Name</p>
                    <p className="text-base font-medium text-foreground">{renewal.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Email</p>
                    <p className="text-base text-foreground">{renewal.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Phone</p>
                    <p className="text-base text-foreground">{renewal.ownerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Plan Type</p>
                    <p className="text-base font-medium text-foreground capitalize">{renewal.planType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Renewal Status</p>
                    <RenewalStatusBadge status={renewal.status} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Subscription Period</p>
                    <p className="text-base text-foreground">
                      {renewal.subscriptionStartDate} - {renewal.subscriptionEndDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Auto Renewal</p>
                    <p className="text-base font-medium text-foreground">
                      {renewal.autoRenewal ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Renewal Amount</p>
              <p className="text-2xl font-semibold text-foreground">${renewal.amount.toLocaleString()}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Renewal Count</p>
              <p className="text-2xl font-semibold text-foreground">{renewal.renewalCount}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-text-secondary mb-1">Lifetime Payment</p>
              <p className="text-2xl font-semibold text-foreground">${renewal.lifetimePayment.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {renewal.paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-3 px-4 text-sm text-foreground">{payment.date}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">${payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-foreground capitalize">{payment.method.replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth font-medium flex items-center justify-center gap-2">
              <Icon name="CheckCircleIcon" size={20} />
              Confirm Payment
            </button>
            <button className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth font-medium flex items-center justify-center gap-2">
              <Icon name="BellIcon" size={20} />
              Send Reminder
            </button>
            <button className="flex-1 px-6 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth font-medium flex items-center justify-center gap-2">
              <Icon name="PencilIcon" size={20} />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalDetailsModal;