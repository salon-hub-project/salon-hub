"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Loader from "@/app/components/Loader";

import { CustomerFormikValues, CustomerTag } from "../types";
import { customerApi } from "@/app/services/customer.api";
import { staffApi } from "@/app/services/staff.api";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email"),
  gender: Yup.string().required(),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});


interface CustomerFormProps {
  onClose: () => void;
}

const CustomerForm = ({ onClose }: CustomerFormProps) => {
  const tagOptions: CustomerTag[] = ["VIP", "New", "Frequent", "Inactive"];

  const [staff, setStaff] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoadingStaff(true);
        const res = await staffApi.getAllStaff({ limit: 100 });
        const list = res.data || res.staff || res;
        setStaff(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch staff", err);
        setStaff([]);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaff();
  }, []);

  const staffOptions = staff.map((emp) => ({
    value: emp._id,
    label: emp.fullName,
  }));

const addCustomer = async (values: CustomerFormikValues) => {
  try {
    await customerApi.addCustomer({
      fullName: values.name,
      gender: values.gender,
      DOB: values.dateOfBirth,
      phoneNumber: values.phone,
      password: values.password,

      preferredStaff: values.preferredStaff || undefined,
      customerTag: values.tags.length ? values.tags : undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
    });

    onClose();
  } catch (error) {
    console.error("Failed to add customer", error);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Add New Customer</h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted">
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik<CustomerFormikValues>
          initialValues={{
            name: "",
            phone: "",
            email: "",
            notes: "", 
            gender: "female",
            dateOfBirth: "",
            address: "",
            tags: [] as CustomerTag[],
            preferredStaff: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={addCustomer}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  error={touched.name ? errors.name : undefined}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                   placeholder="Enter phone number"
                  value={values.phone}
                  onChange={handleChange}
                  error={touched.phone ? errors.phone : undefined}
                />

                <Input
                  label="Email"
                  name="email"
                  placeholder="customer@example.com"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email ? errors.email : undefined}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter customer password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password ? errors.password : undefined}
                />

                <Select
                  label="Gender"
                  value={values.gender}
                  options={[
                    { value: "female", label: "Female" },
                    { value: "male", label: "Male" },
                    { value: "other", label: "Other" },
                  ]}
                  onChange={(v) => setFieldValue("gender", v)}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={values.dateOfBirth}
                  onChange={handleChange}
                  error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                />

                <Select
                  label="Preferred Staff"
                  placeholder={loadingStaff ? "Loading staff..." : "Select staff"}
                  options={staffOptions}
                  value={values.preferredStaff}
                  onChange={(v) => setFieldValue("preferredStaff", v)}
                  disabled={loadingStaff}
                />
              </div>

              <Input
                label="Address"
                name="address"
                placeholder="Enter customer address"
                value={values.address}
                onChange={handleChange}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Customer Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer"
                    >
                      <Checkbox
                        checked={values.tags.includes(tag)}
                        onChange={() =>
                          setFieldValue(
                            "tags",
                            values.tags.includes(tag)
                              ? values.tags.filter((t) => t !== tag)
                              : [...values.tags, tag]
                          )
                        }
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes about the customer... (optional)"
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} fullWidth>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? (
                    <Loader inline size="sm" label="Saving..." />
                  ) : (
                    "Add Customer"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CustomerForm;
