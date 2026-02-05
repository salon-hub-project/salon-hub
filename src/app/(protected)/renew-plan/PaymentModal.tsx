"use client";

import React from "react";
import { X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
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
            Amount: <span className="font-semibold">{amount}</span>
          </p>
        </div>

        {/* QR */}
        <div className="flex justify-center my-6">
          <div className="rounded-2xl border p-4">
            <QRCodeCanvas
              value={`SALONHUB_PAYMENT_${amount}`}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground mb-4">
          This is a dummy QR code for demo purposes only.
        </p>

        <Button className="w-full rounded-xl" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentModal;
