import Icon from "@/app/components/AppIcon";

interface Renewal {
  id: string | number;
  salonName: string;
  phoneNumber: string;
  address: string;
  date: string;
}

interface RecentRenewalsWidgetProps {
  renewals: Renewal[];
}

const RecentRenewalsWidget = ({ renewals }: RecentRenewalsWidgetProps) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Recent onboarded salons
        </h3>
        {/* <button className="text-primary hover:text-primary/80 transition-smooth font-body text-sm font-medium">
          View All
        </button> */}
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
              No recent onboarding
            </p>
          </div>
        ) : (
          renewals.map((renewal) => (
            <div
              key={renewal.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">
                  <Icon name="BuildingStorefrontIcon" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-sm text-foreground truncate">
                    {renewal.salonName}
                  </p>
                  <p className="font-caption text-xs text-text-secondary">
                    Onboarded on: {renewal.date}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-body font-medium text-sm text-foreground">
                  {renewal.phoneNumber}
                </p>
                <p className="font-caption text-xs text-text-secondary truncate max-w-[150px]">
                  {renewal.address}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentRenewalsWidget;
