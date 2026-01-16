"use client";

import { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { BookingFormProps } from "../types";
import { Staff, BookingFormData } from "../types";
import { appointmentValidationSchema } from "@/app/components/validation/validation";
import { staffApi } from "@/app/services/staff.api";
// import { formatTo12Hour } from "@/app/utils/formatHour";

// Helper component to handle side effects and data fetching inside Formik context
const StaffFetcher = ({
  selectedDate,
  selectedTime,
  setAvailableStaff,
  initialStaff,
}: {
  selectedDate?: Date;
  selectedTime?: string;
  setAvailableStaff: (staff: Staff[]) => void;
  initialStaff: Staff[];
}) => {
  const { values, setFieldValue } = useFormikContext<BookingFormData>();

  // Sync external date
  useEffect(() => {
    if (selectedDate) setFieldValue("date", selectedDate);
  }, [selectedDate, setFieldValue]);

  // Sync external time
  useEffect(() => {
    if (selectedTime) setFieldValue("startTime", selectedTime);
  }, [selectedTime, setFieldValue]);

  // Fetch staff
  // useEffect(() => {
  //   const fetchStaff = async () => {
  //     if (values.date && values.startTime) {
  //       try {
  //         const formattedDate = values.date.toISOString().split("T")[0];
  //         const res = await staffApi.getAllStaff({
  //           page: 1,
  //           limit: 100,
  //           dateOfAppointment: formattedDate,
  //           timeOfAppointment: values.startTime,
  //         });

  //         const rawStaff = Array.isArray(res) ? res : res?.data || [];
  //         const mappedStaff = rawStaff
  //           .map((s: any) => ({
  //             id: s._id || s.id,
  //             name: s.fullName || s.name,
  //             role: s.role || "Staff",
  //             phone: s.phoneNumber || s.phone,
  //             avatar: s.avatar,
  //             specializations: s.specializations || [],
  //             isAvailable: s.isActive !== undefined ? s.isActive : true, // Default to true if missing
  //           }))
  //           .filter((s: any) => s.isAvailable);

  //         setAvailableStaff(mappedStaff);
  //       } catch (error) {
  //         console.error("Failed to fetch available staff", error);
  //       }
  //     } else {
  //       setAvailableStaff(initialStaff);
  //     }
  //   };

  //   fetchStaff();
  // }, [values.date, values.startTime, initialStaff, setAvailableStaff]);
useEffect(() => {
  const fetchStaff = async () => {
    if (values.date && values.startTime) {
      try {
        const formattedDate = values.date.toISOString().split("T")[0];

        // 1️⃣ Get base available staff
        const allStaffRes = await staffApi.getAllStaff({
          page: 1,
          limit: 100,
          dateOfAppointment: formattedDate,
          timeOfAppointment: values.startTime,
        });

        // 2️⃣ Get staff NOT on break
        const breakFreeStaffRes = await staffApi.getAllStaffBreakTime({
          dateOfAppointment: formattedDate,
          timeOfAppointment: values.startTime,
        });

        const allStaff = Array.isArray(allStaffRes)
          ? allStaffRes
          : allStaffRes?.data || [];

        const breakFreeStaff = Array.isArray(breakFreeStaffRes)
          ? breakFreeStaffRes
          : breakFreeStaffRes?.data || [];

        // 3️⃣ Build a Set of staff IDs who are NOT on break
        const breakFreeIds = new Set(
          breakFreeStaff.map((s: any) => s._id || s.id)
        );

        // 4️⃣ Keep only staff who exist in BOTH lists
        const filteredStaff = allStaff
          .filter((s: any) => breakFreeIds.has(s._id || s.id))
          .map((s: any) => ({
            id: s._id || s.id,
            name: s.fullName || s.name,
            role: s.role || "Staff",
            phone: s.phoneNumber || s.phone,
            avatar: s.avatar,
            specializations: s.specializations || [],
            isAvailable: s.isActive !== undefined ? s.isActive : true,
          }))
          .filter((s: any) => s.isAvailable);

        setAvailableStaff(filteredStaff);
      } catch (error) {
        console.error("Failed to fetch available staff", error);
      }
    } else {
      setAvailableStaff(initialStaff);
    }
  };

  fetchStaff();
}, [values.date, values.startTime, initialStaff, setAvailableStaff]);

  return null;
};

const BookingForm = ({
  customers,
  services,
  staff,
  selectedDate,
  selectedTime,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookingFormProps) => {
  // State for available staff, initialized with the passed staff list
  const [availableStaff, setAvailableStaff] = useState<Staff[]>(staff);
  
  const customerOptions = customers.map((c) => ({
    value: c.id ,
    label: `${c.name}`,
  }));

  const router = useRouter();
  const serviceOptions = services
    .filter((s) => s.isActive)
    .map((s) => ({
      value: s.id,
      label: `${s.name} - INR${s.price} (${s.duration} min)`,
    }));

  // Use availableStaff for options instead of props.staff
  const staffOptions = availableStaff
    .filter((m) => m.isAvailable)
    .map((m) => ({
      value: m.id,
      label: m.name,
    }));

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour24 = i + 9; 
    const hour = hour24.toString().padStart(2, "0");

    return [
      {
        value: `${hour}:00`, // 24-hour (API safe)
        label: `${hour}:00`, // 12-hour UI
      },
      {
        value: `${hour}:30`,
        label: `${hour}:30`,
      },
    ];
  }).flat();

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">New Booking</h2>
          <button onClick={onCancel}>
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik
          initialValues={{
            customerId: "",
            services: [] as string[],
            staffId: "",
            date: selectedDate || new Date(),
            startTime: selectedTime || "",
            notes: "",
          }}
          validationSchema={appointmentValidationSchema}
          onSubmit={(values) =>
            onSubmit({
              customerId: values.customerId,
              services: values.services, 
              staffId: values.staffId,
              date: values.date,
              startTime: values.startTime,
              notes: values.notes,
            })
          }
        >
          {({ values, errors, touched, setFieldValue }) => {
            return (
              <Form className="flex-1 overflow-y-auto p-6 space-y-6">
                <StaffFetcher
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setAvailableStaff={setAvailableStaff}
                  initialStaff={staff}
                />

                {/* Customer */}
                <Select
                  label="Customer"
                  placeholder="Search customer..."
                  options={customerOptions}
                  value={values.customerId}
                  searchable
                  onChange={(v) => setFieldValue("customerId", v)}
                  error={touched.customerId ? errors.customerId : undefined}
                />

                {/* Services */}
                <Select
                  label="Services"
                  placeholder="Select services..."
                  options={serviceOptions}
                  value={values.services}
                  multiple
                  clearable
                  searchable
                  closeOnSelect
                  onChange={(v) => setFieldValue("services", v)}
                  error={
                    touched.services && typeof errors.services === "string"
                      ? errors.services
                      : undefined
                  }
                />

                {/* Date */}
                <Input
                  type="date"
                  label="Date"
                  value={values.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFieldValue("date", new Date(e.target.value))
                  }
                />

                {/* Time */}
                <Select
                  label="Time"
                  placeholder="Select time..."
                  options={timeSlots}
                  value={values.startTime}
                  searchable
                  onChange={(v) => setFieldValue("startTime", v)}
                  error={touched.startTime ? errors.startTime : undefined}
                />

                {/* Staff */}
                <Select
                  label="Staff Member"
                  placeholder="Select staff..."
                  options={staffOptions}
                  value={values.staffId}
                  searchable
                  onChange={(v) => setFieldValue("staffId", v)}
                  error={touched.staffId ? errors.staffId : undefined}
                  onAddNew={() => router.push("/staff-management")}
                />

                {/* Notes */}
                <Input
                  type="text"
                  label="Notes (Optional)"
                  placeholder="Add any special requirements..."
                  value={values.notes}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                />

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    fullWidth
                    loading={isLoading}
                  >
                    Create Booking
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default BookingForm;
