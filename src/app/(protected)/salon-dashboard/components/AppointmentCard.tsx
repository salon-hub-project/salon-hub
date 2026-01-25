import { TodayAppointment } from "../types";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { formatTo12Hour } from "@/app/utils/formatHour";

interface AppointmentCardProps {
  appointment: TodayAppointment;
  onViewDetails: (id: string) => void;
}

const AppointmentCard = ({
  appointment,
  onViewDetails,
}: AppointmentCardProps) => {
  const getStatusColor = (status: TodayAppointment["status"]) => {
    const colors = {
      pending: "bg-warning/10 text-warning border-warning/20",
      confirmed: "bg-primary/10 text-primary border-primary/20",
      "in-progress": "bg-accent/10 text-accent border-accent/20",
      completed: "bg-success/10 text-success border-success/20",
      cancelled: "bg-error/10 text-error border-error/20",
    };
    return colors[status];
  };

  const getStatusLabel = (status: TodayAppointment["status"]) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      "in-progress": "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            {appointment.customerAvatar ? (
              <img
                src={appointment.customerAvatar}
                alt={appointment.customerAvatarAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                {appointment.customerName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {appointment.customerName}
            </h4>
            <p className="text-xs text-muted-foreground">
              {appointment.service}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(
            appointment.status
          )}`}
        >
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span className="text-xs">{formatTo12Hour(appointment.time)}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon name="Timer" size={14} />
          <span className="text-xs">{appointment.duration} min</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon name="IndianRupee" size={14} />
          <span className="text-xs">INR {appointment.amount}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            {appointment.customerAvatar ? (
              <img
                src={appointment.customerAvatar}
                alt={appointment.customerAvatarAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                {appointment.staffName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {appointment.staffName}
          </span>
        </div>
        <button
          onClick={() => onViewDetails(appointment.id)}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
