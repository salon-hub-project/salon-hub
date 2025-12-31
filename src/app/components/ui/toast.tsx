import toast from "react-hot-toast";

type ToastStatus = "success" | "error" | "info" | "default";

interface ShowToastProps {
  message: string;
  status?: ToastStatus;
}

export function showToast({ message, status = "default" }: ShowToastProps) {
  switch (status) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast(message, { icon: "ℹ️" });
      break;
    default:
      toast(message);
  }
}
