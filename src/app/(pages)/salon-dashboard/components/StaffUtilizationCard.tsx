import { StaffUtilization } from '../types';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

interface StaffUtilizationCardProps {
  staff: StaffUtilization[];
}

const StaffUtilizationCard = ({ staff }: StaffUtilizationCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Staff Performance</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={member.avatar}
                alt={member.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">
                {member.name}
              </h4>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="Calendar" size={12} />
                  <span className="text-xs">{member.appointmentsToday} appts</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="IndianRupee" size={12} />
                  <span className="text-xs">{member.revenue}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">
                {member.utilizationRate}%
              </span>
              <div className="w-16 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-smooth"
                  style={{ width: `${member.utilizationRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffUtilizationCard;