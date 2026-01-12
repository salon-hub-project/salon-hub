import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
  onStatusChange: (bookingId: string, status: Booking['status']) => void;
}

const BookingCard = ({ booking, onClick, onStatusChange }: BookingCardProps) => {
  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      Confirmed: 'bg-primary/10 text-primary border-primary/20',
      Completed: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Booking['status']) => {
    const icons = {
      pending: 'Clock',
      Confirmed: 'CheckCircle',
      Completed: 'CheckCircle2',
      cancelled: 'XCircle',
    };
    return icons[status];
  };

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {booking.customerAvatar ? (
              <Image
                src={booking.customerAvatar}
                alt={`${booking.customerName} profile photo`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {booking.customerName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {booking.customerName}
            </h4>
            <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
            booking.status
          )}`}
        >
          <Icon name={getStatusIcon(booking.status)} size={12} />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Icon name="Scissors" size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground font-medium truncate">{booking.serviceName}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{booking.serviceDuration} min</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Icon name="Clock" size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground">
            {booking.startTime}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground truncate">{booking.staffName}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-foreground">
            INR {booking.servicePrice.toFixed(2)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              booking.paymentStatus === 'paid' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
            }`}
          >
            {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;