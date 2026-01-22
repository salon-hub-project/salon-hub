"use client";

import { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Loader from "@/app/components/Loader";

import { CustomerFormikValues, CustomerTag, Customer } from "../types";
import { customerApi } from "@/app/services/customer.api";
import { staffApi } from "@/app/services/staff.api";
import { customerTagApi } from "@/app/services/tags.api";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

const getValidationSchema = (isEditMode: boolean) =>
  Yup.object({
    name: Yup.string().trim().required("Name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    email: Yup.string().email("Invalid email"),
    gender: Yup.string().required(),
    dateOfBirth: Yup.date()
      .typeError("Invalid date of birth")
      .max(new Date(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),
    password: isEditMode
      ? Yup.string()
      : Yup.string().min(8, "Minimum 8 characters"),
  });

interface CustomerFormProps {
  onClose: () => void;
  editingCustomer?: Customer;
  onSuccess?: () => void;
  customerTags: {
    id: string;
    name: string;
  }[];
  onTagAdded: (tag: { id: string; name: string }) => void;
}

const CustomerForm = ({
  onClose,
  editingCustomer,
  onSuccess,
  customerTags,
  onTagAdded,
}: CustomerFormProps) => {
  const isEditMode = !!editingCustomer;
  //const tagOptions: CustomerTag[] = ["VIP", "New", "Frequent", "Inactive"];

  // const [customerTags, setCustomerTags] = useState<any[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const fetchingStaffRef = useRef(false);
  const mountedRef = useRef(true);
  const router = useRouter();

  //Fetch Staff API:-
  useEffect(() => {
    const fetchStaff = async () => {
      // Prevent duplicate calls
      if (fetchingStaffRef.current) return;

      fetchingStaffRef.current = true;
      mountedRef.current = true;
      try {
        setLoadingStaff(true);
        const res = await staffApi.getAllStaff({ limit: 100 });
        const list = res.data || res.staff || res;

        if (mountedRef.current) {
          setStaff(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (mountedRef.current) {
          console.error("Failed to fetch staff", err);
          setStaff([]);
        }
      } finally {
        if (mountedRef.current) {
          setLoadingStaff(false);
        }
        fetchingStaffRef.current = false;
      }
    };

    fetchStaff();

    return () => {
      mountedRef.current = false;
      fetchingStaffRef.current = false;
    };
  }, []);

  const staffOptions = staff.map((emp) => ({
    value: emp._id,
    label: emp.fullName,
  }));

  // Get the staff ID - if it's already an ID, use it; otherwise find by name
  const getPreferredStaffId = (preferredStaff: string): string => {
    if (!preferredStaff) return "";
    // Check if it's already an ID (MongoDB ObjectId format - 24 hex characters)
    if (/^[0-9a-fA-F]{24}$/.test(preferredStaff)) {
      return preferredStaff;
    }
    // Otherwise, find by name
    const foundStaff = staff.find((s) => s.fullName === preferredStaff);
    return foundStaff?._id || "";
  };

  //Fetch CustomerTags API:-
  // const fetchCustomerTags = async () => {
  //   try {
  //     setLoadingTags(true);
  //     const res = await customerTagApi.getAllCustomerTags();
  //     const list = res?.data || [];
  //     setCustomerTags(
  //       list.map((tag: any) => ({
  //         value: tag._id,
  //         label: tag.name,
  //       })),
  //     );
  //   } catch (error) {
  //     console.error("Failed to fetch customer tags", error);
  //     setCustomerTags([]);
  //   } finally {
  //     setLoadingTags(false);
  //   }
  // };

  // useEffect(()=> {
  //    fetchCustomerTags();
  // },[])

  const tagOptions = customerTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  // const handleAddTag = async (tagName?: string) => {
  //   if (!tagName?.trim()) return;
  //   try {
  //     const res = await customerTagApi.createCustomerTag({
  //       name: tagName.trim(),
  //     });

  //     const createdTag = res?.data;
  //     if (!createdTag) return;

  //     setCustomerTags((prev) => [
  //       ...prev,
  //       {
  //         value: createdTag._id,
  //         label: createdTag.name,
  //       },
  //     ]);

  //     setIsAddCategoryOpen(false);
  //   } catch (error) {
  //     console.error("Failed to create customer tag", error);
  //   }
  // };

  const handleAddTag = async (tagName?: string) => {
    if (!tagName?.trim()) return;

    try {
      const res = await customerTagApi.createCustomerTag({
        name: tagName.trim(),
      });

      const createdTag = res?.data;
      if (!createdTag) return;

      onTagAdded({
        id: createdTag._id,
        name: createdTag.name,
      });

      setIsAddCategoryOpen(false);
    } catch (error) {
      console.error("Failed to create customer tag", error);
    }
  };

  const addCustomer = async (values: CustomerFormikValues) => {
    try {
      await customerApi.addCustomer({
        fullName: values.name,
        gender: values.gender,
        DOB: values.dateOfBirth,
        phoneNumber: values.phone,
        preferredStaff: values.preferredStaff || undefined,
        customerTag: values.tags.length ? values.tags : undefined,
        email: values.email || undefined,
        notes: values.notes || undefined,
      });
      onClose();
      onSuccess?.();
      // await fetchCustomerTags();
    } catch (error) {
      console.error("Failed to add customer", error);
    }
  };

  const updateCustomer = async (values: CustomerFormikValues) => {
    if (!editingCustomer) return;

    try {
      await customerApi.updateCustomer(editingCustomer.id, {
        fullName: values.name,
        gender: values.gender,
        DOB: values.dateOfBirth,
        preferredStaff: values.preferredStaff || undefined,
        customerTag: values.tags.length ? values.tags : undefined,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update customer", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted">
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik<CustomerFormikValues>
          initialValues={{
            name: editingCustomer?.name || "",
            phone: editingCustomer?.phone || "",
            email: editingCustomer?.email || "",
            notes: editingCustomer?.notes || "",
            gender: editingCustomer?.gender || "female",
            dateOfBirth: editingCustomer?.dateOfBirth || "",
            tags:
              editingCustomer?.tagIds ||
              editingCustomer?.tags ||
              ([] as CustomerTag[]),
            preferredStaff: editingCustomer?.preferredStaff
              ? getPreferredStaffId(editingCustomer.preferredStaff)
              : "",
          }}
          validationSchema={getValidationSchema(isEditMode)}
          enableReinitialize={true}
          onSubmit={isEditMode ? updateCustomer : addCustomer}
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
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
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
                  maxLength={10}
                  disabled={isEditMode}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      "",
                    );
                  }}
                />

                <Input
                  label="Email (Optional)"
                  name="email"
                  placeholder="customer@example.com"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email ? errors.email : undefined}
                  disabled={isEditMode}
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
                  placeholder={
                    loadingStaff ? "Loading staff..." : "Select staff"
                  }
                  options={staffOptions}
                  value={values.preferredStaff}
                  onChange={(v) => setFieldValue("preferredStaff", v)}
                  disabled={loadingStaff}
                  onAddNew={() => router.push("/staff-management")}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Customer Tags
                </label>

                {loadingTags ? (
                  <div className="text-sm text-muted-foreground">
                    Loading tags...
                  </div>
                ) : customerTags.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-4 text-center">
                    <Icon
                      name="Tag"
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />

                    <p className="text-sm font-medium text-foreground">
                      No customer tags
                    </p>

                    <p className="text-xs text-muted-foreground mb-3">
                      Create tags to categorize your customers
                    </p>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => setIsAddCategoryOpen(true)}
                    >
                      Create Tag
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {tagOptions.map((tag) => (
                      <label key={tag.value} className="flex gap-2">
                        <Checkbox
                          checked={values.tags.includes(tag.value)}
                          onChange={() =>
                            setFieldValue(
                              "tags",
                              values.tags.includes(tag.value)
                                ? values.tags.filter((t) => t !== tag.value)
                                : [...values.tags, tag.value],
                            )
                          }
                        />
                        {tag.label}
                      </label>
                    ))}
                  </div>
                )}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? (
                    <Loader inline size="sm" label="Saving..." />
                  ) : isEditMode ? (
                    "Update Customer"
                  ) : (
                    "Add Customer"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <ConfirmModal
        isOpen={isAddCategoryOpen}
        showInput
        inputPlaceholder="Enter new tag name"
        title="Add New Customer Tag"
        description="Enter the name for the new tag"
        onCancel={() => setIsAddCategoryOpen(false)}
        onConfirm={handleAddTag}
        confirmColor="green"
      />
    </div>
  );
};

export default CustomerForm;
