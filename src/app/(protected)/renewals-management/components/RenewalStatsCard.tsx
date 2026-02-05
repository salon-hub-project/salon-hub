import React from 'react';
import Icon from '@/app/components/AppIcon';

interface RenewalStatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  bgColor: string;
}

const RenewalStatsCard: React.FC<RenewalStatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1 transition-smooth hover:shadow-elevation-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-2">{title}</p>
          <p className="text-3xl font-semibold text-foreground mb-3">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <Icon
                name={trend.isPositive ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                size={16}
                className={trend.isPositive ? 'text-success' : 'text-error'}
              />
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-error'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-sm text-text-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon name={icon as any} size={24} className="text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default RenewalStatsCard;