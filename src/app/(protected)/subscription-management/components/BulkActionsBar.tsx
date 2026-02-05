"use client";

import Icon from "@/app/components/AppIcon";
import { useState, useEffect } from "react";
// import Icon from '@/components/ui/AppIcon';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkRenewal: () => void;
  onBulkStatusUpdate: () => void;
  onExport: () => void;
}

const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkRenewal,
  onBulkStatusUpdate,
  onExport,
}: BulkActionsBarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-4 px-6 py-4 z-50 max-w-2xl w-full mx-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="CheckCircleIcon" size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedCount} subscription{selectedCount > 1 ? "s" : ""}{" "}
              selected
            </p>
            <button
              onClick={onClearSelection}
              className="text-xs text-text-secondary hover:text-foreground transition-smooth"
            >
              Clear selection
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBulkRenewal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-smooth"
          >
            <Icon name="ArrowPathIcon" size={16} />
            <span className="hidden sm:inline">Process Renewals</span>
          </button>
          <button
            onClick={onBulkStatusUpdate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
          >
            <Icon name="PencilSquareIcon" size={16} />
            <span className="hidden sm:inline">Update Status</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
