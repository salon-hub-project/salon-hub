"use client";
import { useState } from 'react';
import { Service } from '../types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface ServiceMobileCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onToggleStatus: (serviceId: string) => void;
  onTogglePopular: (serviceId: string) => void;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  categories?: Array<{ id: string; name: string }>; // Optional: for ID to name conversion
}

const ServiceMobileCard = ({
  service,
  onEdit,
  onDelete,
  onToggleStatus,
  onTogglePopular,
  isSelected,
  onSelect,
  categories,
}: ServiceMobileCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Helper function to convert category ID to name
  const getCategoryName = (categoryId: string): string => {
    if (categories) {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    }
    return categoryId;
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(service.id);
      setDeleteConfirm(false);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };
  const normalizeDuration = (duration: number): number => {
    // If duration is small, treat it as hours → convert to minutes
    return duration <= 10 ? duration * 60 : duration;
  };
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };
  console.log(service.duration,"duration");
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-md">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 mt-1 rounded border-border"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {service.name}
                </h3>
                {service.isPopular && (
                  <Icon name="Star" size={16} className="text-warning flex-shrink-0" />
                )}
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
                {getCategoryName(service.category)}
              </span>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-smooth flex-shrink-0"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <Icon
                name={expanded ? 'ChevronUp' : 'ChevronDown'}
                size={20}
                className="text-muted-foreground"
              />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-sm text-foreground">
                {/* {formatDuration(service.duration)} */}
                {formatDuration(normalizeDuration(service.duration))}

              </span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="IndianRupee" size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {formatPrice(service.price)}
              </span>
            </div>
          </div>

          {expanded && service.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {service.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePopular(service.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${
                service.isPopular
                  ? 'bg-warning bg-opacity-10 text-warning' :'bg-muted text-muted-foreground'
              }`}
            >
              <Icon name="Star" size={14} />
              <span>{service.isPopular ? 'Popular' : 'Mark Popular'}</span>
            </button>

            <button
              onClick={() => onToggleStatus(service.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${
                service.isActive
                  ? 'bg-success bg-opacity-10 text-success' :'bg-muted text-muted-foreground'
              }`}
            >
              <Icon name={service.isActive ? 'CheckCircle' : 'XCircle'} size={14} />
              <span>{service.isActive ? 'Active' : 'Inactive'}</span>
            </button>
          </div>

          {expanded && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(service)}
                iconName="Edit"
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                Edit
              </Button>
              <Button
                variant={deleteConfirm ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleDelete}
                iconName={deleteConfirm ? 'AlertTriangle' : 'Trash2'}
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                {deleteConfirm ? 'Confirm' : 'Delete'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceMobileCard;