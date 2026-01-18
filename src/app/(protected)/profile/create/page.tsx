"use client";

import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";

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
    openingTime: profile?.openingTime || "",
    closingTime: profile?.closingTime || "",
  };

  const ProfileSchema = Yup.object().shape({
    salonName: Yup.string().required("Salon name is required"),
    ownerName: Yup.string().required("Owner name is required"),
    openingTime: Yup.string(),
    closingTime: Yup.string(),
    workingDays: Yup.array().of(Yup.number()),
    salonImage: Yup.mixed()
    .nullable()
    .test(
      "image-required",
      "Salon image is required",
      function (value) {
        // create mode → image required
        if (!isEditMode) {
          return value instanceof File;
        }
        // edit mode → optional
        return true;
      }
    ),
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("salonName", values.salonName);
    formData.append("ownerName", values.ownerName);
    formData.append("workingDays", JSON.stringify(values.workingDays));
    formData.append("openingTime", values.openingTime);
    formData.append("closingTime", values.closingTime);

    if (values.salonImage) {
      formData.append("salonImage", values.salonImage);
    }

    if (isEditMode) {
      await dispatch(updateProfile(formData));
    } else {
      await dispatch(createProfile(formData));
    }

    router.push("/profile");
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
          {({ values, errors, touched, setFieldValue }) => (
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

              <Input
                label="Opening Time"
                type="time"
                value={values.openingTime}
                onChange={(e) => setFieldValue("openingTime", e.target.value)}
              />

              <Input
                label="Closing Time"
                type="time"
                value={values.closingTime}
                onChange={(e) => setFieldValue("closingTime", e.target.value)}
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
                      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 6)
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
        message: "Only image files are allowed (jpg, png, jpeg, webp)",
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
  <p className="text-red-500 text-sm mt-1">{errors.salonImage}</p>
)}

                </div>
              </div>

              <Button type="submit" className="w-full">
                {isEditMode ? "Update Profile" : "Create Profile"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </AuthGuard>
  );
};

export default CreateProfile;
