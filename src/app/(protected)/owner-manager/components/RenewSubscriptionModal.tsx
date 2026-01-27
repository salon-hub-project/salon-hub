"use client";
import React, { useState } from "react";
import Icon from "@/app/components/AppIcon";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/Loader";

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (months: number) => void;
  loading: boolean;
  ownerEmail: string;
}

const RenewSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  ownerEmail,
}: RenewSubscriptionModalProps) => {
  const [months, setMonths] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            Renew Subscription
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Owner</p>
            <p className="font-medium">{ownerEmail}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Renewal Duration (Months)
            </label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {[1, 2, 3, 6, 12, 24].map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? "Month" : "Months"}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg flex gap-3 items-start">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <p className="text-sm text-primary/80 leading-relaxed">
              Renewing the subscription will extend the owner's access by the selected number of months from their current expiry date.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(months)}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? <Loader size="sm" label="" inline /> : "Renew Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenewSubscriptionModal;
