'use client';

import React from 'react';
import Icon from '@/app/components/AppIcon';
import RenewalStatusBadge from './RenewalStatusBadge';

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
  paymentHistory: any[];
}

interface RenewalsTableProps {
  renewals: RenewalRecord[];
  onViewDetails: (renewal: RenewalRecord) => void;
  selectedRenewals: number[];
  onSelectRenewal: (id: number) => void;
  onSelectAll: () => void;
}

const RenewalsTable: React.FC<RenewalsTableProps> = ({
  renewals,
  onViewDetails,
  selectedRenewals,
  onSelectRenewal,
  onSelectAll
}) => {
  if (renewals.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="DocumentTextIcon" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Renewals Found</h3>
        <p className="text-text-secondary">
          No renewal records match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="py-4 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRenewals.length === renewals.length && renewals.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                />
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Salon Name</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Owner</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Plan Type</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Amount</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Payment Method</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Renewal Date</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((renewal) => (
              <tr
                key={renewal.id}
                className="border-b border-border hover:bg-muted/50 transition-smooth"
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRenewals.includes(renewal.id)}
                    onChange={() => onSelectRenewal(renewal.id)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="py-4 px-4">
                  <p className="font-medium text-foreground">{renewal.salonName}</p>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-foreground">{renewal.ownerName}</p>
                    <p className="text-sm text-text-secondary">{renewal.ownerEmail}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                    {renewal.planType}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-foreground">${renewal.amount.toLocaleString()}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground capitalize">{renewal.paymentMethod.replace('_', ' ')}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground">{renewal.renewalDate}</p>
                </td>
                <td className="py-4 px-4">
                  <RenewalStatusBadge status={renewal.status} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(renewal)}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      title="View Details"
                    >
                      <Icon name="EyeIcon" size={18} className="text-text-secondary" />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      title="Send Reminder"
                    >
                      <Icon name="BellIcon" size={18} className="text-text-secondary" />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      title="Edit"
                    >
                      <Icon name="PencilIcon" size={18} className="text-text-secondary" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RenewalsTable;