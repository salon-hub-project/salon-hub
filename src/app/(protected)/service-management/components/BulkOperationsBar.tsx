"use client";
import { useState } from 'react';
import { BulkOperation } from '../types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

interface BulkOperationsBarProps {
  selectedCount: number;
  onBulkOperation: (operation: BulkOperation) => void;
  onClearSelection: () => void;
  categories: string[];
}

const BulkOperationsBar = ({
  selectedCount,
  onBulkOperation,
  onClearSelection,
  categories,
}: BulkOperationsBarProps) => {
  const [operationType, setOperationType] = useState<'price' | 'status' | 'category'>('status');
  const [priceValue, setPriceValue] = useState<number>(0);
  const [statusValue, setStatusValue] = useState<boolean>(true);
  const [categoryValue, setCategoryValue] = useState<string>('');

  const handleApply = () => {
    let value: number | boolean | string;
    
    switch (operationType) {
      case 'price':
        value = priceValue;
        break;
      case 'status':
        value = statusValue;
        break;
      case 'category':
        value = categoryValue;
        break;
    }

    onBulkOperation({
      type: operationType,
      value,
      serviceIds: [],
    });
  };

  const operationOptions = [
    { value: 'status', label: 'Change Status' },
    { value: 'price', label: 'Update Price' },
    { value: 'category', label: 'Change Category' },
  ];

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: cat,
  }));

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary bg-opacity-10 border border-primary rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full lg:w-auto">
          <Select
            options={operationOptions}
            value={operationType}
            onChange={(value) => setOperationType(value as 'price' | 'status' | 'category')}
            placeholder="Select operation"
          />

          {operationType === 'price' && (
            <Input
              type="number"
              placeholder="New price"
              value={priceValue}
              onChange={(e) => setPriceValue(parseFloat(e.target.value))}
            />
          )}

          {operationType === 'status' && (
            <Select
              options={statusOptions}
              value={statusValue.toString()} // Convert boolean to string
              onChange={(value) => setStatusValue(value === 'true')} // Convert string back to boolean
              placeholder="Select status"
            />
          )}

          {operationType === 'category' && (
            <Select
              options={categoryOptions}
              value={categoryValue}
              onChange={(value) => setCategoryValue(value as string)}
              placeholder="Select category"
            />
          )}

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              iconName="Check"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Apply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsBar;