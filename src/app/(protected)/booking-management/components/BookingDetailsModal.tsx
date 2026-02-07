"use client";
import { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Booking } from "../types";
import { useAppSelector } from "@/app/store/hooks";
import { isStaff } from "@/app/utils/routePermissions";
import RescheduleAppointmentModal from "./RescheduleAppointment";

interface BookingDetailsModalProps {
  booking: Booking;
  onBookingUpdate?: (updated: Partial<Booking> & { id: string }) => void;
  onClose: () => void;
  onChangeStaff?: () => void;
  onStatusChange?: (bookingId: string, status: Booking["status"]) => void;
  onPaymentStatusChange?: (
    bookingId: string,
    status: "pending" | "paid",
  ) => void;
  onDelete?: (bookingId: string) => void;
  handleStatusUpdate?: () => void;
  changeStaffOnly?: boolean;
}

const BookingDetailsModal = ({
  booking,
  onClose,
  onBookingUpdate,
  onStatusChange,
  onPaymentStatusChange,
  onDelete,
  handleStatusUpdate,
  onChangeStaff,
  changeStaffOnly,
}: BookingDetailsModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useAppSelector((state: any) => state.auth.user);
  const isStaffUser = isStaff(user?.role);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const getStatusColor = (status: Booking["status"]) => {
    const colors = {
      Pending: "text-warning",
      Confirmed: "text-primary",
      Completed: "text-success",
    };
    return colors[status];
  };

  // 🔹 OPEN CONFIRM MODAL
  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  // 🔹 FINAL DELETE ACTION
  const confirmDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    await onDelete(booking.id);
    setIsDeleting(false);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <>
      {/* MAIN MODAL UI — unchanged */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Booking Details
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-shrink-0">
                {booking.customerAvatar ? (
                  <Image
                    src={booking.customerAvatar}
                    alt={`${booking.customerName} profile photo`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-medium text-primary">
                      {booking.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground pt-4">
                  {booking.customerName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {booking.customerPhone}
                </p>
              </div>
            </div>

            {/* EVERYTHING BELOW IS UNCHANGED UI */}

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Service</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {booking.serviceName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.serviceCategory}
                  </div>
                </div>
              </div>

              {booking.comboOffers && booking.comboOffers.length > 0 && (
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Combo Offer
                  </span>
                  <div className="text-right space-y-1">
                    {booking.comboOffers.map((combo) => (
                      <div
                        key={combo.id}
                        className="text-sm font-medium text-foreground"
                      >
                        {combo.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Date & Time
                </span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {booking.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.startTime} - {booking.endTime || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium text-foreground">
                  {booking.serviceDuration} minutes
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Staff Member
                </span>
                <div className="flex items-center gap-2">
                  {booking.staffAvatar ? (
                    <Image
                      src={booking.staffAvatar}
                      alt={`${booking.staffName} profile photo`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {booking.staffName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {booking.staffName}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-lg font-semibold text-foreground">
                  INR {booking?.amount || 0}
                </span>
              </div>

              {booking.notes && (
                <div className="py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground block mb-2">
                    Notes
                  </span>
                  <p className="text-sm text-foreground">{booking.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4"></div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
              {!isStaffUser && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onChangeStaff}
                  disabled={booking.status === "Completed"}
                >
                  Change Staff
                </Button>
              )}

              {booking.status === "Confirmed" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRescheduleModal(true)}
                >
                  Reschedule Appointment
                </Button>
              )}

              {user?.role[0] === "STAFF" &&
                (booking?.status === "Confirmed" ? (
                  <Button
                    variant="outline"
                    fullWidth
                    loading={isDeleting}
                    onClick={handleStatusUpdate}
                  >
                    Mark as Completed
                  </Button>
                ) : booking?.status === "Completed" ? (
                  <Button variant="outline" fullWidth disabled>
                    ✓ Completed
                  </Button>
                ) : null)}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Delete Booking?"
        description="This action cannot be undone. Do you really want to delete this booking?"
        confirmColor="red"
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
      />

      {showRescheduleModal && (
        <RescheduleAppointmentModal
          booking={{
            id: booking.id,
            date: booking.date,
            startTime: booking.startTime,
          }}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={(updated) => {
            onBookingUpdate?.({
              id: updated.id,
              date: updated.date,
              startTime: updated.startTime,
            });
            setShowRescheduleModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default BookingDetailsModal;
