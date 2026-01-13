import { CalendarDay, Booking } from "../types";
import Icon from "../../../components/AppIcon";
import { formatTo12Hour } from "../utils/formatHour";

interface WeekViewProps {
  weekDays: CalendarDay[];
  bookingsByDay: Record<string, Booking[]>;
  onDayClick: (date: Date) => void;
  onBookingClick: (bookingId: string) => void;
  onStatusChange?: (
    bookingId: string,
    status: "Completed" | "Confirmed" | "cancelled"
  ) => void;
}

const WeekView = ({
  weekDays,
  bookingsByDay,
  onDayClick,
  onBookingClick,
}: WeekViewProps) => {
  const getBookingsForDay = (date: Date): Booking[] => {
    const dateKey = date.toISOString().split("T")[0];
    const allBookings = bookingsByDay[dateKey] || [];

    return allBookings.filter(
      (booking) =>
        booking.status !== "Completed" && booking.status !== "cancelled"
    );
  };

  const getStatusColor = (status: Booking["status"]) => {
    const colors = {
      pending: "bg-warning",
      Confirmed: "bg-card",
      Completed: "bg-success",
      cancelled: "bg-destructive",
    };
    return colors[status];
  };

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const bookings = getBookingsForDay(day.date); // filtered bookings
            const dayName = day.date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayNumber = day.date.getDate();

            return (
              <div
                key={day.date.toISOString()}
                onClick={() => onDayClick(day.date)}
                className={`border border-border rounded-lg overflow-hidden cursor-pointer transition-smooth hover:shadow-md ${
                  day.isToday ? "ring-2 ring-primary" : ""
                } ${day.isSelected ? "bg-primary/5" : "bg-card"}`}
              >
                <div
                  className={`p-3 text-center border-b border-border ${
                    day.isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-2xl font-bold mt-1">{dayNumber}</div>
                </div>

                <div className="p-2 space-y-2 min-h-[200px]">
                  {bookings.length > 0 ? (
                    bookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingClick(booking.id);
                        }}
                        className={`p-2 rounded border-l-4 ${getStatusColor(
                          booking.status
                        )} bg-card hover:bg-muted transition-smooth`}
                      >
                        <div className="text-xs font-medium text-foreground truncate">
                          {formatTo12Hour(booking.startTime)}
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {booking.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {booking.serviceName}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Icon
                        name="Calendar"
                        size={24}
                        className="mb-2 opacity-50"
                      />
                      <span className="text-xs">No bookings</span>
                    </div>
                  )}

                  {bookings.length > 3 && (
                    <div
                      className="text-xs text-center text-muted-foreground py-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDayClick(day.date);
                      }}
                    >
                      +{bookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
