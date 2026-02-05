"use client";

import Icon from "@/app/components/AppIcon";
import { useState, useEffect } from "react";

interface FilterState {
  planType: string;
  paymentStatus: string;
  dateRange: string;
  searchQuery: string;
}

interface SubscriptionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const SubscriptionFilters = ({
  onFilterChange,
  totalCount,
  filteredCount,
}: SubscriptionFiltersProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    planType: "all",
    paymentStatus: "all",
    dateRange: "all",
    searchQuery: "",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onFilterChange(filters);
    }
  }, [filters, isHydrated, onFilterChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      planType: "all",
      paymentStatus: "all",
      dateRange: "all",
      searchQuery: "",
    });
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-1">
            Filter Subscriptions
          </h2>
          <p className="font-caption text-sm text-text-secondary">
            Showing {filteredCount} of {totalCount} subscriptions
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-smooth"
        >
          <Icon name="ArrowPathIcon" size={16} />
          Reset Filters
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search by salon name or owner..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Plan Type
            </label>
            <select
              value={filters.planType}
              onChange={(e) => handleFilterChange("planType", e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            >
              <option value="all">All Plans</option>
              <option value="basic">Basic Plan</option>
              <option value="professional">Professional Plan</option>
              <option value="enterprise">Enterprise Plan</option>
              <option value="premium">Premium Plan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Payment Status
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) =>
                handleFilterChange("paymentStatus", e.target.value)
              }
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Expiration Period
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            >
              <option value="all">All Time</option>
              <option value="expiring-soon">Expiring in 30 Days</option>
              <option value="expired-recent">Expired (Last 30 Days)</option>
              <option value="active-year">Active (This Year)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFilters;
