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
  renewSubscription,
} from "@/app/store/slices/ownerSlice";
import Icon from "@/app/components/AppIcon";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { normalizeRole } from "@/app/utils/normalizeRole";
import OwnerDetails from "./OwnerDetails";
import RenewSubscriptionModal from "./RenewSubscriptionModal";
import { ownerApi } from "@/app/services/owner.api";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Pagination";
import Tooltip from "@/app/components/ui/Tooltip";

const GetAllOwners = () => {
  const dispatch = useAppDispatch();
  const { owners, isLoading, error, selectedOwner, page, limit, total } =
    useAppSelector((state) => state.owner);
  const authUser = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState<string>("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const totalPages = Math.ceil(total / limit);

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

  const handleRenew = (owner: any) => {
    setSelectedOwnerId(owner._id);
    setSelectedOwnerEmail(owner.user?.email || "");
    setRenewModalOpen(true);
  };

  const confirmRenewSubscription = (months: number) => {
    if (selectedOwnerId) {
      dispatch(renewSubscription({ ownerId: selectedOwnerId, months }))
        .unwrap()
        .then(() => {
          setRenewModalOpen(false);
          setSelectedOwnerId(null);
        });
    }
  };

  const handleApprove = async (ownerId: string) => {
    setApprovingId(ownerId);
    try {
      await dispatch(approveOwner(ownerId)).unwrap();
    } catch (err) {
      console.error("Failed to approve owner:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const effectiveRole = Array.isArray(authUser?.role)
    ? authUser?.role[0]
    : (authUser?.role ?? "salon_owner");
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
        : (authUser?.email ?? "User"),
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

          {!isLoading && owners?.length > 0 && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Total Sales
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {owners?.map((owner) => (
                      <tr
                        key={owner._id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td
                          className="px-4 py-3 text-sm truncate max-w-[200px]"
                          title={owner?.user?.email}
                        >
                          {owner?.user?.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {owner?.user?.phoneNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {owner?.totalSales || 0}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {owner?.isApproved ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Icon name="CheckCircle" size={16} />
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApprove(owner._id)}
                              disabled={approvingId === owner._id}
                              className={`px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors ${
                                approvingId === owner._id
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {approvingId === owner._id
                                ? "Approving..."
                                : "Approve"}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* View */}
                            <Tooltip label="View Owner Details">
                              <Icon
                                name="Eye"
                                size={18}
                                className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                                onClick={() =>
                                  dispatch(FetchOwnersDetails(owner._id))
                                }
                              />
                            </Tooltip>

                            {/* Renew */}
                            <Tooltip label="Renew Subscription">
                              <Icon
                                name="RefreshCcw"
                                size={17}
                                className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                                onClick={() => handleRenew(owner)}
                              />
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip label="Delete Owner">
                              <Icon
                                name="Trash"
                                size={18}
                                className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                                onClick={() => handleDelete(owner._id)}
                              />
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        <RenewSubscriptionModal
          isOpen={renewModalOpen}
          onClose={() => setRenewModalOpen(false)}
          onConfirm={confirmRenewSubscription}
          loading={isLoading}
          ownerEmail={selectedOwnerEmail}
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
