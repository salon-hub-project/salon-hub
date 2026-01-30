"use client";

import { useEffect, useState, useMemo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { BookingFormProps, SelectedItem } from "../types";
import { Staff, BookingFormData } from "../types";
import { appointmentValidationSchema } from "@/app/components/validation/validation";
import { staffApi } from "@/app/services/staff.api";
import { comboApi } from "@/app/services/combo.api";
import GroupedSelect from "@/app/components/ui/GroupedSelect";
import { appointmentApi } from "@/app/services/appointment.api";
import { isToday } from "date-fns";

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

  useEffect(() => {
    const fetchStaff = async () => {
      if (values.date && values.startTime) {
        try {
          if (isNaN(values.date.getTime())) return;
          const formattedDate = values.date.toISOString().split("T")[0];

          // 1️⃣ Get base available staff
          const allStaffRes = await staffApi.getAllStaff({
            page: 1,
            limit: 100,
            dateOfAppointment: formattedDate,
            timeOfAppointment: values.startTime,
          });

          const services = (values.selectedItems || [])
            .filter((item: any) => item.type === "service")
            .map((item: any) => item.value);

          const comboOffers = (values.selectedItems || [])
            .filter((item: any) => item.type === "combo")
            .map((item: any) => item.value);

          // 2️⃣ Get staff NOT on break
          const breakFreeStaffRes = await staffApi.getAllStaffBreakTime({
            dateOfAppointment: formattedDate,
            timeOfAppointment: values.startTime,
            services,
            comboOffers,
          });

          const allStaff = Array.isArray(allStaffRes)
            ? allStaffRes
            : allStaffRes?.data || [];

          const breakFreeStaff = Array.isArray(breakFreeStaffRes)
            ? breakFreeStaffRes
            : breakFreeStaffRes?.data || [];

          // 3️⃣ Build a Set of staff IDs who are NOT on break
          const breakFreeIds = new Set(
            breakFreeStaff.map((s: any) => s._id || s.id),
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
  }, [
    values.date,
    values.startTime,
    values.selectedItems,
    initialStaff,
    setAvailableStaff,
  ]);

  return null;
};

const BookingForm = ({
  customers,
  services,
  comboOffers,
  staff,
  selectedDate,
  selectedTime,
  onCancel,
  onSuccess,
  bookingToEdit,
  changeStaffOnly,
  onDateChange,
  initialCustomerId,
  isLoading = false,
}: BookingFormProps) => {
  // Get salon timings from Redux
  const timings = useSelector((state: any) => state.profile.timings);
  const user = useSelector((state: any) => state.auth.user);
  const isStaffUser = user?.role?.[0] === "STAFF";
  const isOwnerUser = !isStaffUser;

  const disableAllExceptStaff = isOwnerUser && changeStaffOnly;
  const disableAllExceptDateTime = isStaffUser && !changeStaffOnly;

  // State for available staff, initialized with the passed staff list
  const [availableStaff, setAvailableStaff] = useState<Staff[]>(staff);

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  const router = useRouter();
  const serviceOptions = services
    .filter((s) => s.isActive)
    .map((s) => ({
      value: s.id,
      label: `${s.name} - INR${s.price} (${s.duration} min)`,
    }));

  const comboOptions = comboOffers
    // .filter((c) => c.status === "Active" && !c.isDeleted)
    .map((c: any) => ({
      value: c.id || c._id,
      label: `${c.name} - ${c.savedPercent.toFixed(0)}%OFF`,
    }));

  // Use availableStaff for options instead of props.staff
  const staffOptions = availableStaff
    .filter((m) => m.isAvailable)
    .map((m) => ({
      value: m.id,
      label: m.name,
    }));

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` },
    ];
  })
    .flat()
    .filter((slot) => {
      if (!timings?.openingTime || !timings?.closingTime) {
        // Fallback if timings not loaded yet: 09:00 - 20:00
        const [h] = slot.value.split(":").map(Number);
        return h >= 9 && h <= 20;
      }
      return (
        slot.value >= timings.openingTime && slot.value < timings.closingTime
      );
    });

  // const handleSubmit = async (values: any, { resetForm }: any) => {
  //   try {
  //     const services = values.selectedItems
  //       .filter((item: any) => item.type === "service")
  //       .map((item: any) => item.value);

  //     const comboOffers = values.selectedItems
  //       .filter((item: any) => item.type === "combo")
  //       .map((item: any) => item.value);

  //     const payload = {
  //       customerId: values.customerId,
  //       services,
  //       comboOffers,
  //       staffId: values.staffId,
  //       appointmentDate: values.date.toISOString().split("T")[0],
  //       appointmentTime: values.startTime,
  //       notes: values.notes || "",
  //     };
  //     await appointmentApi.createAppointment(payload);
  //     resetForm();
  //     onSuccess?.();
  //     router.push("/booking-management");
  //   } catch (error) {
  //     console.error("Create appointment failed", error);
  //   }
  // };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (!bookingToEdit) {
        // ✅ CREATE BOOKING (unchanged)
        const services = values.selectedItems
          ?.filter((item: any) => item.type === "service")
          .map((item: any) => item.value);

        const comboOffers = values.selectedItems
          ?.filter((item: any) => item.type === "combo")
          .map((item: any) => item.value);

        await appointmentApi.createAppointment({
          customerId: values.customerId,
          services,
          comboOffers,
          staffId: values.staffId,
          appointmentDate: values.date.toISOString().split("T")[0],
          appointmentTime: values.startTime,
          notes: values.notes || "",
        });

        resetForm();
        onSuccess?.();
        return;
      }

      // ✅ STAFF → RESCHEDULE
      if (isStaffUser) {
        await appointmentApi.rescheduleAppointment(bookingToEdit.id, {
          appointmentDate: values.date.toISOString().split("T")[0],
          appointmentTime: values.startTime,
        });
      }

      // ✅ OWNER → CHANGE STAFF
      if (isOwnerUser && changeStaffOnly) {
        await appointmentApi.changeStaff(bookingToEdit.id, {
          staffId: values.staffId,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Booking update failed", error);
    }
  };
  const today = new Date().toISOString().split("T")[0];

  // Pre-calculate preferred staff ID for initial values
  const getInitialStaffId = () => {
    if (bookingToEdit?.staffId) return bookingToEdit.staffId;

    if (initialCustomerId) {
      const selectedCustomer = customers.find(
        (c) => c.id === initialCustomerId,
      );
      if (selectedCustomer?.preferredStaff) {
        const prefStaff = selectedCustomer.preferredStaff;
        return typeof prefStaff === "string"
          ? prefStaff
          : (prefStaff as any)._id || (prefStaff as any).id || "";
      }
    }

    return "";
  };

  const initialValues = useMemo(
    () => ({
      customerId: bookingToEdit?.customerId || initialCustomerId || "",
      selectedItems: bookingToEdit
        ? [
            ...(bookingToEdit.serviceId
              ? [
                  {
                    value: bookingToEdit.serviceId,
                    label: bookingToEdit.serviceName,
                    type: "service",
                  },
                ]
              : []),
            ...(Array.isArray(bookingToEdit.comboOffers)
              ? bookingToEdit.comboOffers.map((combo: any) => ({
                  value: combo.id || combo._id,
                  label: combo.name,
                  type: "combo",
                }))
              : []),
          ]
        : [],
      staffId: getInitialStaffId(),
      date: bookingToEdit?.date || selectedDate || new Date(),
      startTime: bookingToEdit?.startTime || selectedTime || "",
      notes: bookingToEdit?.notes || "",
    }),
    [bookingToEdit, initialCustomerId, selectedDate, selectedTime, customers],
  );

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
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={appointmentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => {
            const selectedDayIndex = values.date.getDay();
            const isWorkingDay =
              timings?.workingDays?.includes(selectedDayIndex) ?? true;
            const dateError = !isWorkingDay
              ? "The salon is closed on this day. Please select another date."
              : undefined;

            const isWithinHours =
              !values.startTime ||
              !timings?.openingTime ||
              !timings?.closingTime ||
              (values.startTime >= timings.openingTime &&
                values.startTime < timings.closingTime);
            const timeError = !isWithinHours
              ? "The salon is closed at this time. Please select another time."
              : undefined;

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
                  onChange={(v) => {
                    setFieldValue("customerId", v);
                    // Pre-select preferred staff if available
                    const selectedCustomer = customers.find((c) => c.id === v);
                    if (selectedCustomer?.preferredStaff) {
                      const prefStaff = selectedCustomer.preferredStaff;
                      const preferredStaffId =
                        typeof prefStaff === "string"
                          ? prefStaff
                          : (prefStaff as any)._id || (prefStaff as any).id;

                      if (preferredStaffId) {
                        setFieldValue("staffId", preferredStaffId);
                      }
                    }
                  }}
                  error={
                    touched.customerId
                      ? (errors.customerId as string)
                      : undefined
                  }
                  onAddNew={() => router.push("/customer-database")}
                  disabled={disableAllExceptDateTime || disableAllExceptStaff}
                />

                {/* Services */}
                {/* <Select
                  label="Services"
                  placeholder="Select services..."
                  options={serviceOptions}
                  value={values.services}
                  multiple
                  closeOnSelect={false}
                  clearable
                  searchable
                  // closeOnSelect
                  onChange={(v) => setFieldValue("services", v)}
                  error={
                    touched.services && typeof errors.services === "string"
                      ? errors.services
                      : undefined
                  }
                  onAddNew={() => router.push("/service-management")}
                /> */}

                {/* Date */}
                <div className="space-y-1">
                  <Input
                    type="date"
                    label="Date"
                    value={
                      values.date && !isNaN(values.date.getTime())
                        ? values.date.toISOString().split("T")[0]
                        : ""
                    }
                    min={today}
                    onChange={(e) =>{
                      const newDate= new Date(e.target.value);
                     if (!isNaN(newDate.getTime())) {
                        setFieldValue("date", newDate);
                      }
                      onDateChange?.(newDate);
                    }
                    }
                    error={dateError}
                    disabled={disableAllExceptStaff}
                  />
                  {dateError && (
                    <p className="text-xs text-destructive font-medium px-1">
                      {/* Already shown by Input component if it handles error prop, 
                          but let's be sure since the user said it shows 'we are closed today' */}
                    </p>
                  )}
                </div>

                {/* Time */}
                <Select
                  label="Time"
                  placeholder="Select time..."
                  options={timeSlots}
                  value={values.startTime}
                  searchable
                  onChange={(v) => setFieldValue("startTime", v)}
                  error={
                    touched.startTime
                      ? (errors.startTime as string)
                      : (timeError as string)
                  }
                  disabled={disableAllExceptStaff}
                />


                {/* SERVICE */}
                <GroupedSelect
                  label="Service / Combo"
                  placeholder="Select service or combo"
                  multiple
                  value={values.selectedItems}
                  onChange={(val) => setFieldValue("selectedItems", val)}
                  disabled={disableAllExceptDateTime || disableAllExceptStaff}
                  groups={[
                    {
                      label: "Services",
                      options: serviceOptions.map((s) => ({
                        value: s.value,
                        label: s.label,
                        type: "service",
                      })),
                    },
                    {
                      label: "Trending Combos",
                      options: comboOptions.map((c) => ({
                        value: c.value,
                        label: c.label,
                        type: "combo",
                      })),
                    },
                  ]}
                />

                {/* Staff */}
                <Select
                  label="Staff Member"
                  placeholder="Select staff..."
                  options={staffOptions}
                  value={values.staffId}
                  searchable
                  onChange={(v) => setFieldValue("staffId", v)}
                  error={
                    touched.staffId ? (errors.staffId as string) : undefined
                  }
                  onAddNew={() => router.push("/staff-management")}
                  disabled={isStaffUser}
                />

                {/* Notes */}
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes(Optional)
                </label>
                <textarea
                  // type="text"
                  // label="Notes (Optional)"
                  placeholder="Add any special requirements..."
                  value={values.notes}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                  disabled={disableAllExceptDateTime || disableAllExceptStaff}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
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
                  <Button type="submit" fullWidth>
                    {bookingToEdit
                      ? isStaffUser
                        ? "Reschedule Appointment"
                        : "Update Staff"
                      : "Create Booking"}
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
