import { Service } from '../types';
import Icon from '../../../components/AppIcon';

interface ServiceStatsProps {
  services: Service[];
  categories: string[];
  totalServices: number; 
}

const ServiceStats = ({ services, categories, totalServices }: ServiceStatsProps) => {
  const activeServices = services.filter(s => s.isActive).length;
  const popularServices = services.filter(s => s.isPopular).length;

  const statCards = [
    {
      label: 'Total Services',
      value: totalServices,
      icon: 'Scissors',
      color: 'bg-primary',
      textColor: 'text-primary',
    },
    {
      label: 'Active Services',
      value: activeServices,
      icon: 'CheckCircle',
      color: 'bg-success',
      textColor: 'text-success',
    },
    {
      label: 'Popular Services',
      value: popularServices,
      icon: 'Star',
      color: 'bg-warning',
      textColor: 'text-warning',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: 'Grid3x3',
      color: 'bg-accent',
      textColor: 'text-accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} bg-opacity-10`}>
              <Icon name={stat.icon} size={24} className={stat.textColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceStats;
