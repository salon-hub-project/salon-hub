import Button from "./Button";
import { use, useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: (inputValue?: string) => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  confirmColor?: "red" | "green" | "blue"; // NEW
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
  showInput = false,
  inputPlaceholder = "",
  confirmColor = "red",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading]= useState(false);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getConfirmLabel = () => {
    const t = title.toLowerCase();
    if (t.includes("logout")) return "Logout";
    if (t.includes("delete")) return "Delete";
    if (t.includes("add")) return "Add";
    return "Confirm";
  };

  // Choose tailwind color based on confirmColor
  const confirmButtonClass =
    confirmColor === "green"
      ? "bg-primary text-white"
      : confirmColor === "blue"
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-red-500 hover:bg-red-600";

   const handleConfirm = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onConfirm(inputValue);
    } catch (err) {
      console.error("Confirm action failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center z-[999] bg-black/50">
      <div className="bg-card rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {showInput && (
          <input
            type="text"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className={confirmButtonClass}
            onClick={handleConfirm}
            disabled={isLoading}
          >
           {isLoading ? "Processing..." : getConfirmLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;