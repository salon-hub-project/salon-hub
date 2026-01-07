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
import AuthGuard from "../../../components/AuthGuard";
import config from "../../../config";

interface ProfileFormValues {
  salonName: string;
  ownerName: string;
  salonImage: File | null;
}

console.log(config.API_BASE_URL);

const ProfileSchema = Yup.object().shape({
  salonName: Yup.string().required("Salon name is required"),
  ownerName: Yup.string().required("Owner name is required"),
});

const CreateProfile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((state) => state.profile);
  console.log(profile);

  const isEditMode = Boolean(profile);

  const initialValues: ProfileFormValues = {
    salonName: profile?.salonName || "",
    ownerName: profile?.ownerName || "",
    salonImage: null,
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("salonName", values.salonName);
    formData.append("ownerName", values.ownerName);

    if (values.salonImage) {
      formData.append("salonImage", values.salonImage);
    }
    console.log(formData);

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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue(
                        "salonImage",
                        e.currentTarget.files?.[0] || null
                      )
                    }
                    className="mt-1 block w-full text-sm"
                  />
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
