"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../components/AppIcon";
import { useAppSelector } from "../../store/hooks";
import { useAppDispatch } from "../../store/hooks";
import { getProfile, deleteProfile } from "@/app/store/slices/profileSlice";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { normalizeRole } from "@/app/utils/normalizeRole";
import Loader from "@/app/components/Loader";
import { formatTo12Hour } from "@/app/utils/formatHour";

interface ProfileItemProps {
  icon: string;
  label: string;
  value: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state: any) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fetchInitiatedRef = useRef(false);

  // const normalizedUserRole = normalizeRole(user.role);

  // useEffect(() => {
  //   if (normalizedUserRole !== "OWNER") return;
  //   if (!profile && !isLoading && !fetchInitiatedRef.current) {
  //     fetchInitiatedRef.current = true;
  //     dispatch(getProfile());
  //   }
  // }, [dispatch, normalizedUserRole]);

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Loader label="Loading profile..."/>
      </div>
    );
  }
  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "Salon Owner";

  const currentUser = {
    name: fullName,
    email: user.email,
    role: user.role || "salon_owner",
    avatar: user.avatar || profile?.salonImage || "",
    salonName: profile?.salonName || "—",
    salonOwner: profile?.ownerName || "—",
  };

  const handleDeleteProfile = async () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {fullName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileItem icon="Mail" label="Email" value={user.email} />
            <ProfileItem
              icon="Phone"
              label="Phone Number"
              value={user.phoneNumber ?? "—"}
            />
            <ProfileItem
              icon="MapPin"
              label="Address"
              value={user.address ?? "—"}
            />
            <ProfileItem
              icon="Shield"
              label="Role"
              value={user.role ?? "Salon Owner"}
            />
            <ProfileItem
              icon="User"
              label="Owner Name"
              value={profile?.ownerName ?? "—"}
            />
            <ProfileItem
              icon="Scissors"
              label="Salon Name"
              value={profile?.salonName ?? "—"}
            />
            <ProfileItem
              icon="Clock"
              label="Opening Time"
              value={formatTo12Hour(profile?.openingTime) ?? "—"}
            />
            <ProfileItem
              icon="Clock"
              label="Closing Time"
              value={formatTo12Hour(profile?.closingTime) ?? "—"}
            />
            <ProfileItem
              icon="Calendar"
              label="Working Days"
              value={
                profile?.workingDays && profile.workingDays.length > 0
                  ? profile.workingDays
                      .map((d: number) =>
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                      )
                      .join(", ")
                  : "—"
              }
            />
          </div>
        </div>

        {/* Profile Actions */}
        {/* Profile Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          {/* IF profile does NOT exist */}
          {!profile && (
            <button
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
              onClick={() => router.push("/profile/create")}
            >
              Create Profile
            </button>
          )}

          {/* IF profile EXISTS */}
          {profile && (
            <>
              <button
                className="px-4 py-2 rounded-md border border-border text-sm hover:bg-secondary transition"
                onClick={() => router.push("/profile/create")}
              >
                Update Profile
              </button>

              <button
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition"
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </button>
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Profile?"
          description="Are you sure you want to delete your profile? This action cannot be undone."
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            try {
              await dispatch(deleteProfile()).unwrap();
              setShowDeleteModal(false);
              router.push("/profile");
            } catch (error) {
              console.error("Delete failed:", error);
            }
          }}
        />
      </div>
    </>
  );
};

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-muted-foreground">
      <Icon name={icon} size={18} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
