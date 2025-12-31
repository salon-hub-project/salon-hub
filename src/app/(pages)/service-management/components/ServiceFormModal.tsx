"use client";
import { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  service?: Service | null;
  categories: string[];
  categoriesWithIds?: Array<{ id: string; name: string }>; // Optional: for ID to name conversion
}

const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  categories,
  categoriesWithIds,
}: ServiceFormModalProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    category: '',
    duration: 30,
    price: 0,
    isPopular: false,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  // Helper function to convert category ID to name
  const getCategoryNameById = (categoryId: string): string => {
    if (categoriesWithIds) {
      const category = categoriesWithIds.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    }
    // If categoriesWithIds not provided, assume service.category is already a name
    return categoryId;
  };

  useEffect(() => {
    if (service) {
      // Convert category ID to name if categoriesWithIds is provided
      const categoryName = categoriesWithIds ? getCategoryNameById(service.category) : service.category;
      
      setFormData({
        name: service.name,
        category: categoryName,
        duration: service.duration,
        price: service.price,
        isPopular: service.isPopular,
        description: service.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        duration: 30,
        price: 0,
        isPopular: false,
        description: '',
      });
    }
    setErrors({});
  }, [service, isOpen, categoriesWithIds]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateForm();
    console.log(valid,"valid");
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  

  };

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Service Name"
            type="text"
            placeholder="e.g., Haircut, Manicure"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div>
            <Input
              label="Category"
              type="text"
              list="category-list"
              placeholder="e.g., Hair, Nail Care, Skin Care"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={errors.category}
              required
            />
            <datalist id="category-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Duration"
              options={durationOptions}
              value={formData.duration}
              onChange={(value) => setFormData({ ...formData, duration: value as number })}
              error={errors.duration}
              required
            />

            <Input
              label="Price"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              error={errors.price}
              required
            />
          </div>

          <Input
            label="Description (Optional)"
            type="text"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Checkbox
            label="Mark as Popular Service"
            description="Popular services will be highlighted to customers"
            checked={formData.isPopular}
            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
            >
              {service ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;