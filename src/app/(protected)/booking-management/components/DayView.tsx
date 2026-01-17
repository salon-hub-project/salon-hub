import { useAppSelector } from "@/app/store/hooks";
import { TimeSlot } from "../types";
import BookingCard from "./BookingCard";
import { formatTo12Hour } from "@/app/utils/formatHour";

interface DayViewProps {
  timeSlots: TimeSlot[];
  onBookingClick: (bookingId: string) => void;
  onTimeSlotClick: (time: string) => void;
  onStatusChange: (bookingId: string, status: any) => void;
}

const DayView = ({
  timeSlots,
  onBookingClick,
  onTimeSlotClick,
  onStatusChange,
}: DayViewProps) => {
  const isShopClosed =
    timeSlots.length === 0 || timeSlots.every((slot) => !slot.isAvailable);
  const user = useAppSelector((state: any)=> state.auth);

  const role= user?.role ;

  if (isShopClosed) {
    return (
      <div className="flex-1 flex items-center justify-center mt-28">
        <p className="text-lg font-semibold text-muted-foreground">
          We’re closed today. Please book your appointment for another day.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-2 p-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.time}
            className={`border border-border rounded-lg transition-smooth ${
              slot.isAvailable
                ? "bg-card hover:bg-muted cursor-pointer"
                : "bg-muted/50"
            }`}
          >
            <div
              onClick={() => slot.isAvailable && onTimeSlotClick(slot.time)}
              className="p-3 flex items-start gap-4"
            >
              <div className="w-20 flex-shrink-0">
                <span className="text-sm font-medium text-foreground">
                  {formatTo12Hour(slot.time)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {slot.bookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slot.bookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onClick={() => onBookingClick(booking.id)}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                    {role == "OWNER" ? "Available slot - Click to book" : "Available Slot"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
