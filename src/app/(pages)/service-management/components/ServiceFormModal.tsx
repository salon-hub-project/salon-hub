"use client";

import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Service, ServiceFormData } from "../types";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

import { categoryApi } from "../../../services/category.api";
import { serviceValidationSchema } from "@/app/components/validation/validation";

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const getCategoryNameById = (categoryId: string): string => {
    if (categoriesWithIds) {
      const category = categoriesWithIds.find((cat) => cat.id === categoryId);
      return category ? category.name : categoryId;
    }
    return categoryId;
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await categoryApi.getAllCategories({ page: 1, limit: 100 });
        const data = response.data || response || [];
        if (Array.isArray(data)) {
          const names = data.map((cat: any) => cat.name);
          setFetchedCategories(names);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setFetchedCategories(initialCategories);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (isOpen) loadCategories();
  }, [isOpen, initialCategories]);

  const durationOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
  ];

  const initialValues: ServiceFormData = {
    name: service?.name || "",
    category: service
      ? categoriesWithIds
        ? getCategoryNameById(service.category)
        : service.category
      : "",
    duration: service?.duration || 30,
    price: service?.price || 0,
    isPopular: service?.isPopular || false,
    description: service?.description || "",
  };

  const visibleCategories = showAllCategories
    ? fetchedCategories
    : fetchedCategories.filter((cat) =>
        cat.toLowerCase().includes(initialValues.category.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
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

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={serviceValidationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Service Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="e.g., Haircut, Manicure"
                error={touched.name ? errors.name : undefined}
              />

              {/* CATEGORY FIELD WITH DROPDOWN */}
              <div className="relative z-[60]">
                <div className="relative">
                  <Input
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={(e) => {
                      handleChange(e);
                      setIsCategoryDropdownOpen(true);
                      setShowAllCategories(false);
                    }}
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                    placeholder="e.g., Hair, Nail Care, Skin Care"
                    className="pr-10"
                    error={touched.category ? errors.category : undefined}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted text-muted-foreground"
                    onClick={() => {
                      if (isCategoryDropdownOpen) setIsCategoryDropdownOpen(false);
                      else {
                        setIsCategoryDropdownOpen(true);
                        setShowAllCategories(true);
                      }
                    }}
                  >
                    <Icon
                      name="ChevronDown"
                      size={16}
                      className={`transition-transform duration-200 ${
                        isCategoryDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {isCategoryDropdownOpen && (
                  <>
                    <div
                      className="
                      absolute z-[120] w-full mt-2
                      bg-card text-foreground
                      border border-border
                      rounded-lg
                      shadow-xl
                      max-h-60 overflow-y-auto
                    "
                    >
                      {isLoadingCategories ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground bg-card">
                          Loading...
                        </div>
                      ) : visibleCategories.length > 0 ? (
                        visibleCategories.map((cat) => (
                          <div
                            key={cat}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setFieldValue("category", cat);
                              setIsCategoryDropdownOpen(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No categories found
                        </div>
                      )}

                      {!isLoadingCategories &&
                        !showAllCategories &&
                        visibleCategories.length === 0 &&
                        values.category && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            Create "{values.category}"
                          </div>
                        )}
                    </div>

                    <div
                      className="fixed inset-0 z-[110]"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                  </>
                )}
              </div>

              {/* DURATION + PRICE */}
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

              <Input
                label="Description (Optional)"
                name="description"
                value={values.description}
                onChange={handleChange}
              />

              <Checkbox
                label="Mark as Popular Service"
                description="Popular services will be highlighted to customers"
                checked={values.isPopular}
                onChange={(e) => setFieldValue("isPopular", e.target.checked)}
              />

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose} fullWidth>
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
    </div>
  );
};

export default ServiceFormModal;
