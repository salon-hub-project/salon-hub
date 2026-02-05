import Icon from "@/app/components/AppIcon";

interface ExpirationAlert {
  id: string | number;
  salonName: string;
  ownerName: string;
  expirationDate: string;
  daysRemaining: number;
  planType?: string;
}

interface ExpirationAlertsWidgetProps {
  alerts: ExpirationAlert[];
}

const ExpirationAlertsWidget = ({ alerts }: ExpirationAlertsWidgetProps) => {
  const getUrgencyColor = (days: number) => {
    if (days <= 7) return "bg-error/10 text-error border-error/20";
    if (days <= 14) return "bg-warning/10 text-warning border-warning/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  const getUrgencyIcon = (days: number) => {
    if (days <= 7) return "ExclamationTriangleIcon";
    if (days <= 14) return "BellAlertIcon";
    return "InformationCircleIcon";
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Expiration Alerts
          </h3>
          {alerts.length > 0 && (
            <span className="px-2 py-1 rounded-full bg-error text-error-foreground text-xs font-medium">
              {alerts.length}
            </span>
          )}
        </div>
        {/* <button className="text-primary hover:text-primary/80 transition-smooth font-body text-sm font-medium">
          View All
        </button> */}
      </div>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="CheckCircleIcon"
              size={48}
              className="text-success mx-auto mb-3"
            />
            <p className="font-body text-sm text-text-secondary">
              No upcoming expirations
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-smooth hover:shadow-elevation-1 ${getUrgencyColor(
                alert.daysRemaining,
              )}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={getUrgencyIcon(alert.daysRemaining) as any}
                  size={20}
                  className="flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-body font-medium text-sm truncate">
                      {alert.salonName}
                    </p>
                    <span className="font-data text-xs font-medium whitespace-nowrap">
                      {alert.daysRemaining} days
                    </span>
                  </div>
                  <p className="font-caption text-xs opacity-80 mb-2">
                    Owner: {alert.ownerName}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {/* <span className="font-caption text-xs opacity-70">
                      {alert.planType}
                    </span> */}
                    <span className="font-caption text-xs opacity-70">
                      Expires: {alert.expirationDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpirationAlertsWidget;
