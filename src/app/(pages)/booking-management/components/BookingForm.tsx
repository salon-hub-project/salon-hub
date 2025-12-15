"use client"
import { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Customer, Service, Staff, BookingFormData } from '../types';

interface BookingFormProps {
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  selectedDate?: Date;
  selectedTime?: string;
  onSubmit: (data: BookingFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookingForm = ({
  customers,
  services,
  staff,
  selectedDate,
  selectedTime,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    customerId: '',
    serviceId: '',
    staffId: '',
    date: selectedDate || new Date(),
    startTime: selectedTime || '',
    notes: '',
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setFormData((prev) => ({ ...prev, startTime: selectedTime }));
    }
  }, [selectedTime]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
    setFormData((prev) => ({ ...prev, serviceId }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }
    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a service';
    }
    if (!formData.staffId) {
      newErrors.staffId = 'Please select a staff member';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.name} - ${customer.phone}`,
  }));

  const serviceOptions = services
    .filter((service) => service.isActive)
    .map((service) => ({
      value: service.id,
      label: `${service.name} - $${service.price} (${service.duration} min)`,
    }));

  const staffOptions = staff
    .filter((member) => member.isAvailable)
    .map((member) => ({
      value: member.id,
      label: member.name,
    }));

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` },
    ];
  }).flat();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">New Booking</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Customer"
          placeholder="Search customer..."
          options={customerOptions}
          value={formData.customerId}
          onChange={(value) => setFormData((prev) => ({ ...prev, customerId: value as string }))}
          searchable
          required
          error={errors.customerId}
        />

        <Select
          label="Service"
          placeholder="Select service..."
          options={serviceOptions}
          value={formData.serviceId}
          onChange={(value) => handleServiceChange(value as string)}
          searchable
          required
          error={errors.serviceId}
        />

        {selectedService && (
          <div className="p-3 bg-muted rounded-md space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium text-foreground">{selectedService.duration} minutes</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium text-foreground">${selectedService.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium text-foreground">{selectedService.category}</span>
            </div>
          </div>
        )}

        <Input
          type="date"
          label="Date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }))
          }
          required
        />

        <Select
          label="Time"
          placeholder="Select time..."
          options={timeSlots}
          value={formData.startTime}
          onChange={(value) => setFormData((prev) => ({ ...prev, startTime: value as string }))}
          searchable
          required
          error={errors.startTime}
        />

        <Select
          label="Staff Member"
          placeholder="Select staff..."
          options={staffOptions}
          value={formData.staffId}
          onChange={(value) => setFormData((prev) => ({ ...prev, staffId: value as string }))}
          searchable
          required
          error={errors.staffId}
        />

        <Input
          type="text"
          label="Notes (Optional)"
          placeholder="Add any special requirements..."
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />

        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" variant="default" fullWidth loading={isLoading}>
            Create Booking
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;