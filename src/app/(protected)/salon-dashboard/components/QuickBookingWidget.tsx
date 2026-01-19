"use client";

import { useEffect, useState } from "react";
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

interface QuickBookingWidgetProps {
  onCreateBooking: (data: any) => void;
}

interface BookingFormValues {
  customer: string;
  service: string[];
  date: string;
  time: string;
  staff: string;
}

const BookingValidationSchema = Yup.object({
  customer: Yup.string()
    .required("Please select a customer"),

  service: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one service")
    .required("Please select at least one service"),

  staff: Yup.string()
    .required("Please select a staff member"),

  date: Yup.string()
    .required("Please select a date"),

  time: Yup.string()
    .required("Please select a time"),
});


const QuickBookingWidget = ({ onCreateBooking }: QuickBookingWidgetProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [serviceOptions, setServiceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const router = useRouter();

  // =========`======== FETCH DATA =================

  const fetchCustomers = async () => {
    // Skip customer API call for staff - they don't have access to customer data
    if (isStaff(userRole)) return;

    try {
      const res = await customerApi.getCustomers({ limit: 1000 });
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

  useEffect(() => {
    fetchCustomers();
    fetchServices();
    fetchStaff();
  }, []);

  // ================= SUBMIT =================

  const handleSubmit = async (
    values: BookingFormValues,
    { resetForm }: any,
  ) => {
    try {
      const payload = {
        customerId: values.customer, // ✅ ObjectId
        services: values.service, // ✅ ObjectId[]
        staffId: values.staff, // ✅ ObjectId
        appointmentDate: values.date,
        appointmentTime: values.time,
      };

      await appointmentApi.createAppointment(payload);

      onCreateBooking(values);
      resetForm();
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.message || "Failed to create appointment",
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
          service: [],
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
              onChange={(val) => setFieldValue("customer", val)}
              onAddNew={() => router.push("/customer-database")}
            />
             {touched.customer && errors.customer && (
              <p className="text-xs text-destructive mt-1 text-red-500">{errors.customer}</p>
            )}


            {/* SERVICE */}
            <Select
              label="Service"
              placeholder="Select service"
              options={serviceOptions}
              value={values.service}
              onChange={(val) => setFieldValue("service", val)}
              multiple
              closeOnSelect
              onAddNew={() => router.push("/service-management")}
            />
            {touched.service && errors.service && (
              <p className="text-xs text-destructive mt-1 text-red-500">{errors.service}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* DATE */}
              <Input
                label="Date"
                type="date"
                value={values.date}
                onChange={(e) => setFieldValue("date", e.target.value)}
              />
              {touched.date && errors.date && (
                <p className="text-xs text-destructive mt-1 text-red-500">{errors.date}</p>
              )}

              {/* TIME */}
              <Input
                label="Time"
                type="time"
                value={values.time}
                onChange={(e) => setFieldValue("time", e.target.value)}
              />
              {touched.time && errors.time && (
                <p className="text-xs text-destructive mt-1 text-red-500">{errors.time}</p>
              )}
            </div>

            {/* STAFF */}
            <Select
              label="Staff Member"
              placeholder="Select staff"
              options={staffOptions}
              value={values.staff}
              onChange={(val) => setFieldValue("staff", val)}
              onAddNew={() => router.push("/staff-management")}
            />
            {touched.staff && errors.staff && (
              <p className="text-xs text-destructive text-red-500">{errors.staff}</p>
            )}

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
