import { PasswordStrength } from '../types';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  password: string;
}

const PasswordStrengthIndicator = ({ strength, password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>
          {strength.label}
        </span>
      </div>
      {strength.suggestions.length > 0 && (
        <ul className="space-y-1">
          {strength.suggestions.map((suggestion, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-accent mt-0.5">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;