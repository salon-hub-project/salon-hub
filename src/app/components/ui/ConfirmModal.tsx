// components/ui/ConfirmModal.tsx
import React from "react";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;
    const getConfirmLabel = () => {
    const t = title.toLowerCase();
    if (t.includes("logout")) return "Logout";
    if (t.includes("delete")) return "Delete";
    return "Confirm";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 z-[999]">
      <div className="bg-card rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" className="bg-red-500" onClick={onConfirm}>
            {getConfirmLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
