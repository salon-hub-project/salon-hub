"use client";
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ComboOffer, ComboFormData } from '../types';

interface ComboFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComboFormData) => void;
  combo: ComboOffer | null;
  availableServices: { id: string; name: string; duration: number; price: number }[];
}

const ComboFormModal: React.FC<ComboFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  combo,
  availableServices,
}) => {
  const [formData, setFormData] = useState<ComboFormData>({
    name: '',
    description: '',
    services: [],
    discountedPrice: 0,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minBookingRequirement: undefined,
    customerEligibility: 'all',
    staffCommissionRate: 15,
  });

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (combo) {
      setFormData({
        name: combo.name,
        description: combo.description,
        services: combo.services,
        discountedPrice: combo.discountedPrice,
        validFrom: combo.validFrom,
        validUntil: combo.validUntil,
        minBookingRequirement: combo.minBookingRequirement,
        customerEligibility: combo.customerEligibility,
        staffCommissionRate: combo.staffCommissionRate,
      });
      setSelectedServiceIds(combo.services.map(s => s.id));
    } else {
      resetForm();
    }
  }, [combo, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      services: [],
      discountedPrice: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      minBookingRequirement: undefined,
      customerEligibility: 'all',
      staffCommissionRate: 15,
    });
    setSelectedServiceIds([]);
    setErrors({});
  };

  const calculateOriginalPrice = () => {
    return formData.services.reduce((sum, service) => sum + service.originalPrice, 0);
  };

  const calculateSavings = () => {
    const original = calculateOriginalPrice();
    if (original === 0) return 0;
    return ((original - formData.discountedPrice) / original) * 100;
  };

  const handleServiceToggle = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;

    if (selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
      setFormData({
        ...formData,
        services: formData.services.filter(s => s.id !== serviceId),
      });
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
      setFormData({
        ...formData,
        services: [
          ...formData.services,
          {
            id: service.id,
            name: service.name,
            duration: service.duration,
            originalPrice: service.price,
          },
        ],
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Combo name is required';
    }

    if (formData.services.length < 2) {
      newErrors.services = 'Please select at least 2 services';
    }

    if (formData.discountedPrice <= 0) {
      newErrors.discountedPrice = 'Price must be greater than 0';
    }

    const originalPrice = calculateOriginalPrice();
    if (formData.discountedPrice >= originalPrice) {
      newErrors.discountedPrice = 'Discounted price must be less than original price';
    }

    if (new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      newErrors.validUntil = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  const originalPrice = calculateOriginalPrice();
  const savingsPercentage = calculateSavings();

  const eligibilityOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'new', label: 'New Customers Only' },
    { value: 'existing', label: 'Existing Customers' },
    { value: 'vip', label: 'VIP Members' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {combo ? 'Edit Combo Offer' : 'Create New Combo Offer'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Input
                label="Combo Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="e.g., Hair & Nail Package"
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  rows={3}
                  placeholder="Describe your combo offer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Services * (min. 2)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                  {availableServices.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{service.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        INR {service.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-xs text-red-600 mt-1">{errors.services}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valid From *"
                  type="date"
                  value={formData.validFrom.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: new Date(e.target.value) })
                  }
                />
                <Input
                  label="Valid Until *"
                  type="date"
                  value={formData.validUntil.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: new Date(e.target.value) })
                  }
                  error={errors.validUntil}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Pricing Calculator</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Price:</span>
                    <span className="font-medium text-foreground">
                      INR {originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discounted Price:</span>
                    <span className="font-bold text-lg text-primary">
                      INR {formData.discountedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Customer Saves:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">
                        INR {(originalPrice - formData.discountedPrice).toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {savingsPercentage.toFixed(0)}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Input
                label="Combo Price *"
                type="number"
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) || 0 })
                }
                error={errors.discountedPrice}
                placeholder="0.00"
                step="0.01"
              />

              <Select
                label="Customer Eligibility"
                value={formData.customerEligibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerEligibility: e.target.value as 'all' | 'new' | 'existing' | 'vip',
                  })
                }
                options={eligibilityOptions}
              />

              <Input
                label="Minimum Bookings (Optional)"
                type="number"
                value={formData.minBookingRequirement || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minBookingRequirement: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="e.g., 5"
              />

              <Input
                label="Staff Commission Rate (%)"
                type="number"
                value={formData.staffCommissionRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    staffCommissionRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="15"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="default" type="submit">
              {combo ? 'Update Combo' : 'Create Combo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComboFormModal;