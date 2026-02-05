'use client';

import React from 'react';
import Icon from '@/app/components/AppIcon';

interface RenewalFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  selectedPlanType: string;
  onPlanTypeChange: (plan: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RenewalFilters: React.FC<RenewalFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  selectedPlanType,
  onPlanTypeChange,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }
  ];

  const paymentMethods = [
    { value: 'all', label: 'All Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const planTypes = [
    { value: 'all', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Search by salon name or owner..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPaymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPlanType}
            onChange={(e) => onPlanTypeChange(e.target.value)}
            className="px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          >
            {planTypes.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              onStatusChange('all');
              onPaymentMethodChange('all');
              onPlanTypeChange('all');
              onSearchChange('');
              onDateRangeChange({ start: '', end: '' });
            }}
            className="px-4 py-2.5 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth flex items-center justify-center gap-2"
          >
            <Icon name="ArrowPathIcon" size={18} />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
        </div>
      </div>
    </div>
  );
};

export default RenewalFilters;