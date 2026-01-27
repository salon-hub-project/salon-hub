import React from 'react';
import Icon from '../../../components/AppIcon';
import { ComboOffer, PerformanceMetrics } from '../types';

interface ComboStatsProps {
  combos: ComboOffer[];
  totalCombos: number,
  totalRevenues: number
}

const ComboStats: React.FC<ComboStatsProps> = ({ combos, totalCombos, totalRevenues }) => {

  const calculateMetrics = (): PerformanceMetrics => {
    const activeCombos = combos.filter(c => c.isActive);
    const totalRevenue = totalRevenues;
    const averageSavings = combos.length > 0
      ? combos.reduce((sum, c) => sum + c.savingsPercentage, 0) / combos.length
      : 0;
    
    const mostPopular = combos.length > 0
      ? combos.reduce((prev, current) => 
          (current.popularity > prev.popularity ? current : prev)
        )
      : null;

    return {
      totalCombos,
      activeCombos: activeCombos.length,
      totalRevenue,
      averageSavings,
      mostPopular,
    };
  };

  const metrics = calculateMetrics();

  const stats = [
    {
      label: 'Total Combos',
      value: metrics.totalCombos,
      icon: 'Package' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Combos',
      value: metrics.activeCombos,
      icon: 'CheckCircle' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Revenue',
      value: `INR ${metrics.totalRevenue.toFixed(2)}`,
      icon: 'IndianRupee' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    // {
    //   label: 'Avg. Savings',
    //   value: `${metrics.averageSavings.toFixed(1)}%`,
    //   icon: 'TrendingDown' as const,
    //   color: 'text-orange-600',
    //   bgColor: 'bg-orange-50',
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`${stat.bgColor} rounded-lg p-2`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ComboStats;