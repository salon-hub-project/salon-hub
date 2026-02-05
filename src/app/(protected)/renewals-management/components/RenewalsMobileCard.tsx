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

interface RenewalsMobileCardProps {
  renewals: RenewalRecord[];
  onViewDetails: (renewal: RenewalRecord) => void;
  selectedRenewals: number[];
  onSelectRenewal: (id: number) => void;
}

const RenewalsMobileCard: React.FC<RenewalsMobileCardProps> = ({
  renewals,
  onViewDetails,
  selectedRenewals,
  onSelectRenewal
}) => {
  if (renewals.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="DocumentTextIcon" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Renewals Found</h3>
        <p className="text-text-secondary text-sm">
          No renewal records match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renewals.map((renewal) => (
        <div
          key={renewal.id}
          className="bg-card rounded-lg border border-border p-4 shadow-elevation-1"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                checked={selectedRenewals.includes(renewal.id)}
                onChange={() => onSelectRenewal(renewal.id)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring mt-1"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{renewal.salonName}</h3>
                <p className="text-sm text-text-secondary">{renewal.ownerName}</p>
              </div>
            </div>
            <RenewalStatusBadge status={renewal.status} />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Plan Type:</span>
              <span className="text-sm font-medium text-foreground capitalize">{renewal.planType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Amount:</span>
              <span className="text-sm font-semibold text-foreground">${renewal.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Payment Method:</span>
              <span className="text-sm text-foreground capitalize">{renewal.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Renewal Date:</span>
              <span className="text-sm text-foreground">{renewal.renewalDate}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(renewal)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth text-sm font-medium flex items-center justify-center gap-2"
            >
              <Icon name="EyeIcon" size={16} />
              View Details
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
              <Icon name="BellIcon" size={18} />
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
              <Icon name="PencilIcon" size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenewalsMobileCard;