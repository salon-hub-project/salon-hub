"use client";

import { useEffect, useState, useRef } from "react";
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
import { useAppSelector } from "@/app/store/hooks";
import { isStaff } from "@/app/utils/routePermissions";
import { comboApi } from "@/app/services/combo.api";
import GroupedSelect from "@/app/components/ui/GroupedSelect";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/app/utils/cn";

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
  const match = time12h.match(/(\d+):00\s*(AM|PM)/i);
  if (!match) return time12h;
  let h = parseInt(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === "PM" && h < 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:00`;
};

const HOUR_PICKER_OPTIONS = [
  "12",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
];
const PERIOD_OPTIONS = ["AM", "PM"];

const HourPicker = ({ label, value, onChange, error }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [h, p] = value ? value.split(" ") : ["10:00", "AM"];
  const hourPart = h.split(":")[0];

  const handleSelect = (newHour: string, newPeriod: string) => {
    onChange(`${newHour}:00 ${newPeriod}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            readOnly
            value={value}
            onClick={() => setIsOpen(!isOpen)}
            placeholder="Select Time"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer pr-10",
              error && "border-destructive focus-visible:ring-destructive",
            )}
          />
          <button
            type="button"
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Clock size={18} />
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] mt-2 bg-card border border-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-2 flex gap-2 w-[150px]"
            style={{ top: "100%", right: 0 }}
          >
            <div className="flex-1 flex flex-col gap-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1 px-1 text-center">
                Hr
              </p>
              {HOUR_PICKER_OPTIONS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className={cn(
                    "w-full text-center py-1.5 rounded-lg text-xs transition-all duration-200",
                    hourPart === hour
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "hover:bg-accent text-foreground font-medium",
                  )}
                  onClick={() => handleSelect(hour, p)}
                >
                  {hour}
                </button>
              ))}
            </div>

            <div className="w-[1px] bg-border self-stretch my-1" />

            <div className="flex flex-col gap-1 justify-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1 px-1 text-center">
                P
              </p>
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={cn(
                    "px-3 py-3 rounded-lg text-xs transition-all duration-200 font-bold",
                    p === period
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent text-foreground",
                  )}
                  onClick={() => handleSelect(hourPart, period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
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
  const router = useRouter();

  // =========`======== FETCH DATA =================

  const fetchCustomers = async () => {
    // Skip customer API call for staff - they don't have access to customer data
    if (isStaff(userRole)) return;

    try {
      const res = await customerApi.getCustomers({ limit: 1000 });
      setCustomers(res.data);
      setCustomerOptions(
        res.data.map((c: any) => ({
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

  const fetchCombo = async () => {
    try {
      const res = await comboApi.getAllComboOffers({ limit: 100 });
      setComboOptions(
        res.data.map((c: any) => ({
          value: c._id,
          label: c.name,
          percent: c.savedPercent,
        })),
      );
    } catch (error) {
      console.error("Combo fetch error", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
    fetchServices();
    fetchStaff();
    fetchCombo();
  }, []);

  // ================= SUBMIT =================

  const handleSubmit = async (values: any, { resetForm }: any) => {
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
        {({ values, setFieldValue, errors, touched }) => (
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

            <div className="grid grid-cols-2 gap-4">
              {/* DATE */}
              <Input
                label="Date"
                type="date"
                value={values.date}
                onChange={(e) => setFieldValue("date", e.target.value)}
                error={touched.date ? errors.date : undefined}
              />

              {/* TIME */}
              <HourPicker
                label="Time"
                value={values.time}
                onChange={(val: string) => setFieldValue("time", val)}
                error={touched.time ? errors.time : undefined}
              />
            </div>

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
        )}
      </Formik>
    </div>
  );
};

export default QuickBookingWidget;
