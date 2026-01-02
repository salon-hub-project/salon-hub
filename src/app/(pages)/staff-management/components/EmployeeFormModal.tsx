"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Employee, EmployeeFormData, ServiceApiResponse, ServicesApiResponse } from "../types";
import { staffApi } from "@/app/services/staff.api";
import Loader from "@/app/components/Loader";
import { serviceApi } from "@/app/services/service.api";

interface EmployeeFormModalProps {
  employee: Employee | null;
  onClose: () => void;
}

const addValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  role: Yup.string().required("Role is required"),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  commissionRate: Yup.number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Commission rate is required"),
  assignedServices: Yup.array()
    .of(Yup.string())
    .min(1, "At least one service must be assigned"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  rating: Yup.number()
    .min(0, "Minimum rating is 0")
    .max(5, "Maximum rating is 5")
    .required("Rating is required"),
});

const updateValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  role: Yup.string().required("Role is required"),
  commissionRate: Yup.number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Commission rate is required"),
  assignedServices: Yup.array()
    .of(Yup.string())
    .min(1, "At least one service must be assigned"),
});

const EmployeeFormModal = ({
  employee,
  onClose,
}: EmployeeFormModalProps) => {
   const initialValues: EmployeeFormData = {
    name: "",
    role: "",
    phone: "",
    email: "",
    password: "",
    rating: 0,
    commissionRate: 0,
    assignedServices: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  };
  const roleOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Stylist", label: "Stylist" },
    { value: "Colorist", label: "Colorist" },
    { value: "Nail Technician", label: "Nail Technician" },
    { value: "Receptionist", label: "Receptionist" },
  ]; 
  const [services, setServices] = useState<ServiceApiResponse[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [initialFormValues, setInitialFormValues] =
    useState<EmployeeFormData>(initialValues);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await serviceApi.getAllServices({ limit: 100 });
        const response = res as ServicesApiResponse;
        if (response.success && Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const serviceOptions = services.map((service) => ({
    value: service._id,
    label: service.serviceName,
    description: service.category?.name || "",
  }));

  useEffect(() => {
    if (!employee?.id) {
      setInitialFormValues(initialValues);
      setLoadingEmployee(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        setLoadingEmployee(true);
        const res = await staffApi.getStaffDetails(employee.id);
        
        // Handle different response structures: res.staffDetails or res.data.staffDetails
        const emp = res.staffDetails || res.data?.staffDetails || res.data || res;

        setInitialFormValues({
          name: emp.fullName || "",
          role: emp.role || "",
          commissionRate: emp.commissionRate || 0,
          assignedServices: Array.isArray(emp.assignedServices)
            ? emp.assignedServices.map((s: any) => {
                return typeof s === 'object' ? (s._id || s.serviceId || s.id) : s;
              })
            : [],
          availability: {
            monday: emp.workingDays?.includes("Monday") || false,
            tuesday: emp.workingDays?.includes("Tuesday") || false,
            wednesday: emp.workingDays?.includes("Wednesday") || false,
            thursday: emp.workingDays?.includes("Thursday") || false,
            friday: emp.workingDays?.includes("Friday") || false,
            saturday: emp.workingDays?.includes("Saturday") || false,
            sunday: emp.workingDays?.includes("Sunday") || false,
          },
          phone: "",
          email: "",
          password: "",
          rating: 0,
        });
      } catch (err) {
        console.error("Failed to fetch staff details", err);
        setInitialFormValues(initialValues);
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [employee]);


 

  const addEmployee = async (values: EmployeeFormData) => {
    try {
      const workingDays = Object.entries(values.availability)
        .filter(([_, isWorking]) => isWorking)
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

      const payload = {
        email: values.email,
        password: values.password,
        fullName: values.name,
        commissionRate: values.commissionRate,
        role: values.role,
        assignedServices: values.assignedServices,
        rating: values.rating,
        workingDays,
        phoneNumber: values.phone.replace(/^\+91/, "").replace(/\s+/g, ""),
      };
      await staffApi.addStaff(payload);
      onClose();
    } catch (error) {
      console.error("Failed to add staff", error);
    }
  };

  const updateEmployee = async (values: EmployeeFormData) => {
    if (!employee?.id) return;
    
    try {
      const workingDays = Object.entries(values.availability)
        .filter(([_, isWorking]) => isWorking)
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

      const payload = {
        fullName: values.name,
        commissionRate: values.commissionRate,
        role: values.role,
        assignedServices: values.assignedServices,
        workingDays,
      };
      await staffApi.updateStaff(employee.id, payload);
      onClose();
    } catch (error) {
      console.error("Failed to update staff", error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <Formik
          key={employee?.id || 'new'}
          initialValues={employee ? initialFormValues : initialValues}
          validationSchema={employee ? updateValidationSchema : addValidationSchema}
          enableReinitialize={true}
          onSubmit={employee ? updateEmployee : addEmployee}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {employee && loadingEmployee ? (
                <div className="flex items-center justify-center py-8">
                  <Loader inline size="sm" label="Loading employee data..." />
                </div>
              ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  error={touched.name ? errors.name : undefined}
                />

                <Select
                  label="Role"
                  placeholder="Select role"
                  options={roleOptions}
                  value={values.role}
                  onChange={(value) => setFieldValue("role", value)}
                  error={touched.role ? errors.role : undefined}
                />

                {!employee && (
                  <>
                    <Input
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      error={touched.phone ? errors.phone : undefined}
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      placeholder="employee@example.com"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email ? errors.email : undefined}
                    />
                    <Input
                      label="Password"
                      name="password"
                      placeholder="Enter Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password ? errors.password : undefined}
                    />
                  </>
                )}

                <Input
                  label="Commission Rate (%)"
                  name="commissionRate"
                  placeholder="0"
                  type="number"
                  value={values.commissionRate}
                  onChange={handleChange}
                  error={
                    touched.commissionRate ? errors.commissionRate : undefined
                  }
                />
              </div>

              {!employee && (
                <Input
                  label="Customer Rating (0–5)"
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="4.5"
                  value={values.rating}
                  onChange={handleChange}
                  error={touched.rating ? errors.rating : undefined}
                />
              )}
              <Select
                label="Assigned Services"
                placeholder={loadingServices ? "Loading services..." : "Select services"}
                options={serviceOptions}
                value={values.assignedServices}
                onChange={(value: string[]) =>
                  setFieldValue("assignedServices", value)
                }
                error={
                  touched.assignedServices
                    ? Array.isArray(errors.assignedServices)
                      ? errors.assignedServices[0]
                      : errors.assignedServices
                    : undefined
                }
                multiple
                searchable
                disabled={loadingServices}
              />


              <div>
                <label className="block text-sm font-medium mb-3">
                  Working Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(values.availability).map(
                    ([day, isWorking]) => (
                      <Checkbox
                        key={day}
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                        checked={isWorking}
                        onChange={(e) =>
                          setFieldValue(
                            `availability.${day}`,
                            e.target.checked
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose} fullWidth>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader
                      inline
                      size="sm"
                      label={employee ? "Updating..." : "Saving..."}
                      className="text-primary-foreground"
                    />
                  ) : employee ? (
                    "Update Employee"
                  ) : (
                    "Add Employee"
                  )}
                </Button>

              </div>
              </>
              )}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeFormModal;

