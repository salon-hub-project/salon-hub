"use client";

import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "../../../utils/cn";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createProfile,
  updateProfile,
} from "../../../store/slices/profileSlice";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import AuthGuard from "../../../components/AuthGuard";
import config from "../../../config";
import { showToast } from "@/app/components/ui/toast";

interface ProfileFormValues {
  salonName: string;
  ownerName: string;
  salonImage: File | null;
  workingDays: number[];
  openingTime: string;
  closingTime: string;
}

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const parseWorkingDays = (input: string): number[] => {
  const nums = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token) => {
      const lower = token.toLowerCase();

      // Try numeric first
      const asNumber = Number(lower);
      if (Number.isFinite(asNumber)) {
        return Math.trunc(asNumber);
      }

      // Try match by full name or first 3 letters
      const matchIndex = DAY_LABELS.findIndex((day) => {
        const dl = day.toLowerCase();
        return dl === lower || dl.slice(0, 3) === lower.slice(0, 3);
      });

      return matchIndex >= 0 ? matchIndex : null;
    })
    .filter((n): n is number => typeof n === "number")
    .filter((n) => n >= 0 && n <= 6);

  // De-dupe while preserving order
  return Array.from(new Set(nums));
};

const workingDaysToLabelString = (days: number[]): string =>
  days
    .map((d) => DAY_LABELS[d])
    .filter(Boolean)
    .join(", ");

const normalizeWorkingDaysInitialValue = (value: unknown): number[] => {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "number" ? v : Number(v)))
      .filter((n) => Number.isFinite(n))
      .map((n) => Math.trunc(n))
      .filter((n) => n >= 0 && n <= 6);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return normalizeWorkingDaysInitialValue(parsed);
      }
    } catch {
      // fallback to comma-separated
      return parseWorkingDays(value);
    }
  }
  return [];
};

const timeTo12h = (time: string) => {
  if (!time) return "";
  const [h] = time.split(":");
  const hours = parseInt(h);
  if (isNaN(hours)) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12.toString().padStart(2, "0")}:00 ${suffix}`;
};

const timeTo24h = (time12h: string) => {
  if (!time12h) return "";
  const match = time12h.match(/(\d+):00\s*(AM|PM)/i);
  if (!match) return time12h;
  let h = parseInt(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === "PM" && h < 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:00`;
};

const HOUR_PICKER_OPTIONS = [
  "12",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
];
const PERIOD_OPTIONS = ["AM", "PM"];

const HourPicker = ({ label, value, onChange, error, name }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [h, p] = value ? value.split(" ") : ["10:00", "AM"];
  const hourPart = h.split(":")[0];

  const handleSelect = (newHour: string, newPeriod: string) => {
    onChange(`${newHour}:00 ${newPeriod}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none text-foreground block mb-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            readOnly
            value={value}
            onClick={() => setIsOpen(!isOpen)}
            placeholder="Select Time"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer pr-10",
              error && "border-destructive focus-visible:ring-destructive",
            )}
          />
          <button
            type="button"
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Clock size={18} />
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 font-medium mt-1">{error}</p>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 flex gap-4 min-w-[220px]"
            style={{ top: "100%", left: 0 }}
          >
            {/* Hour column */}
            <div className="flex-1 flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 px-2">
                Hour
              </p>
              {HOUR_PICKER_OPTIONS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className={cn(
                    "w-full text-center py-2 rounded-lg text-sm transition-all duration-200",
                    hourPart === hour
                      ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-200"
                      : "hover:bg-gray-50 text-gray-700 font-medium",
                  )}
                  onClick={() => handleSelect(hour, p)}
                >
                  {hour}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-gray-100 self-stretch my-2" />

            {/* Period column */}
            <div className="flex flex-col gap-1 justify-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 px-2 text-center">
                AM/PM
              </p>
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={cn(
                    "px-5 py-3 rounded-lg text-sm transition-all duration-200 font-bold",
                    p === period
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "hover:bg-gray-50 text-gray-700",
                  )}
                  onClick={() => handleSelect(hourPart, period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

const CreateProfile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((state) => state.profile);

  const isEditMode = Boolean(profile);

  const initialValues: ProfileFormValues = {
    salonName: profile?.salonName || "",
    ownerName: profile?.ownerName || "",
    salonImage: null,
    workingDays: normalizeWorkingDaysInitialValue(profile?.workingDays),
    openingTime: profile?.openingTime ? timeTo12h(profile.openingTime) : "",
    closingTime: profile?.closingTime ? timeTo12h(profile.closingTime) : "",
  };

  const ProfileSchema = Yup.object().shape({
    salonName: Yup.string().required("Salon name is required"),
    ownerName: Yup.string().required("Owner name is required"),
    openingTime: Yup.string(),
    closingTime: Yup.string(),
    workingDays: Yup.array().of(Yup.number()),
    salonImage: Yup.mixed()
      .nullable()
      .test("image-required", "Salon image is required", function (value) {
        // create mode → image required
        if (!isEditMode) {
          return value instanceof File;
        }
        // edit mode → optional
        return true;
      }),
  });

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting }: any,
  ) => {
    try {
      const formData = new FormData();
      formData.append("salonName", values.salonName);
      formData.append("ownerName", values.ownerName);
      formData.append("workingDays", JSON.stringify(values.workingDays));
      formData.append("openingTime", timeTo24h(values.openingTime));
      formData.append("closingTime", timeTo24h(values.closingTime));

      if (values.salonImage) {
        formData.append("salonImage", values.salonImage);
      }

      if (isEditMode) {
        await dispatch(updateProfile(formData));
      } else {
        await dispatch(createProfile(formData));
      }

      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Update Profile" : "Create Profile"}
        </h1>

        <Formik<ProfileFormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <Input
                label="Salon Name"
                value={values.salonName}
                onChange={(e) => setFieldValue("salonName", e.target.value)}
                error={touched.salonName ? errors.salonName : undefined}
              />

              <Input
                label="Owner Name"
                value={values.ownerName}
                onChange={(e) => setFieldValue("ownerName", e.target.value)}
                error={touched.ownerName ? errors.ownerName : undefined}
              />

              <HourPicker
                label="Opening Time"
                value={values.openingTime}
                onChange={(val: string) => setFieldValue("openingTime", val)}
                error={touched.openingTime ? errors.openingTime : undefined}
                name="openingTime"
              />

              <HourPicker
                label="Closing Time"
                value={values.closingTime}
                onChange={(val: string) => setFieldValue("closingTime", val)}
                error={touched.closingTime ? errors.closingTime : undefined}
                name="closingTime"
              />

              <Select
                label="Working Days"
                multiple
                closeOnSelect={false}
                value={values.workingDays}
                onChange={(selected: number[] | number) => {
                  const arr = Array.isArray(selected) ? selected : [selected];
                  setFieldValue(
                    "workingDays",
                    arr
                      .map((n) => Number(n))
                      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 6),
                  );
                }}
                options={DAY_LABELS.map((label, index) => ({
                  value: index,
                  label,
                }))}
              />

              <div className="space-y-2">
                {isEditMode && profile?.salonImage && (
                  <div className="border rounded-md p-3">
                    <p className="text-sm text-gray-600 mb-1">
                      Current Salon Image
                    </p>

                    <img
                      src={profile.salonImage}
                      alt="Salon"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}

                {/* Upload new image */}
                <div>
                  <label className="text-sm font-medium">
                    {isEditMode ? "Change Image (optional)" : "Salon Image"}
                  </label>
                  {/* <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue(
                        "salonImage",
                        e.currentTarget.files?.[0] || null
                      )
                    }
                    className="mt-1 block w-full text-sm"
                  /> */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];

                      if (!file) {
                        setFieldValue("salonImage", null);
                        return;
                      }

                      // ✅ Strict image validation
                      if (!file.type.startsWith("image/")) {
                        showToast({
                          message:
                            "Only image files are allowed (jpg, png, jpeg, webp)",
                          status: "error",
                        });
                        e.currentTarget.value = ""; // reset input
                        setFieldValue("salonImage", null);
                        return;
                      }

                      setFieldValue("salonImage", file);
                    }}
                    className="mt-1 block w-full text-sm"
                  />
                  {touched.salonImage && errors.salonImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.salonImage}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Profile"
                    : "Create Profile"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </AuthGuard>
  );
};

export default CreateProfile;
