import { useState } from "react";
import { StaffUtilization } from "../types";
import Icon from "../../../components/AppIcon";

interface StaffUtilizationCardProps {
  staff: StaffUtilization[];
  loading?: boolean;
}

const MAX_VISIBLE = 3;

const StaffUtilizationCard = ({
  staff,
  loading = false,
}: StaffUtilizationCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const visibleStaff = showAll ? staff : staff.slice(0, MAX_VISIBLE);
  const remainingCount = staff.length - MAX_VISIBLE;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Staff Performance
        </h3>

        {staff.length > MAX_VISIBLE && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-muted-foreground text-center py-6">
          Loading staff performance...
        </div>
      )}

      {/* EMPTY */}
      {!loading && staff.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-6">
          No staff activity today
        </div>
      )}

      {/* STAFF LIST */}
      <div className="space-y-4">
        {!loading &&
          visibleStaff.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-smooth"
            >
              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {member.name}
                </h4>

                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="Calendar" size={12} />
                    <span className="text-xs">
                      {member.appointmentsToday} appts
                    </span>
                  </div>

                  {/* <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="IndianRupee" size={12} />
                    <span className="text-xs">{member.revenue}</span>
                  </div> */}
                </div>
              </div>

              {/* UTILIZATION */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground">
                  {member.utilizationRate}%
                </span>

                <div className="w-16 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-smooth"
                    style={{
                      width: `${Math.min(member.utilizationRate, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* + MORE INDICATOR */}
      {!showAll && remainingCount > 0 && (
        <div className="text-xs text-muted-foreground text-center mt-3">
          +{remainingCount} more staff
        </div>
      )}
    </div>
  );
};

export default StaffUtilizationCard;
