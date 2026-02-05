'use client';

import React from 'react';
import Icon from '@/app/components/AppIcon';

interface BulkActionsBarProps {
  selectedCount: number;
  onConfirmPayments: () => void;
  onSendReminders: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onConfirmPayments,
  onSendReminders,
  onExport,
  onClearSelection
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-4 px-6 py-4 z-40 max-w-4xl w-full mx-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">{selectedCount}</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {selectedCount} renewal{selectedCount > 1 ? 's' : ''} selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onConfirmPayments}
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-smooth text-sm font-medium flex items-center gap-2"
          >
            <Icon name="CheckCircleIcon" size={18} />
            Confirm Payments
          </button>
          <button
            onClick={onSendReminders}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth text-sm font-medium flex items-center gap-2"
          >
            <Icon name="BellIcon" size={18} />
            Send Reminders
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth text-sm font-medium flex items-center gap-2"
          >
            <Icon name="ArrowDownTrayIcon" size={18} />
            Export
          </button>
          <button
            onClick={onClearSelection}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
            title="Clear selection"
          >
            <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;