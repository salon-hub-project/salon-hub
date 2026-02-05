"use client";

import { useEffect, useState } from "react";

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

interface SubscriptionDetailsModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionDetailsModal = ({
  subscription,
  isOpen,
  onClose,
}: SubscriptionDetailsModalProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isOpen && isHydrated) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isHydrated]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isHydrated) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose, isHydrated]);

  if (!isOpen || !subscription || !isHydrated) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-998"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-999 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-card rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Subscription Details
                </h2>
                <p className="font-caption text-sm text-text-secondary mt-1">
                  {subscription.salonName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close modal"
              >
                <Icon
                  name="XMarkIcon"
                  size={24}
                  className="text-text-secondary"
                />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h3 className="font-heading text-sm font-semibold text-text-secondary mb-3">
                    Subscription Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Plan Type
                      </p>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {subscription.planType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Status</p>
                      <StatusBadge status={subscription.paymentStatus} />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Start Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {subscription.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        End Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {subscription.endDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border">
                  <h3 className="font-heading text-sm font-semibold text-text-secondary mb-3">
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Last Payment
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        $
                        {subscription.lastPayment.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Lifetime Total
                      </p>
                      <p className="text-sm font-medium text-success">
                        $
                        {subscription.lifetimePayment.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Payment Method
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {subscription.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        Renewal Count
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {subscription.renewalCount} times
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border mb-6">
                <h3 className="font-heading text-sm font-semibold text-text-secondary mb-3">
                  Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">
                      Owner Name
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {subscription.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">
                      Auto Renewal
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          subscription.autoRenewal ? "bg-success" : "bg-error"
                        }`}
                      />
                      <p className="text-sm font-medium text-foreground">
                        {subscription.autoRenewal ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="font-heading text-sm font-semibold text-text-secondary mb-4">
                  Payment History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary">
                          Method
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscription.paymentHistory.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-3 px-4 text-sm text-foreground">
                            {payment.date}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            $
                            {payment.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {payment.method}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={payment.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-smooth"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-smooth shadow-elevation-1">
                Edit Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetailsModal;
