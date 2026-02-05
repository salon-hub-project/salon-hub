interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "expired":
        return "bg-error/10 text-error border-error/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "cancelled":
        return "bg-muted text-text-secondary border-border";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
