import Icon from "../../../components/AppIcon";

interface RegistrationHeaderProps {
  onBackClick?: () => void;
}

const RegistrationHeader = ({ onBackClick }: RegistrationHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-smooth"
            aria-label="Go back"
          >
            <Icon
              name="ArrowLeft"
              size={20}
              className="text-muted-foreground"
            />
          </button>
        )}
        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
          >
            <path
              d="M20 8C15.5817 8 12 11.5817 12 16C12 18.2091 13.7909 22 20 28C26.2091 22 28 18.2091 28 16C28 11.5817 24.4183 8 20 8Z"
              fill="white"
            />
            <circle cx="20" cy="16" r="3" fill="#2D5A4A" />
            <path
              d="M8 24C8 22.8954 8.89543 22 10 22H30C31.1046 22 32 22.8954 32 24V30C32 31.1046 31.1046 32 30 32H10C8.89543 32 8 31.1046 8 30V24Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Register Your Salon
      </h1>
      <p className="text-muted-foreground">
        Join SalonVala and start managing your salon digitally. Complete the
        registration form below to get started.
      </p>
    </div>
  );
};

export default RegistrationHeader;
