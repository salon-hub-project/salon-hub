import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    className: "custom-toast",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    className: "custom-toast",
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    className: "custom-toast",
  });
};
