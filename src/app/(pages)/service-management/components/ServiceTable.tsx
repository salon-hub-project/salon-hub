"use client";
import { useState } from 'react';
import { Service } from '../types';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onToggleStatus: (serviceId: string) => void;
  onTogglePopular: (serviceId: string) => void;
  onSelectService: (serviceId: string, selected: boolean) => void;
  selectedServices: string[];
}

const ServiceTable = ({
  services,
  onEdit,
  onDelete,
  onToggleStatus,
  onTogglePopular,
  onSelectService,
  selectedServices,
}: ServiceTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (serviceId: string) => {
    if (deleteConfirm === serviceId) {
      onDelete(serviceId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(serviceId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatPrice = (price: number): string => {
    return `INR ${price.toFixed(2)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedServices.length === services.length && services.length > 0}
                  onChange={(e) => {
                    services.forEach(service => 
                      onSelectService(service.id, e.target.checked)
                    );
                  }}
                  className="w-4 h-4 rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Service Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Price
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                Popular
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-muted transition-smooth"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => onSelectService(service.id, e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {service.name}
                    </span>
                    {service.isPopular && (
                      <Icon name="Star" size={16} className="text-warning" />
                    )}
                  </div>
                  {service.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {service.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
                    {service.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {formatDuration(service.duration)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(service.price)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onTogglePopular(service.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-smooth"
                    aria-label={service.isPopular ? 'Remove from popular' : 'Mark as popular'}
                  >
                    <Icon
                      name={service.isPopular ? 'Star' : 'Star'}
                      size={18}
                      className={service.isPopular ? 'text-warning' : 'text-muted-foreground'}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggleStatus(service.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                      service.isActive
                        ? 'bg-success bg-opacity-10 text-success' :'bg-muted text-muted-foreground'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(service)}
                      iconName="Edit"
                      iconSize={16}
                    />
                    <Button
                      variant={deleteConfirm === service.id ? 'destructive' : 'ghost'}
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                      iconName={deleteConfirm === service.id ? 'AlertTriangle' : 'Trash2'}
                      iconSize={16}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="Scissors" size={48} className="text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No services found</p>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;