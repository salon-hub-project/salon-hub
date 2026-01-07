"use client";
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';


interface OTPVerificationModalProps {
  isOpen: boolean;
  mobileNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onClose: () => void;
  isVerifying: boolean;
}

const OTPVerificationModal = ({
  isOpen,
  mobileNumber,
  onVerify,
  onResend,
  onClose,
  isVerifying,
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  if (!isOpen) return null;

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    onVerify(otp);
  };

  const handleResend = () => {
    setResendTimer(60);
    onResend();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Verify Mobile Number</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
            <Icon name="MessageSquare" size={32} className="text-primary" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-medium text-foreground">{mobileNumber}</p>
            <p className="text-sm text-muted-foreground">via WhatsApp</p>
          </div>

          <Input
            label="Enter OTP"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
              setError('');
            }}
            error={error}
            maxLength={6}
            disabled={isVerifying}
          />

          <Button
            variant="default"
            fullWidth
            onClick={handleVerify}
            loading={isVerifying}
            disabled={isVerifying || otp.length !== 6}
          >
            Verify OTP
          </Button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in {resendTimer} seconds
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;