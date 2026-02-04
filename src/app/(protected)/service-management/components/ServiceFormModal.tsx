"use client";

import { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import { Service, ServiceFormData } from "../types";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { categoryApi } from "../../../services/category.api";
import { serviceValidationSchema } from "@/app/components/validation/validation";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  service?: Service | null;
  categories: string[];
  categoriesWithIds?: Array<{ id: string; name: string }>;
}

// Standalone component to handle duration logic better
const DurationInputGroup = ({
  duration,
  setFieldValue,
  touched,
  errors,
}: {
  duration: number;
  setFieldValue: (field: string, value: any) => void;
  touched: boolean;
  errors: any;
}) => {
  const [localHr, setLocalHr] = useState(
    Math.floor((duration || 0) / 60).toString(),
  );
  const [localMin, setLocalMin] = useState(((duration || 0) % 60).toString());

  // Sync from props if transformed externally
  useEffect(() => {
    const h = Math.floor((duration || 0) / 60).toString();
    const m = ((duration || 0) % 60).toString();
    if (
      h !== localHr &&
      duration !== (parseInt(localHr) || 0) * 60 + (parseInt(localMin) || 0)
    ) {
      setLocalHr(h);
    }
    if (
      m !== localMin &&
      duration !== (parseInt(localHr) || 0) * 60 + (parseInt(localMin) || 0)
    ) {
      setLocalMin(m);
    }
  }, [duration]);

  // Update Formik when local state changes
  const updateDuration = (hr: string, min: string) => {
    const h = parseInt(hr) || 0;
    const m = parseInt(min) || 0;
    setFieldValue("duration", h * 60 + m);
  };

  const handleHrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      setLocalHr("");
      updateDuration("", localMin);
      return;
    }
    const val = rawVal.replace(/^0+/, "") || "0";
    setLocalHr(val);
    updateDuration(val, localMin);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      setLocalMin("");
      updateDuration(localHr, "");
      return;
    }
    let val = rawVal.replace(/^0+/, "") || "0";
    if (parseInt(val) > 59) val = "59";

    setLocalMin(val);
    updateDuration(localHr, val);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Duration</label>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="number"
            min={0}
            value={localHr}
            onChange={handleHrChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0"
          />
          <span className="text-sm text-muted-foreground font-medium">hr</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <input
            type="number"
            min={0}
            max={59}
            value={localMin}
            onChange={handleMinChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0"
          />
          <span className="text-sm text-muted-foreground font-medium">min</span>
        </div>
      </div>
      {touched && errors && (
        <p className="text-sm text-destructive text-red-500">
          {errors as string}
        </p>
      )}
    </div>
  );
};

const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  categories: initialCategories,
  categoriesWithIds,
}: ServiceFormModalProps) => {
  const [fetchedCategories, setFetchedCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const formikRef = useRef<any>(null);

  // Helper to get category name from id if editing service
  const getCategoryNameById = (categoryId: string): string => {
    if (categoriesWithIds) {
      const category = categoriesWithIds.find((cat) => cat.id === categoryId);
      return category ? category.name : categoryId;
    }
    return categoryId;
  };

  // Load categories when modal opens
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // setIsLoadingCategories(true);
        const response = await categoryApi.getAllCategories({
          page: 1,
          limit: 100,
        });
        const data = response.data || response || [];

        if (Array.isArray(data)) {
          // map to { value, label } for Select component
          const list = data.map((cat: any) => ({
            value: cat._id,
            label: cat.name,
          }));
          setFetchedCategories(list);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        // fallback: use initialCategories
        setFetchedCategories(
          initialCategories.map((name) => ({ value: name, label: name })),
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isOpen) loadCategories();
  }, [initialCategories]);

  // Initial form values
  const initialValues: ServiceFormData = {
    name: service?.name || "",
    category: service
      ? categoriesWithIds
        ? categoriesWithIds.find((cat) => cat.id === service.category)?.id || ""
        : service.category
      : "",
    duration: service?.duration || 30,
    price: service?.price || 0,
    isPopular: service?.isPopular || false,
    description: service?.description || "",
  };

  const handleAddCategories = async (newName?: string) => {
    if (!newName?.trim()) return;

    // Check duplicate
    if (
      fetchedCategories.some(
        (cat) => cat.label.toLowerCase() === newName.toLowerCase(),
      )
    ) {
      alert("Category already exists");
      return;
    }

    try {
      const res = await categoryApi.createCategory({ name: newName.trim() });
      const createdCategory = res?.category || res?.data?.category || res?.data;

      if (createdCategory) {
        const newCategory = {
          value: createdCategory._id,
          label: createdCategory.name,
        };

        setFetchedCategories((prev) => [...prev, newCategory]);
        formikRef.current?.setFieldValue("category", newCategory.value);
      }
    } catch (error) {
      console.error("Failed to create category", error);
    } finally {
      setIsAddCategoryOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {service ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          enableReinitialize
          validationSchema={serviceValidationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Service Name */}
                <Input
                  label="Service Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g., Haircut, Manicure"
                  error={touched.name ? errors.name : undefined}
                />

                {/* Category Select */}
                <Select
                  label="Category"
                  name="category"
                  value={values.category}
                  onChange={(val) => setFieldValue("category", val)}
                  options={fetchedCategories}
                  error={touched.category ? errors.category : undefined}
                  onAddNew={() => setIsAddCategoryOpen(true)}
                />

                {/* Duration & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DurationInputGroup
                    duration={values.duration}
                    setFieldValue={setFieldValue}
                    touched={!!touched.duration}
                    errors={errors.duration}
                  />

                  <Input
                    label="Price"
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={values.price === 0 ? "" : values.price}
                    onChange={handleChange}
                    error={touched.price ? errors.price : undefined}
                  />
                </div>

                {/* Description */}
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter description here"
                  value={values.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
                  // error= {touched.description ? errors.description : undefined}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-destructive text-red-500">
                    {errors.description}
                  </p>
                )}

                {/* Popular Service */}
                <Checkbox
                  label="Mark as Popular Service"
                  description="Popular services will be highlighted to customers"
                  checked={values.isPopular}
                  onChange={(e) => setFieldValue("isPopular", e.target.checked)}
                />

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth>
                    {service ? "Update Service" : "Add Service"}
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
      <ConfirmModal
        isOpen={isAddCategoryOpen}
        showInput
        inputPlaceholder="Enter new category name"
        title="Add New Category"
        description="Enter the name for the new category"
        onCancel={() => setIsAddCategoryOpen(false)}
        onConfirm={handleAddCategories}
        confirmColor="green"
      />
    </div>
  );
};

export default ServiceFormModal;
