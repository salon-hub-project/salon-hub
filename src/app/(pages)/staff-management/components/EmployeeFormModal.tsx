"use client";

import { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Employee, EmployeeFormData, Service } from '../types';

interface EmployeeFormModalProps {
  employee: Employee | null;
  services: Service[];
  onClose: () => void;
  onSave: (data: EmployeeFormData) => void;
}

const EmployeeFormModal = ({ employee, services, onClose, onSave }: EmployeeFormModalProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    role: '',
    phone: '',
    email: '',
    commissionRate: 0,
    assignedServices: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        commissionRate: employee.commissionRate,
        assignedServices: employee.assignedServices,
        availability: employee.availability,
      });
    }
  }, [employee]);

  const roleOptions = [
    { value: 'Manager', label: 'Manager' },
    { value: 'Stylist', label: 'Stylist' },
    { value: 'Colorist', label: 'Colorist' },
    { value: 'Nail Technician', label: 'Nail Technician' },
    { value: 'Receptionist', label: 'Receptionist' },
  ];

  const serviceOptions = services.map(service => ({
    value: service.name,
    label: service.name,
    description: service.category,
  }));

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = 'Commission rate must be between 0 and 100';
    }

    if (formData.assignedServices.length === 0) {
      newErrors.assignedServices = 'At least one service must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleAvailabilityChange = (day: keyof typeof formData.availability, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: checked,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter employee name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <Select
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value as string })}
              error={errors.role}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="employee@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              label="Commission Rate (%)"
              type="number"
              placeholder="0"
              value={formData.commissionRate}
              onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
              error={errors.commissionRate}
              required
            />
          </div>

          <div>
            <Select
              label="Assigned Services"
              description="Select services this employee can perform"
              placeholder="Select services"
              options={serviceOptions}
              value={formData.assignedServices}
              onChange={(value) => setFormData({ ...formData, assignedServices: value as string[] })}
              error={errors.assignedServices}
              multiple
              searchable
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Working Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(formData.availability).map(([day, isWorking]) => (
                <Checkbox
                  key={day}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  checked={isWorking}
                  onChange={(e) => handleAvailabilityChange(day as keyof typeof formData.availability, e.target.checked)}
                />
              ))}
            </div>
          </div>

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
              iconName="Save"
              iconPosition="left"
              fullWidth
            >
              {employee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;