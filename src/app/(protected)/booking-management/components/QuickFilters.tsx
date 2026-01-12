import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BookingFilters, Staff, Service } from '../types';

interface QuickFiltersProps {
  filters: BookingFilters;
  staff: Staff[];
  services: Service[];
  onFiltersChange: (filters: BookingFilters) => void;
  onClearFilters: () => void;
}

const QuickFilters = ({
  filters,
  staff,
  services,
  onFiltersChange,
  onClearFilters,
}: QuickFiltersProps) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    // { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    // { value: 'cancelled', label: 'Cancelled' },
  ];

  const staffOptions = [
    { value: '', label: 'All Staff' },
    ...staff.map((member) => ({
      value: member.id,
      label: member.name,
    })),
  ];

  const serviceOptions = [
    { value: '', label: 'All Services' },
    ...services.map((service) => ({
      value: service.id,
      label: service.name,
    })),
  ];

  const hasActiveFilters =
    filters.status || filters.staffId || filters.serviceId || filters.searchQuery;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={16} />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(value) =>
            onFiltersChange({ ...filters, status: value as any })
          }
        />

        <Select
          label="Staff Member"
          options={staffOptions}
          value={filters.staffId || ''}
          onChange={(value) =>
            onFiltersChange({ ...filters, staffId: value as string })
          }
          searchable
        />

        <Select
          label="Service"
          options={serviceOptions}
          value={filters.serviceId || ''}
          onChange={(value) =>
            onFiltersChange({ ...filters, serviceId: value as string })
          }
          searchable
        />
      </div>
    </div>
  );
};

export default QuickFilters;