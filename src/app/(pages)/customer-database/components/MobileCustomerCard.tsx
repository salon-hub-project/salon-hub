import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Customer, CustomerTag } from '../types';

interface MobileCustomerCardProps {
  customer: Customer;
  onSelect: (customer: Customer) => void;
}

const MobileCustomerCard = ({ customer, onSelect }: MobileCustomerCardProps) => {
  const getTagColor = (tag: CustomerTag): string => {
    const colors: Record<CustomerTag, string> = {
      VIP: 'bg-accent text-accent-foreground',
      New: 'bg-primary text-primary-foreground',
      Frequent: 'bg-success text-success-foreground',
      Inactive: 'bg-muted text-muted-foreground',
    };
    return colors[tag];
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      onClick={() => onSelect(customer)}
      className="bg-card rounded-lg border border-border p-4 hover:bg-muted/30 transition-smooth cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {customer.avatar ? (
            <Image
              src={customer.avatar}
              alt={`${customer.name} profile photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground mb-1 truncate">
            {customer.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Icon name="Phone" size={14} />
            <span>{customer.phone}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {customer.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(customer);
          }}
          className="p-2 rounded-md hover:bg-muted transition-smooth"
          aria-label="View details"
        >
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Visits</div>
          <div className="text-sm font-semibold text-foreground">{customer.totalVisits}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Spent</div>
          <div className="text-sm font-semibold text-foreground">
            INR {customer.totalSpent.toFixed(0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Last Visit</div>
          <div className="text-xs font-medium text-foreground">{formatDate(customer.lastVisit)}</div>
        </div>
      </div>
    </div>
  );
};

export default MobileCustomerCard;