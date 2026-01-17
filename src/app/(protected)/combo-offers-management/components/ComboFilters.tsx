import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ComboFilters } from '../types';

interface ComboFiltersProps {
  filters: ComboFilters;
  onFilterChange: (filters: ComboFilters) => void;
  onReset: () => void;
}

const ComboFiltersComponent: React.FC<ComboFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleInputChange = (field: keyof ComboFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' },
  ];

  const sortByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'savings', label: 'Savings %' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'revenue', label: 'Revenue' },
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            label="Search Combos"
            placeholder="Search by name or description..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            iconName="Search"
            iconPosition="left"
          />
        </div>

        {/* <Select
          label="Status"
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={statusOptions}
        />

        <Select
          label="Sort By"
          value={filters.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          options={sortByOptions}
        />

        <Select
          label="Order"
          value={filters.sortOrder}
          onChange={(e) => handleInputChange('sortOrder', e.target.value)}
          options={sortOrderOptions}
        /> */}
      </div>

      <div className="flex justify-end mt-4">
        {/* <Button
          variant="secondary"
          onClick={onReset}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Reset Filters
        </Button> */}
      </div>
    </div>
  );
};

export default ComboFiltersComponent;