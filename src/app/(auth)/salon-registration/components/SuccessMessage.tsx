import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

interface SuccessMessageProps {
  salonName: string;
  registrationId: string;
  onContinue: () => void;
}

const SuccessMessage = ({
  salonName,
  registrationId,
  onContinue,
}: SuccessMessageProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mx-auto">
        <Icon name="CheckCircle2" size={48} className="text-success" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Registration Successful!
        </h2>
        <p className="text-muted-foreground">
          Thank you for registering{" "}
          <span className="font-medium text-foreground">{salonName}</span> with
          Salonvala
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Icon name="Clock" size={20} className="text-accent mt-0.5" />
          <div className="text-left space-y-1">
            <h3 className="font-medium text-foreground">Pending Approval</h3>
            <p className="text-sm text-muted-foreground">
              Your registration is currently under review by our Super Admin
              team. This process typically takes 24-48 hours.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="Mail" size={20} className="text-accent mt-0.5" />
          <div className="text-left space-y-1">
            <h3 className="font-medium text-foreground">Email Notification</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive an email notification once your salon has been
              approved and is ready to use.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="Key" size={20} className="text-accent mt-0.5" />
          <div className="text-left space-y-1">
            <h3 className="font-medium text-foreground">Registration ID</h3>
            <p className="text-sm text-muted-foreground">
              Keep this ID for reference:{" "}
              <span className="font-mono font-medium text-foreground">
                {registrationId}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="default" fullWidth onClick={onContinue}>
          Continue to Login
        </Button>
        <p className="text-sm text-muted-foreground">
          Need help? Contact our support team at{" "}
          <a
            href="mailto:support@salonvala.com"
            className="text-primary hover:underline"
          >
            support@salonvala.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;
