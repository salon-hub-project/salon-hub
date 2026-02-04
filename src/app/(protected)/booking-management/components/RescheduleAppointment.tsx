"use client";

import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import Icon from "@/app/components/AppIcon";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { appointmentApi } from "@/app/services/appointment.api";

interface Props {
  booking: {
    id: string;
    date: Date;
    startTime: string;
  };
  onClose: () => void;
  onSuccess?: (data: { id: string; date: Date; startTime: string }) => void;
}

const RescheduleAppointmentModal = ({ booking, onClose, onSuccess }: Props) => {
  const timings = useSelector((state: any) => state.profile.timings);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` },
    ];
  })
    .flat()
    .filter((slot) => {
      if (!timings?.openingTime || !timings?.closingTime) return true;
      return (
        slot.value >= timings.openingTime && slot.value < timings.closingTime
      );
    });

  const handleSubmit = async (values: any) => {
    try {
      await appointmentApi.rescheduleAppointment(booking.id, {
        appointmentDate: values.date,
        appointmentTime: values.startTime,
      });
      onSuccess?.({
        id: booking.id,
        date: new Date(values.date),
        startTime: values.startTime,
      });

      onClose();
    } catch (err) {
      console.error("Reschedule failed", err);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Reschedule Appointment
          </h2>
          <button onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik
          initialValues={{
            date: booking.date.toISOString().split("T")[0],
            startTime: booking.startTime,
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="p-6 space-y-6">
              {/* Date */}
              <Input
                type="date"
                label="Appointment Date"
                value={values.date}
                min={today}
                onChange={(e) => setFieldValue("date", e.target.value)}
              />

              {/* Time */}
              <Select
                label="Appointment Time"
                options={timeSlots}
                value={values.startTime}
                searchable
                onChange={(v) => setFieldValue("startTime", v)}
              />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth>
                  Reschedule
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
