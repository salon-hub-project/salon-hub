"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { ComboOffer, ComboFormData } from "../types";
import { comboValidationSchema } from "@/app/components/validation/validation";
import { CustomerTag } from "../../customer-database/types";
import { customerTagApi } from "@/app/services/tags.api";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface ComboFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComboFormData) => void;
  combo: ComboOffer | null;
  availableServices: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }[];
}

const ComboFormModal: React.FC<ComboFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  combo,
  availableServices,
}) => {


  // const initialValues: ComboFormData = {
  //   name: combo?.name || "",
  //   description: combo?.description || "",
  //   services: combo?.services || [],
  //   discountedPrice: combo?.discountedPrice || null,
  //   validFrom: combo?.validFrom || new Date(),
  //   validUntil:
  //     combo?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //   minBookingRequirement: combo?.minBookingRequirement || undefined,
  //   customerEligibility: combo?.customerEligibility || "",
  //   staffCommissionRate: combo?.staffCommissionRate || null,
  // };
  const initialValues: ComboFormData = {
    name: combo?.name || "",
    description: combo?.description || "",
    services: combo?.services || [],
    discountedPrice: combo?.discountedPrice ?? null,
    validFrom: combo?.validFrom || new Date(),
    validUntil:
      combo?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  
    minBookingRequirement: combo?.minBookingRequirement ?? undefined,
  
    customerEligibility:
      combo?.customerEligibility && combo.customerEligibility !== "all"
        ? combo.customerEligibility
        : "",
  
    staffCommissionRate: combo?.staffCommissionRate ?? null,
  };
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [customerTags, setCustomerTags] = useState<any[]>([]); // Use any[] or specific type if available
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    const fetchCustomerTags = async () => {
      try {
        setLoadingTags(true);
        const res = await customerTagApi.getAllCustomerTags();
        const list = res?.data || [];
        setCustomerTags(list);
      } catch (error) {
        console.error("Failed to fetch customer tags", error);
        setCustomerTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchCustomerTags();
  }, []);

  const handleAddTag = async (tagName?: string) => {
    if (!tagName?.trim()) return;

    try {
      const res = await customerTagApi.createCustomerTag({
        name: tagName.trim(),
      });

      const createdTag = res?.data;
      if (!createdTag) return;

      setCustomerTags((prev) => [
        ...prev,
        {
          _id: createdTag._id,
          name: createdTag.name,
        },
      ]);

      setIsAddCategoryOpen(false);
    } catch (error) {
      console.error("Failed to create customer tag", error);
    }
  };

  const customerEligibilityOptions = [
    // { value: "all", label: "All Customers" },
    ...customerTags.map((tag) => ({
      value: tag._id,
      label: tag.name,
    })),
  ];

  const calculateOriginalPrice = (services: any[]) =>
    services.reduce((sum, s) => sum + s.originalPrice, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {combo ? "Edit Combo Offer" : "Create New Combo Offer"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={comboValidationSchema}
          enableReinitialize
          // onSubmit={(values) => {
          //   onSubmit(values);
          //   onClose();
          // }}
          onSubmit={(values) => {
            const payload = {
              ...values,
              customerEligibility: values.customerEligibility || undefined,
            };

            onSubmit(payload);
            onClose();
          }}
        >
          {({ values, setFieldValue, errors, touched }) => {
            const originalPrice = calculateOriginalPrice(values.services);
            const discounted = values.discountedPrice ?? 0;
            const savings =
              originalPrice && discounted
                ? ((originalPrice - discounted) / originalPrice) * 100
                : 0;

            return (
              <Form className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN */}
                  <div className="space-y-4">
                    <Input
                      label="Combo Name *"
                      placeholder="Enter Combo Name"
                      value={values.name}
                      onChange={(e) => setFieldValue("name", e.target.value)}
                      error={touched.name ? errors.name : undefined}
                    />

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={values.description}
                        onChange={(e) =>
                          setFieldValue("description", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                        rows={3}
                        placeholder="Describe your combo offer..."
                      />
                    </div>

                    {/* SERVICES */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Services * (min. 2)
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                        {availableServices.map((service) => {
                          const checked = values.services.some(
                            (s) => s.id === service.id,
                          );

                          return (
                            <label
                              key={service.id}
                              className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    if (checked) {
                                      setFieldValue(
                                        "services",
                                        values.services.filter(
                                          (s) => s.id !== service.id,
                                        ),
                                      );
                                    } else {
                                      setFieldValue("services", [
                                        ...values.services,
                                        {
                                          id: service.id,
                                          name: service.name,
                                          duration: service.duration,
                                          originalPrice: service.price,
                                        },
                                      ]);
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <span>{service.name}</span>
                              </div>
                              <span>INR {service.price.toFixed(2)}</span>
                            </label>
                          );
                        })}
                      </div>
                      {touched.services && errors.services && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.services as string}
                        </p>
                      )}
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Valid From *"
                        type="date"
                        value={
                          new Date(values.validFrom).toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          setFieldValue("validFrom", new Date(e.target.value))
                        }
                      />

                      <Input
                        label="Valid Until *"
                        type="date"
                        value={
                          new Date(values.validUntil)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) =>
                          setFieldValue("validUntil", new Date(e.target.value))
                        }
                        error={
                          touched.validUntil
                            ? (errors.validUntil as string)
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-4">
                    {/* PRICING CALCULATOR */}
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Pricing Calculator</h3>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Original Price:</span>
                          <span>INR {originalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Discounted Price:</span>
                          <span className="font-bold text-lg text-primary">
                            INR {(values.discountedPrice ?? 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span>Customer Saves:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">
                              INR {(originalPrice - discounted).toFixed(2)}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {savings.toFixed(0)}% OFF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Combo Price *"
                      type="number"
                      value={values.discountedPrice ?? ""}
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue(
                          "discountedPrice",
                          value === "" ? null : Number(value),
                        );
                      }}
                      error={
                        touched.discountedPrice
                          ? errors.discountedPrice
                          : undefined
                      }
                    />

                    <Select
                      label="Customer Eligibility"
                      value={values.customerEligibility}
                      options={customerEligibilityOptions}
                      onChange={(value) =>
                        setFieldValue("customerEligibility", value)
                      }
                      disabled={loadingTags}
                      onAddNew={() => setIsAddCategoryOpen(true)}
                    />

                    <Input
                      label="Minimum Bookings (Optional)"
                      placeholder="Enter bookings"
                      type="number"
                      value={values.minBookingRequirement || ""}
                      onChange={(e) =>
                        setFieldValue(
                          "minBookingRequirement",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />

                    <Input
                      label="Staff Commission Rate (%)"
                      type="number"
                      value={values.staffCommissionRate ?? ""}
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue(
                          "staffCommissionRate",
                          val === "" ? null : parseFloat(val),
                        );
                      }}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button variant="default" type="submit" fullWidth>
                    {combo ? "Update Combo" : "Create Combo"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <ConfirmModal
        isOpen={isAddCategoryOpen}
        showInput
        inputPlaceholder="Enter new customer eligibility name"
        title="Add New Customer Eligibility"
        description="Enter the name for the new eligibility"
        onCancel={() => setIsAddCategoryOpen(false)}
        onConfirm={handleAddTag}
        confirmColor="green"
      />
    </div>
  );
};

export default ComboFormModal;
