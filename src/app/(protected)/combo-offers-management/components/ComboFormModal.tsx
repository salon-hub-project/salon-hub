"use client";
import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { ComboOffer, ComboFormData } from "../types";
import { comboValidationSchema } from "@/app/components/validation/validation";
import { setFormDraft, clearFormDraft } from "@/app/store/slices/formDraftSlice";
import { FORMS_KEYS } from "@/app/constants/formKeys";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

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
  const comboDraft = useAppSelector(
    (state) => state.formDraft.drafts[FORMS_KEYS.COMBO],
  );
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formikRef = useRef<any>(null);

  const baseInitialValues: ComboFormData = {
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
  const initialValues = comboDraft && !combo ? comboDraft : baseInitialValues;

  // const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  // const [loadingTags, setLoadingTags] = useState(false);

  // const customerEligibilityOptions = [
  //   ...customerTags.map((tag) => ({
  //     value: tag.id,
  //     label: tag.name,
  //   })),
  // ];

  const calculateOriginalPrice = (services: any[]) =>
    services.reduce((sum, s) => sum + s.originalPrice, 0);

  const today = new Date().toISOString().split("T")[0];

  const getError = (error: unknown): string | undefined => {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  return undefined;
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {combo ? "Edit Combo Offer" : "Create New Combo Offer"}
          </h2>
          <button
            onClick={() => {
              if (!combo && formikRef.current) {
                dispatch(
                  setFormDraft({
                    key: FORMS_KEYS.COMBO,
                    data: formikRef.current.values,
                  }),
                );
              }
              onClose();
            }}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={comboValidationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = {
                ...values,
                customerEligibility: values.customerEligibility || undefined,
              };
              await onSubmit(payload);
              dispatch(clearFormDraft(FORMS_KEYS.COMBO))
              onClose();
            } catch (error) {
              console.error("Combo submit failed", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => {
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
                      error={touched.name ? getError(errors.name) : undefined}
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
                      {touched.description && getError(errors.description) && (
                        <p className="text-xs text-destructive text-red-500">
                          {getError(errors.description)}
                        </p>
                      )}
                    </div>

                    {/* SERVICES */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Services * (min. 2)
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                        {availableServices.length === 0 ? (
                          <div className="border border-dashed border-border rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <Icon
                                name="Scissors"
                                size={28}
                                className="text-muted-foreground"
                              />

                              <h4 className="text-sm font-medium text-foreground">
                                No services available
                              </h4>

                              <p className="text-xs text-muted-foreground">
                                Create services to add them to a combo
                              </p>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                iconName="Plus"
                                onClick={() => {
                                  dispatch(
                                    setFormDraft({
                                      key: FORMS_KEYS.COMBO,
                                      data: formikRef.current.values,
                                    }),
                                  );
                                  router.push("/service-management");
                                }}
                              >
                                Create Service
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                            {availableServices.map((service) => {
                              const checked = values.services.some(
                                (s: any) => s.id === service.id,
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
                                              (s: any) => s.id !== service.id,
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
                        )}
                      </div>
                      {touched.services && errors.services && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.services as string}
                        </p>
                      )}
                    </div>

                    {/* DATES */}
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
                          ? getError(errors.discountedPrice)
                          : undefined
                      }
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Valid From *"
                        type="date"
                        value={
                          values.validFrom &&
                          !isNaN(new Date(values.validFrom).getTime())
                            ? new Date(values.validFrom)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        min={today}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFieldValue("validFrom", val ? new Date(val) : "");
                        }}
                      />

                      <Input
                        label="Valid Until *"
                        type="date"
                        value={
                          values.validUntil &&
                          !isNaN(new Date(values.validUntil).getTime())
                            ? new Date(values.validUntil)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setFieldValue("validUntil", val ? new Date(val) : "");
                        }}
                        error={
                          touched.validUntil
                            ? (errors.validUntil as string)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {combo ? onClose() :
                      dispatch(clearFormDraft(FORMS_KEYS.COMBO));
                      onClose();
                    }}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? combo
                        ? "Updating..."
                        : "Creating..."
                      : combo
                        ? "Update Combo"
                        : "Create Combo"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ComboFormModal;
