"use client";

import Loader from "@/app/components/Loader";
import Icon from "@/app/components/AppIcon";
import Button from "@/app/components/ui/Button";
import { useAppDispatch } from "@/app/store/hooks";
import { clearSelectedOwner } from "@/app/store/slices/ownerSlice";

interface OwnerDetailsPanelProps {
  owner: any | null;
  loading?: boolean;
  onClose?: () => void;
}

const OwnerDetails = ({ owner, loading }: OwnerDetailsPanelProps) => {
  if (!owner && !loading) return null;

  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(clearSelectedOwner());
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            Owner Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <Loader label="Loading owner details..." />
          ) : (
            <>
              {/* BASIC INFO */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {owner?.data?.userId?.email}
                </h3>

                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    owner?.data?.isApproved
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  <Icon
                    name={owner?.data?.isApproved ? "CheckCircle" : "Clock"}
                    size={14}
                  />
                  {owner?.data?.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-small">
                    {owner?.userId?.role?.[0] ?? "OWNER"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-small">
                    {owner?.data?.userId?.phoneNumber || "-"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-small">
                    {owner?.data?.userId?.address || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-small">
                    {owner?.data?.createdAt
                      ? new Date(owner?.data?.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-small">
                    {owner?.data?.updatedAt
                      ? new Date(owner?.data?.updatedAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {/* <div className="border-t px-6 py-4">
          <Button fullWidth variant="outline" onClick={onClose}>
            Close
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default OwnerDetails;
