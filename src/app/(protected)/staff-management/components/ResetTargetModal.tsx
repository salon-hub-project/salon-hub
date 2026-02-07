"use client";
import React, { useState } from "react";
import Button from "@/app/components/ui/Button";

interface ResetTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetType: "Weekly" | "Monthly") => void;
  isLoading: boolean;
}

const ResetTargetModal: React.FC<ResetTargetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [targetType, setTargetType] = useState<"Weekly" | "Monthly">("Weekly");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 z-[200]">
      <div className="bg-card rounded-lg p-6 w-96 border border-border shadow-xl">
        <h2 className="text-xl font-bold mb-2">Reset Achieved Target</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the target type to reset all staff members' achieved amounts to zero. This action cannot be undone.
        </p>

        <div className="space-y-4 mb-8">
          <div 
            onClick={() => setTargetType("Weekly")}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              targetType === "Weekly" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                targetType === "Weekly" ? "border-primary" : "border-muted-foreground"
              }`}>
                {targetType === "Weekly" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="font-medium">Weekly Target</span>
            </div>
          </div>

          <div 
            onClick={() => setTargetType("Monthly")}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              targetType === "Monthly" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                targetType === "Monthly" ? "border-primary" : "border-muted-foreground"
              }`}>
                {targetType === "Monthly" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="font-medium">Monthly Target</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(targetType)}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetTargetModal;
