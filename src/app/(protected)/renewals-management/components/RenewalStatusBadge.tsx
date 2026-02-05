import React from 'react';

interface RenewalStatusBadgeProps {
  status: 'overdue' | 'upcoming' | 'completed' | 'pending';
}

const RenewalStatusBadge: React.FC<RenewalStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    overdue: {
      label: 'Overdue',
      className: 'bg-error/10 text-error border-error/20'
    },
    upcoming: {
      label: 'Upcoming',
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    completed: {
      label: 'Completed',
      className: 'bg-success/10 text-success border-success/20'
    },
    pending: {
      label: 'Pending',
      className: 'bg-muted text-text-secondary border-border'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default RenewalStatusBadge;