"use client";
import { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

import { categoryApi } from '../../../services/category.api';

// ... (existing imports)

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  service?: Service | null;
  categories: string[]; // Keeping prop for backward compatibility but will prefer fetched data
  categoriesWithIds?: Array<{ id: string; name: string }>;
}

const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  categories: initialCategories, // Rename prop to initialCategories
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Helper function to convert category ID to name
  const getCategoryNameById = (categoryId: string): string => {
    if (categoriesWithIds) {
      const category = categoriesWithIds.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    }
    return categoryId;
  };

  useEffect(() => {
    const loadCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const response = await categoryApi.getAllCategories({ page: 1, limit: 100 });
            // Handle various response structures safely
            const data = response.data || response || [];
            if (Array.isArray(data)) {
                const names = data.map((cat: any) => cat.name);
                setFetchedCategories(names);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setFetchedCategories(initialCategories); // Fallback
        } finally {
            setIsLoadingCategories(false);
        }
    };

    if (isOpen) {
        loadCategories();
    }
  }, [isOpen, initialCategories]);

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

  // Logic to determine which categories to show
  const visibleCategories = showAllCategories 
    ? fetchedCategories 
    : fetchedCategories.filter(cat => cat.toLowerCase().includes(formData.category.toLowerCase()));

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

          <div className="relative z-[60]">
            <div className="relative">
              <Input
                label="Category"
                type="text"
                placeholder="e.g., Hair, Nail Care, Skin Care"
                className="pr-10 selection:bg-primary/20 selection:text-foreground"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setIsCategoryDropdownOpen(true);
                  setShowAllCategories(false); // Typing activates filtering
                }}
                onFocus={() => {
                   setIsCategoryDropdownOpen(true);
                   // showAllCategories state remains whatever it was? 
                   // Or maybe default to false (filtering) if there is text?
                   // Usually focus doesn't imply "show all" if there is text.
                }}
                error={errors.category}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted text-muted-foreground"
                onClick={() => {
                     // Toggle logic
                     if (isCategoryDropdownOpen) {
                         setIsCategoryDropdownOpen(false);
                     } else {
                         setIsCategoryDropdownOpen(true);
                         setShowAllCategories(true); // Explicitly show all when opening via chevron
                     }
                }}
              >
                <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {isCategoryDropdownOpen && (
              <div 
              // className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
              className="
    absolute z-[120] w-full mt-2
    bg-card text-foreground
    border border-border
    rounded-lg
    shadow-xl
    max-h-60 overflow-y-auto
    ring-1 ring-black/5
  "
              >
                {isLoadingCategories ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground bg-card">Loading...</div>
                ) : visibleCategories.length > 0 ? (
                  visibleCategories
                    .map((cat) => (
                      <div
                        key={cat}
                        // className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                        className="
  px-3 py-2 text-sm
  cursor-pointer
  hover:bg-muted
  transition-colors
"

                        onClick={() => {
                          setFormData({ ...formData, category: cat });
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        {cat}
                      </div>
                    ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No categories found</div>
                )}
                {!isLoadingCategories && !showAllCategories && visibleCategories.length === 0 && formData.category && (
                   <div className="px-3 py-2 text-sm text-muted-foreground bg-card">
                    Create "{formData.category}"
                   </div>
                )}
              </div>
            )}
            {isCategoryDropdownOpen && (
              <div 
                className="fixed inset-0 z-[110]"
                onClick={() => setIsCategoryDropdownOpen(false)}
              />
            )}
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