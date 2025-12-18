"use client";
import { useState, useEffect } from 'react';
import { Service, ServiceFormData, ServiceFilters, ServiceCategory, BulkOperation } from './types';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import ServiceStats from './components/ServiceStats';
import ServiceFiltersComponent from './components/ServiceFilters';
import ServiceTable from './components/ServiceTable';
import ServiceMobileCard from './components/ServiceMobileCard';
import ServiceFormModal from './components/ServiceFormModal';
import BulkOperationsBar from './components/BulkOperationsBar';
import CategoryManager from './components/CategoryManager';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAppSelector } from '../../store/hooks';

const ServiceManagement = () => {
  const authUser = useAppSelector((state) => state.auth.user);
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Classic Haircut',
      category: 'Hair Services',
      duration: 45,
      price: 35.00,
      isPopular: true,
      isActive: true,
      description: 'Professional haircut with styling consultation',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Hair Coloring',
      category: 'Hair Services',
      duration: 120,
      price: 85.00,
      isPopular: true,
      isActive: true,
      description: 'Full hair coloring service with premium products',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      name: 'Manicure',
      category: 'Nail Services',
      duration: 30,
      price: 25.00,
      isPopular: false,
      isActive: true,
      description: 'Classic manicure with nail shaping and polish',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '4',
      name: 'Pedicure',
      category: 'Nail Services',
      duration: 45,
      price: 35.00,
      isPopular: false,
      isActive: true,
      description: 'Relaxing pedicure with foot massage',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '5',
      name: 'Facial Treatment',
      category: 'Skin Care',
      duration: 60,
      price: 65.00,
      isPopular: true,
      isActive: true,
      description: 'Deep cleansing facial with moisturizing treatment',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '6',
      name: 'Waxing',
      category: 'Hair Removal',
      duration: 30,
      price: 30.00,
      isPopular: false,
      isActive: true,
      description: 'Professional waxing service',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '7',
      name: 'Makeup Application',
      category: 'Makeup',
      duration: 60,
      price: 75.00,
      isPopular: false,
      isActive: false,
      description: 'Professional makeup for special occasions',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '8',
      name: 'Bridal Package',
      category: 'Special Packages',
      duration: 180,
      price: 250.00,
      isPopular: true,
      isActive: true,
      description: 'Complete bridal beauty package',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ]);

  const [categories, setCategories] = useState<ServiceCategory[]>([
    { id: '1', name: 'Hair Services', order: 0, serviceCount: 2 },
    { id: '2', name: 'Nail Services', order: 1, serviceCount: 2 },
    { id: '3', name: 'Skin Care', order: 2, serviceCount: 1 },
    { id: '4', name: 'Hair Removal', order: 3, serviceCount: 1 },
    { id: '5', name: 'Makeup', order: 4, serviceCount: 1 },
    { id: '6', name: 'Special Packages', order: 5, serviceCount: 1 },
  ]);

  const [filters, setFilters] = useState<ServiceFilters>({
    category: 'all',
    status: 'all',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredServices = services.filter(service => {
    if (filters.category !== 'all' && service.category !== filters.category) {
      return false;
    }

    if (filters.status === 'active' && !service.isActive) {
      return false;
    }

    if (filters.status === 'inactive' && service.isActive) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleAddService = (data: ServiceFormData) => {
    const newService: Service = {
      id: Date.now().toString(),
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setServices([...services, newService]);
    updateCategoryCount(data.category, 1);
  };

  const handleEditService = (data: ServiceFormData) => {
    if (!editingService) return;

    const oldCategory = editingService.category;
    const newCategory = data.category;

    setServices(services.map(service =>
      service.id === editingService.id
        ? { ...service, ...data, updatedAt: new Date() }
        : service
    ));

    if (oldCategory !== newCategory) {
      updateCategoryCount(oldCategory, -1);
      updateCategoryCount(newCategory, 1);
    }

    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setServices(services.filter(s => s.id !== serviceId));
      updateCategoryCount(service.category, -1);
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const handleToggleStatus = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, isActive: !service.isActive, updatedAt: new Date() }
        : service
    ));
  };

  const handleTogglePopular = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, isPopular: !service.isPopular, updatedAt: new Date() }
        : service
    ));
  };

  const handleSelectService = (serviceId: string, selected: boolean) => {
    if (selected) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const handleBulkOperation = (operation: BulkOperation) => {
    const updatedServices = services.map(service => {
      if (selectedServices.includes(service.id)) {
        switch (operation.type) {
          case 'price':
            return { ...service, price: operation.value as number, updatedAt: new Date() };
          case 'status':
            return { ...service, isActive: operation.value as boolean, updatedAt: new Date() };
          case 'category':
            const oldCategory = service.category;
            const newCategory = operation.value as string;
            if (oldCategory !== newCategory) {
              updateCategoryCount(oldCategory, -1);
              updateCategoryCount(newCategory, 1);
            }
            return { ...service, category: newCategory, updatedAt: new Date() };
          default:
            return service;
        }
      }
      return service;
    });

    setServices(updatedServices);
    setSelectedServices([]);
  };

  const handleAddCategory = (name: string) => {
    const newCategory: ServiceCategory = {
      id: Date.now().toString(),
      name,
      order: categories.length,
      serviceCount: 0,
    };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.serviceCount === 0) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const handleReorderCategories = (newCategories: ServiceCategory[]) => {
    setCategories(newCategories);
  };

  const updateCategoryCount = (categoryName: string, delta: number) => {
    setCategories(categories.map(cat =>
      cat.name === categoryName
        ? { ...cat, serviceCount: Math.max(0, cat.serviceCount + delta) }
        : cat
    ));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingService(null);
  };

  const handleFormSubmit = (data: ServiceFormData) => {
    if (editingService) {
      handleEditService(data);
    } else {
      handleAddService(data);
    }
  };

  const user = {
    name: 'Sarah Johnson',
    email: authUser?.email || 'sarah@glamoursalon.com',
    role: authUser?.role || 'salon_owner',
    salonName: 'Glamour Salon & Spa',
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} />
      <Header user={user} notifications={3} />

      <main className="lg:ml-sidebar pt-header pb-safe lg:pb-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Service Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your salon services, pricing, and categories
              </p>
            </div>

            <Button
              variant="default"
              onClick={handleOpenAddModal}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add New Service
            </Button>
          </div>

          <ServiceStats
            services={services}
            categories={categories.map(c => c.name)}
          />

          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategories={handleReorderCategories}
          />

          <ServiceFiltersComponent
            filters={filters}
            categories={categories.map(c => c.name)}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />

          <BulkOperationsBar
            selectedCount={selectedServices.length}
            onBulkOperation={handleBulkOperation}
            onClearSelection={() => setSelectedServices([])}
            categories={categories.map(c => c.name)}
          />

          {isMobileView ? (
            <div className="space-y-4 pb-bottom-nav">
              {filteredServices.map(service => (
                <ServiceMobileCard
                  key={service.id}
                  service={service}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteService}
                  onToggleStatus={handleToggleStatus}
                  onTogglePopular={handleTogglePopular}
                  isSelected={selectedServices.includes(service.id)}
                  onSelect={(selected) => handleSelectService(service.id, selected)}
                />
              ))}
            </div>
          ) : (
            <ServiceTable
              services={filteredServices}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteService}
              onToggleStatus={handleToggleStatus}
              onTogglePopular={handleTogglePopular}
              onSelectService={handleSelectService}
              selectedServices={selectedServices}
            />
          )}

          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg">
              <Icon name="Scissors" size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No services found
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                {filters.searchQuery || filters.category !== 'all' || filters.status !== 'all' ?'Try adjusting your filters to see more results' :'Get started by adding your first service'}
              </p>
              {!filters.searchQuery && filters.category === 'all' && filters.status === 'all' && (
                <Button
                  variant="default"
                  onClick={handleOpenAddModal}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Your First Service
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav userRole={user.role} />

      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        service={editingService}
        categories={categories.map(c => c.name)}
      />
    </div>
  );
};

export default ServiceManagement;