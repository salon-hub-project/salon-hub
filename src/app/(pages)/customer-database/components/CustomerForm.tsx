"use client";
import { Formik, Form } from "formik";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Customer, CustomerFormData, CustomerTag } from "../types";
import { customerValidationSchema } from "@/app/components/validation/validation";

interface CustomerFormProps {
  customer?: Customer;
  onClose: () => void;
  onSave: (data: CustomerFormData) => void;
}

const tagOptions: CustomerTag[] = ["VIP", "New", "Frequent", "Inactive"];

const staffOptions = [
  { value: "", label: "No Preference" },
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Michael Chen", label: "Michael Chen" },
  { value: "Emily Rodriguez", label: "Emily Rodriguez" },
  { value: "David Kim", label: "David Kim" },
];

const CustomerForm = ({ customer, onClose, onSave }: CustomerFormProps) => {
  const initialValues: CustomerFormData = {
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    gender: customer?.gender || "female",
    dateOfBirth: customer?.dateOfBirth || "",
    address: customer?.address || "",
    notes: customer?.notes || "",
    tags: customer?.tags || [],
    preferredStaff: customer?.preferredStaff || "",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={customerValidationSchema}
          onSubmit={(values) => onSave(values)}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  error={touched.name ? errors.name : undefined}
                />

                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  error={touched.phone ? errors.phone : undefined}
                />

                <Input
                  label="Email Address"
                  placeholder="customer@example.com"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={touched.email ? errors.email : undefined}
                />

                <Select
                  label="Gender"
                  value={values.gender}
                  options={[
                    { value: "female", label: "Female" },
                    { value: "male", label: "Male" },
                    { value: "other", label: "Other" },
                  ]}
                  className="w-full"
                  onChange={(val) => setFieldValue("gender", val)}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) => setFieldValue("dateOfBirth", e.target.value)}
                  error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                />

                <Select
                  label="Preferred Staff"
                  options={staffOptions}
                  value={values.preferredStaff}
                  className="w-full"
                  onChange={(val) => setFieldValue("preferredStaff", val)}
                  error={
                    touched.preferredStaff ? errors.preferredStaff : undefined
                  }
                />
              </div>

              <Input
                label="Address"
                placeholder="Enter customer address"
                value={values.address}
                onChange={(e) => setFieldValue("address", e.target.value)}
                error={touched.address ? errors.address : undefined}
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Customer Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted transition cursor-pointer"
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
                      <span className="text-sm text-foreground">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes
                </label>
                <textarea
                  value={values.notes}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes about the customer..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-background
        text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center  gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" fullWidth>
                  {customer ? "Save Changes" : "Add Customer"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CustomerForm;
