"use client";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    startDate: string;
    endDate: string;
  }) => void;
  joinDate?: string;
}

const ResetAchievementModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
  joinDate
}: Props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;
  const formattedMinDate = joinDate
  ? new Date(joinDate).toISOString().split("T")[0]
  : undefined;


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold">
          Reset Commission Amount
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select date range to reset commission amount.
        </p>

        <div className="mt-4 space-y-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={formattedMinDate}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={formattedMinDate}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              onConfirm({ startDate, endDate })
            }
            disabled={!startDate || !endDate || loading}
          >
            {loading ? "Resetting..." : "Reset"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetAchievementModal;
