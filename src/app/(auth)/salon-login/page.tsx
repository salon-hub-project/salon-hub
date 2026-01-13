"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";
import { Formik } from "formik";
import * as Yup from "yup";
import { loginValidationSchema } from "@/app/components/validation/validation";
import { getSafeRedirectPath } from "@/app/utils/routePermissions";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    document.title = "Login - SalonHub";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
  
    const userRole = user?.role;
    
    const requestedPath =
      localStorage.getItem("redirectAfterLogin") ||
      localStorage.getItem("lastProtectedRoute");
  
    // Validate and get safe redirect path based on user role
    const safeRedirectPath = getSafeRedirectPath(requestedPath, userRole);
  
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("lastProtectedRoute");
    router.replace(safeRedirectPath);
  }, [isAuthenticated, user, router]);
  
  

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
          <LoginHeader />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            validateOnMount={false}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={(values) => {
              dispatch(
                loginUser({
                  email: values.email.trim(),
                  password: values.password,
                })
              );
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
              <LoginForm
                formData={values}
                errors={{
                  email: touched.email ? errors.email : undefined,
                  password: touched.password ? errors.password : undefined,
                }}
                onInputChange={(field, value) => {
                  setFieldValue(field, value);
                  if (error) dispatch(clearError());
                }}
                onSubmit={handleSubmit}
                isSubmitting={isLoading}
              />
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
