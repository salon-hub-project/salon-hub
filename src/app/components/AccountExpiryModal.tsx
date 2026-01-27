"use client";

import React from "react";
import Button from "./ui/Button";
import { AlertCircle } from "lucide-react";

interface AccountExpiryModalProps {
  isOpen: boolean;
  onRenew: () => void;
}

const AccountExpiryModal: React.FC<AccountExpiryModalProps> = ({ isOpen, onRenew }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-border flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-foreground">Session Expired</h2>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Your account has expired. Please renew your plan to continue accessing your salon dashboard and management tools.
        </p>

        <div className="w-full space-y-4">
          <Button 
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-all transform hover:scale-[1.02]"
            onClick={onRenew}
          >
            Renew Now
          </Button>
          
          <p className="text-sm text-muted-foreground italic">
            Need help? Contact support or your account manager.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountExpiryModal;
