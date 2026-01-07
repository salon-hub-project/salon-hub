import { DashboardMetric } from '../types';
import Icon from '../../../components/AppIcon';

interface MetricCardProps {
  metric: DashboardMetric;
}

const MetricCard = ({ metric }: MetricCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-smooth hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
          <h3 className="text-3xl font-semibold text-foreground mb-2">
            {metric.value}
          </h3>
          {metric.change !== undefined && (
            <div className="flex items-center gap-1">
              <Icon
                name={metric.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'}
                size={16}
                className={
                  metric.changeType === 'increase' ?'text-success' :'text-error'
                }
              />
              <span
                className={`text-sm font-medium ${
                  metric.changeType === 'increase' ?'text-success' :'text-error'
                }`}
              >
                {Math.abs(metric.change)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs yesterday</span>
            </div>
          )}
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-lg ${metric.color}`}
        >
          <Icon name={metric.icon} size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;