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

const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  categories: initialCategories,
  categoriesWithIds,
}: ServiceFormModalProps) => {
  const [fetchedCategories, setFetchedCategories] = useState< { value: string; label: string }[]>([]);
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
          initialCategories.map((name) => ({ value: name, label: name }))
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

  // Duration options
  const durationOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
  ];

  // Add new category
  // const handleAddCategories = async () => {
  //   const newName = prompt("Enter new category name:");

  //   if (!newName || !newName.trim()) return;

  //   // Check for duplicates
  //   if (fetchedCategories.some((cat) => cat.label.toLowerCase() === newName.trim().toLowerCase())) {
  //     alert("Category already exists");
  //     return;
  //   }

  //   try {
  //     const res = await categoryApi.createCategory({ name: newName.trim() });

  //     if (res?.category) {
  //       const newCategory = {
  //         value: res.category._id,
  //         label: res.category.name,
  //       };

  //       // Update dropdown list
  //       setFetchedCategories((prev: any[]) => [...prev, newCategory]);

  //       // Set selected value in Formik
  //       formikRef.current?.setFieldValue("category", newCategory.value);
  //     }
  //   } catch (error) {
  //     console.error("Category creation failed", error);
  //   }
  // };

  const handleAddCategories = async (newName?: string) => {
    if (!newName?.trim()) return;

    // Check duplicate
    if (
      fetchedCategories.some(
        (cat) => cat.label.toLowerCase() === newName.toLowerCase()
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
          }) => (
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
                <Select
                  label="Duration"
                  value={values.duration}
                  options={durationOptions}
                  onChange={(v) => setFieldValue("duration", v)}
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
              <Input
                label="Description"
                name="description"
                placeholder="Enter description here"
                value={values.description}
                onChange={handleChange}
                error= {touched.description ? errors.description : undefined}
              />

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
          )}
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
