"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchOwners,
  approveOwner,
  deleteOwner,
  FetchOwnersDetails,
  clearSelectedOwner,
} from "@/app/store/slices/ownerSlice";
import Icon from "@/app/components/AppIcon";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { normalizeRole } from "@/app/utils/normalizeRole";
import OwnerDetails from "./OwnerDetails";
import { ownerApi } from "@/app/services/owner.api";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Pagination";

const GetAllOwners = () => {
  const dispatch = useAppDispatch();
  const { owners, isLoading, error, selectedOwner, page, limit, total } = useAppSelector(
    (state) => state.owner
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const totalPages= Math.ceil(total/limit);

  useEffect(() => {
    dispatch(fetchOwners({ page: page, limit: limit }));
  }, [dispatch, page]);

  const handleDelete = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
    setConfirmOpen(true);
  };

  const confirmDeleteOwner = () => {
    if (selectedOwnerId) {
      dispatch(deleteOwner(selectedOwnerId));
    }
    setConfirmOpen(false);
    setSelectedOwnerId(null);
  };

  const effectiveRole = Array.isArray(authUser?.role)
    ? authUser?.role[0]
    : authUser?.role ?? "salon_owner";
  const normalizedRole = normalizeRole(effectiveRole);

  // Only allow SUPERADMIN to access this page
  useEffect(() => {
    if (normalizedRole !== "SUPERADMIN") {
      router.replace("/salon-dashboard");
    }
  }, [normalizedRole, router]);

  const headerUser = {
    name:
      authUser && (authUser?.firstName || authUser?.lastName)
        ? `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim()
        : authUser?.email ?? "User",
    email: authUser?.email ?? "",
    role: effectiveRole,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Sidebar userRole="super_admin" /> */}

      <div className="w-full lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Salon Owners</h1>
            <p className="text-muted-foreground">
              View and manage all registered salon owners
            </p>
          </div>

          {isLoading && <Loader label="Loading owners..." />}
          {error && <p className="text-red-500">{error}</p>}

          {!isLoading && owners?.length > 0 && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {owners?.map((owner) => (
                    <tr key={owner._id} className="border-t">
                      <td className="px-4 py-3">{owner?.userId?.email}</td>
                      <td className="px-4 py-3">
                        {owner?.userId?.phoneNumber || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {owner?.isApproved ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Icon name="CheckCircle" size={16} />
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => dispatch(approveOwner(owner._id))}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                      <td className="flex items-center gap-3 pt-3 pl-3 ">
                        <Icon
                          name="Eye"
                          size={18}
                          className="text-destructive"
                          onClick={() =>
                            dispatch(FetchOwnersDetails(owner._id))
                          }
                        />

                        <Icon
                          onClick={() => handleDelete(owner._id)}
                          name="Trash"
                          size={18}
                          className="text-destructive"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <OwnerDetails
                owner={selectedOwner}
                loading={isLoading}
                onClose={() => clearSelectedOwner()}
              />
            </div>
          )}
        </div>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Delete Owner"
          description="This action cannot be undone. Are you sure you want to delete this owner?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmDeleteOwner}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => dispatch(fetchOwners({ page: p, limit }))}
          className="pb-4"
        />
      </div>
    </div>
  );
};

export default GetAllOwners;
