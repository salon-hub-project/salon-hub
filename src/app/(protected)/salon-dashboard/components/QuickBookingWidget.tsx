"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form } from "formik";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { appointmentApi } from "@/app/services/appointment.api";
import { serviceApi } from "@/app/services/service.api";
import { staffApi } from "@/app/services/staff.api";
import { customerApi } from "@/app/services/customer.api";
import { showToast } from "@/app/components/ui/toast";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { isStaff } from "@/app/utils/routePermissions";
import { comboApi } from "@/app/services/combo.api";
import GroupedSelect from "@/app/components/ui/GroupedSelect";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/app/utils/cn";
import { fetchProfileTimings } from "@/app/store/slices/profileSlice";

interface QuickBookingWidgetProps {
  onCreateBooking: (data: any) => void;
}

interface SelectedItem {
  value: string;
  label: string;
  type: "service" | "combo";
}

interface BookingFormValues {
  customer: string;
  selectedItems: SelectedItem[];
  date: string;
  time: string;
  staff: string;
}

const BookingValidationSchema = Yup.object({
  customer: Yup.string().required("Please select a customer"),

  selectedItems: Yup.array()
    .of(
      Yup.object({
        value: Yup.string().required(),
        type: Yup.mixed<"service" | "combo">().required(),
      }),
    )
    .min(1, "Please select at least one service or combo")
    .required(),

  staff: Yup.string().required("Please select a staff member"),

  date: Yup.string().required("Please select a date"),

  time: Yup.string().required("Please select a time"),
});

const timeTo24h = (time12h: string) => {
  if (!time12h) return "";
  // Check if it's already in 24h format (HH:mm)
  if (/^\d{2}:\d{2}$/.test(time12h)) return time12h;

  const match = time12h.match(/(\d+):00\s*(AM|PM)/i);
  if (!match) return time12h;
  let h = parseInt(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === "PM" && h < 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:00`;
};

const QuickBookingWidget = ({ onCreateBooking }: QuickBookingWidgetProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [serviceOptions, setServiceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [comboOptions, setComboOptions] = useState<
    { value: string; label: string; percent: number }[]
  >([]);
  const timings = useAppSelector((state: any) => state.profile.timings);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // =========`======== FETCH DATA =================

  const fetchCustomers = async () => {
    // Skip customer API call for staff - they don't have access to customer data
    if (isStaff(userRole)) return;

    try {
      const res = await customerApi.getCustomers({ limit: 1000 });
      const sortedData = [...res.data].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setCustomers(sortedData);
      setCustomerOptions(
        sortedData.map((c: any) => ({
          value: c._id,
          label: c.fullName,
        })),
      );
    } catch (error) {
      console.error("Customer fetch error", error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await serviceApi.getAllServices({ limit: 100 });
      setServiceOptions(
        res.data.map((s: any) => ({
          value: s._id,
          label: s.serviceName,
        })),
      );
    } catch (error) {
      console.error("Service fetch error", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await staffApi.getAllStaff({ limit: 100 });
      setStaffOptions(
        res.data.map((s: any) => ({
          value: s._id,
          label: s.fullName,
        })),
      );
    } catch (error) {
      console.error("Staff fetch error", error);
    }
  };

  const fetchCombo = useCallback(async (date?: Date) => {
    try {
      const finalDate = date ?? new Date();
      const formattedDate = finalDate.toISOString().split("T")[0];

      const comboRes = await comboApi.getAppointmentCombo({
        page: 1,
        limit: 100,
        appointmentDate: formattedDate,
      });

      const rawCombo = Array.isArray(comboRes)
        ? comboRes
        : comboRes?.data || [];

      setComboOptions(
        rawCombo.map((c: any) => ({
          value: c._id || c.id,
          label: c.name || c.comboName,
          percent: c.savedPercent ?? 0,
        })),
      );
    } catch (error) {
      console.error("Combo fetch error", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchServices();
    fetchStaff();
    fetchCombo();
    if (!timings) {
      dispatch(fetchProfileTimings());
    }
  }, []);

  // ================= SUBMIT =================

  const handleSubmit = async (
    values: any,
    { resetForm, setFieldError }: any,
  ) => {
    // Check if salon is closed on selected date
    const selectedDate = new Date(values.date);
    const selectedDayIndex = selectedDate.getDay();
    const isWorkingDay =
      timings?.workingDays?.includes(selectedDayIndex) ?? true;

    if (!isWorkingDay) {
      showToast({
        message: "The salon is closed on this day. Please select another date.",
        status: "error",
      });
      return;
    }

    // Check if salon is closed at selected time
    const time24 = timeTo24h(values.time);
    const isWithinHours =
      !time24 ||
      !timings?.openingTime ||
      !timings?.closingTime ||
      (time24 >= timings.openingTime && time24 < timings.closingTime);

    if (!isWithinHours) {
      showToast({
        message:
          "The salon is closed at this time. Please select another time.",
        status: "error",
      });
      return;
    }

    console.log(values);
    try {
      const services = values.selectedItems
        .filter((item: any) => item.type === "service")
        .map((item: any) => item.value);

      const comboOffers = values.selectedItems
        .filter((item: any) => item.type === "combo")
        .map((item: any) => item.value);

      const payload = {
        customerId: values.customer,
        services,
        comboOffers,
        staffId: values.staff,
        appointmentDate: values.date,
        appointmentTime: timeTo24h(values.time),
      };

      await appointmentApi.createAppointment(payload);
      resetForm();
    } catch (error) {
      showToast({
        message: "Failed to create appointment",
        status: "error",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // ================= UI =================

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CalendarPlus" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Quick Booking</h3>
      </div>

      <Formik
        initialValues={{
          customer: "",
          selectedItems: [],
          date: "",
          time: "",
          staff: "",
        }}
        validationSchema={BookingValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => {
          const selectedDate = values.date ? new Date(values.date) : null;
          const isValidDate = selectedDate && !isNaN(selectedDate.getTime());
          const selectedDayIndex = isValidDate ? selectedDate.getDay() : null;
          const isWorkingDay =
            (isValidDate && timings?.workingDays
              ? timings.workingDays.includes(selectedDayIndex!)
              : true) ?? true;
          const dateError =
            isValidDate && !isWorkingDay
              ? "The salon is closed on this day."
              : undefined;

          const time24 = values.time;
          const isWithinHours =
            !time24 ||
            !timings?.openingTime ||
            !timings?.closingTime ||
            (time24 >= timings.openingTime && time24 < timings.closingTime);
          const timeError =
            time24 && !isWithinHours
              ? "The salon is closed at this time."
              : undefined;

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
                const [h] = slot.value.split(":").map(Number);
                return h >= 9 && h <= 20;
              }
              return (
                slot.value >= timings.openingTime &&
                slot.value < timings.closingTime
              );
            });

          return (
            <Form className="space-y-4">
              {/* CUSTOMER */}
              <Select
                label="Customer"
                placeholder="Select customer"
                options={customerOptions}
                value={values.customer}
                onChange={(val) => {
                  setFieldValue("customer", val);
                  // Pre-select preferred staff if available
                  const selectedCustomer = customers.find((c) => c._id === val);
                  if (selectedCustomer?.preferredStaff) {
                    const prefStaff = selectedCustomer.preferredStaff;
                    const preferredStaffId =
                      typeof prefStaff === "string"
                        ? prefStaff
                        : (prefStaff as any)._id || (prefStaff as any).id;

                    if (preferredStaffId) {
                      setFieldValue("staff", preferredStaffId);
                    }
                  }
                }}
                onAddNew={() => router.push("/customer-database")}
                error={touched.customer ? errors.customer : undefined}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* DATE */}
                <Input
                  label="Date"
                  type="date"
                  value={values.date}
                  min={today}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setFieldValue("date", selectedDate);
                    fetchCombo(new Date(selectedDate));
                  }}
                  error={touched.date ? errors.date : (dateError as string)}
                />

                {/* TIME */}
                <Select
                  label="Time"
                  placeholder="Select time"
                  options={timeSlots}
                  value={values.time}
                  onChange={(val: string) => setFieldValue("time", val)}
                  error={touched.time ? errors.time : (timeError as string)}
                  className="mt-2.5"
                />
              </div>

              {/* SERVICE */}
              <GroupedSelect
                label="Service / Combo"
                placeholder="Select service or combo"
                multiple
                value={values.selectedItems}
                onChange={(val) => setFieldValue("selectedItems", val)}
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
                      label: `${c.label} (${c.percent.toFixed(0)}% OFF)`,
                      type: "combo",
                    })),
                  },
                ]}
              />
              {touched.selectedItems && errors.selectedItems && (
                <p className="text-sm text-red-600">
                  {errors.selectedItems as string}
                </p>
              )}

              {/* STAFF */}
              <Select
                label="Staff Member"
                placeholder="Select staff"
                options={staffOptions}
                value={values.staff}
                onChange={(val) => setFieldValue("staff", val)}
                onAddNew={() => router.push("/staff-management")}
                error={touched.staff ? errors.staff : undefined}
              />

              <Button type="submit" variant="default" fullWidth iconName="Plus">
                Create Booking
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default QuickBookingWidget;
