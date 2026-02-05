import Icon from "@/app/components/AppIcon";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const MetricCard = ({
  title,
  value,
  icon,
  trend,
  onClick,
}: MetricCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg p-6 border border-border shadow-elevation-1 transition-smooth ${
        onClick
          ? "cursor-pointer hover:shadow-elevation-2 hover:border-primary/30"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="font-caption text-sm text-text-secondary mb-1">
            {title}
          </p>
          <h3 className="font-heading text-3xl font-semibold text-foreground">
            {value}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name={icon as any} size={24} className="text-primary" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md ${
              trend.isPositive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            <Icon
              name={trend.isPositive ? "ArrowUpIcon" : "ArrowDownIcon"}
              size={16}
            />
            <span className="font-data text-sm font-medium">
              {Math.abs(trend.value)}%
            </span>
          </div>
          <span className="font-caption text-xs text-text-secondary">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
