"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Button from "@/app/components/ui/Button";

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: string;
  title?: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  amount = "₹0",
  title = "Scan to Pay",
}: QrPaymentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-4 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pay Amount: <span className="font-semibold">{amount}</span>
          </p>
        </div>

        {/* QR Image */}
        <div className="flex justify-center my-5">
          <div className="rounded-2xl border p-4 bg-gray-50">
            <Image
              src="/payment.image.jpeg"
              alt="UPI QR Code"
              width={220}
              height={220}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-center mb-5">
          <p className="text-sm text-muted-foreground">
            Scan this QR using any UPI app (GPay, PhonePe, Paytm, BHIM).
          </p>

          <p className="text-sm font-medium text-gray-800">
            After payment, please share the screenshot on
          </p>

          <p className="text-base font-bold text-primary">📲 7987421625</p>
        </div>

        {/* Footer */}
        <Button className="w-full rounded-xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentModal;
