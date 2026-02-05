import Icon from "@/app/components/AppIcon";

interface Renewal {
  id: number;
  salonName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface RecentRenewalsWidgetProps {
  renewals: Renewal[];
}

const RecentRenewalsWidget = ({ renewals }: RecentRenewalsWidgetProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-text-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "CheckCircleIcon";
      case "pending":
        return "ClockIcon";
      case "failed":
        return "XCircleIcon";
      default:
        return "QuestionMarkCircleIcon";
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Recent Renewals
        </h3>
        <button className="text-primary hover:text-primary/80 transition-smooth font-body text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {renewals.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="DocumentTextIcon"
              size={48}
              className="text-text-secondary mx-auto mb-3"
            />
            <p className="font-body text-sm text-text-secondary">
              No recent renewals
            </p>
          </div>
        ) : (
          renewals.map((renewal) => (
            <div
              key={renewal.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(
                    renewal.status,
                  )}`}
                >
                  <Icon name={getStatusIcon(renewal.status) as any} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-sm text-foreground truncate">
                    {renewal.salonName}
                  </p>
                  <p className="font-caption text-xs text-text-secondary">
                    {renewal.date}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-data font-medium text-sm text-foreground">
                  $
                  {renewal.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(
                    renewal.status,
                  )}`}
                >
                  {renewal.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentRenewalsWidget;
