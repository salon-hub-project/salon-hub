"use client";

import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import Icon from "@/app/components/AppIcon";

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

interface Subscription {
  id: string;
  salonName: string;
  ownerName: string;
  planType: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  renewalCount: number;
  lastPayment: number;
  lifetimePayment: number;
  paymentMethod: string;
  autoRenewal: boolean;
  paymentHistory: PaymentHistory[];
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  selectedIds: string[];
  onSelectSubscription: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (subscription: Subscription) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

const SubscriptionTable = ({
  subscriptions,
  selectedIds,
  onSelectSubscription,
  onSelectAll,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: SubscriptionTableProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon
            name="DocumentTextIcon"
            size={32}
            className="text-text-secondary"
          />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          No subscriptions found
        </h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          No subscriptions match your current filters. Try adjusting your search
          criteria or reset filters to see all subscriptions.
        </p>
      </div>
    );
  }

  const allSelected =
    subscriptions.length > 0 && selectedIds.length === subscriptions.length;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-elevation-1">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  aria-label="Select all subscriptions"
                />
              </th>
              <th className="text-left px-4 py-4">
                <button
                  onClick={() => handleSort("salonName")}
                  className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-foreground transition-smooth"
                >
                  Salon Name
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-4">
                <button
                  onClick={() => handleSort("ownerName")}
                  className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-foreground transition-smooth"
                >
                  Owner Name
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-4">
                <button
                  onClick={() => handleSort("planType")}
                  className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-foreground transition-smooth"
                >
                  Plan Type
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-4">
                <span className="text-xs font-medium text-text-secondary">
                  Start Date
                </span>
              </th>
              <th className="text-left px-4 py-4">
                <span className="text-xs font-medium text-text-secondary">
                  End Date
                </span>
              </th>
              <th className="text-left px-4 py-4">
                <button
                  onClick={() => handleSort("paymentStatus")}
                  className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-foreground transition-smooth"
                >
                  Status
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-4">
                <span className="text-xs font-medium text-text-secondary">
                  Renewals
                </span>
              </th>
              <th className="text-left px-4 py-4">
                <button
                  onClick={() => handleSort("lifetimePayment")}
                  className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-foreground transition-smooth"
                >
                  Lifetime Total
                  <Icon name="ChevronUpDownIcon" size={14} />
                </button>
              </th>
              <th className="w-12 px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr
                key={subscription.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-smooth"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(subscription.id)}
                    onChange={() => onSelectSubscription(subscription.id)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    aria-label={`Select ${subscription.salonName}`}
                  />
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {subscription.salonName}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground">
                    {subscription.ownerName}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground capitalize">
                    {subscription.planType}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground">
                    {subscription.startDate}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground">
                    {subscription.endDate}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={subscription.paymentStatus} />
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-foreground">
                    {subscription.renewalCount}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-success">
                    $
                    {subscription.lifetimePayment.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onViewDetails(subscription)}
                    className="p-2 rounded-md hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`View details for ${subscription.salonName}`}
                  >
                    <Icon
                      name="EyeIcon"
                      size={18}
                      className="text-text-secondary"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Previous page"
            >
              <Icon
                name="ChevronLeftIcon"
                size={18}
                className="text-text-secondary"
              />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Next page"
            >
              <Icon
                name="ChevronRightIcon"
                size={18}
                className="text-text-secondary"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
