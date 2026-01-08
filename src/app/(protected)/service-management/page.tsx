"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Service, ServiceFormData, ServiceFilters, ServiceCategory, BulkOperation } from './types';
import ServiceStats from './components/ServiceStats';
import ServiceFiltersComponent from './components/ServiceFilters';
import ServiceTable from './components/ServiceTable';
import ServiceMobileCard from './components/ServiceMobileCard';
import ServiceFormModal from './components/ServiceFormModal';
import BulkOperationsBar from './components/BulkOperationsBar';
import CategoryManager from './components/CategoryManager';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { serviceApi, ServiceResponse } from '../../services/service.api';
import { categoryApi, CategoryResponse } from '../../services/category.api';

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  
  // Hardcoded default categories (matching API expected format)
  const defaultCategories: ServiceCategory[] = [
    { id: 'cat-hair', name: 'Hair', order: 0, serviceCount: 0 },
    { id: 'cat-nails', name: 'Nail Care', order: 1, serviceCount: 0 },
    { id: 'cat-skincare', name: 'Skin Care', order: 2, serviceCount: 0 },
  ];
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchingCategoriesRef = useRef(false);
  const fetchingServicesRef = useRef(false);
  const mountedRef = useRef(true);

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

  // Helper function to convert duration string to number (e.g., "45 minutes" -> 45)
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Helper function to convert number to duration string matching backend format
  const formatDuration = (duration: number): string => {
    // Map duration values to backend expected format
    const durationMap: Record<number, string> = {
      15: '15 minutes',
      30: '30 minutes',
      45: '45 minutes',
      60: '1 hour',
      90: '1.5 hours',
      120: '2 hours',
      180: '3 hours',
    };
    
    // Return mapped value if exists, otherwise format as minutes
    return durationMap[duration] || `${duration} minutes`;
  };

  // Helper function to get category ID from category name
  const getCategoryIdByName = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : categoryName; // Fallback to name if not found (for backward compatibility)
  };

  // Helper function to get category name from category ID
  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId; // Fallback to ID if not found (for backward compatibility)
  };

  // Helper function to map API response to Service type
  // const mapServiceResponseToService = (apiService: ServiceResponse): Service => {
  //   return {
  //     id: apiService._id,
  //     name: apiService.serviceName,
  //     category: apiService.category, // This is the category ID from API
  //     duration: parseDuration(apiService.duration),
  //     price: apiService.price,
  //     isPopular: apiService.markAsPopularService,
  //     isActive: apiService.isActive,
  //     description: apiService.description,
  //     createdAt: apiService.createdAt ? new Date(apiService.createdAt) : new Date(),
  //     updatedAt: apiService.updatedAt ? new Date(apiService.updatedAt) : new Date(),
  //   };
  // };
  const mapServiceResponseToService = (apiService: ServiceResponse): Service => {
    return {
      id: apiService._id,
      name: apiService.serviceName,
  
      // ✅ ALWAYS normalize category to ID (string)
      category:
        typeof apiService.category === 'object'
          ? ('_id' in (apiService.category as Record<string, unknown>) ? (apiService.category as { _id: string })._id : apiService.category)
          : apiService.category,
  
      duration: parseDuration(apiService.duration),
      price: apiService.price,
      isPopular: apiService.markAsPopularService,
      isActive: apiService.isActive,
      description: apiService.description,
      createdAt: apiService.createdAt ? new Date(apiService.createdAt) : new Date(),
      updatedAt: apiService.updatedAt ? new Date(apiService.updatedAt) : new Date(),
    };
  };
  
  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingCategoriesRef.current) return;
    
    fetchingCategoriesRef.current = true;
    try {
      const response = await categoryApi.getAllCategories({ page: 1, limit: 100 });
      const categoriesData = response.data || response || [];
      const mappedCategories: ServiceCategory[] = Array.isArray(categoriesData)
        ? categoriesData.map((cat: CategoryResponse, index: number) => ({
            id: cat._id,
            name: cat.name,
            order: index,
            serviceCount: 0,
          }))
        : [];
      
      if (mountedRef.current) {
        setCategories(mappedCategories);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error('Error fetching categories:', error);
        // Keep existing categories on error, or set defaults if empty
        setCategories(prevCategories => {
          if (prevCategories.length === 0) {
            return defaultCategories;
          }
          return prevCategories;
        });
      }
    } finally {
      fetchingCategoriesRef.current = false;
    }
  }, []);

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingServicesRef.current) return;
    
    fetchingServicesRef.current = true;
    try {
      setIsLoading(true);
      const params: any = {
        page: 1,
        limit: 100, // Fetch a large number to get all services
      };

      // Add filters to API call if they're not 'all'
      // Convert category name to ID for API call
      if (filters.category !== 'all') {
        params.category = getCategoryIdByName(filters.category);
      }
      if (filters.status !== 'all') {
        params.isActive = filters.status === 'active';
      }
      if (filters.searchQuery) {
        params.serviceName = filters.searchQuery;
      }

      const response = await serviceApi.getAllServices(params);
      // Handle different response formats: { data: [...] } or [...] directly
      const servicesData = Array.isArray(response) 
        ? response 
        : (response?.data || []);
      const mappedServices = Array.isArray(servicesData) 
        ? servicesData.map(mapServiceResponseToService)
        : [];

      if (!mountedRef.current) return;

      setServices(mappedServices);

      // Update categories based on fetched services
      // service.category is now an ID, so we count by ID
      const categoryMap = new Map<string, number>();
      mappedServices.forEach(service => {
        const categoryId =
          typeof service.category === "string" && service.category.trim()
            ? service.category.trim()
            : "";
      
        if (categoryId) {
          const count = categoryMap.get(categoryId) || 0;
          categoryMap.set(categoryId, count + 1);
        }
      });
      
      // Preserve existing categories and update their service counts
      setCategories(prevCategories => {
        // Update service counts for existing categories by matching IDs
        const updatedCategories = prevCategories.map(cat => {
          const serviceCount = categoryMap.get(cat.id) || 0;
          return {
            ...cat,
            serviceCount: serviceCount,
          };
        });
        
        // Return updated categories with service counts
        return updatedCategories;
      });
    } catch (error) {
      if (mountedRef.current) {
        console.error('Error fetching services:', error);
        // Keep existing services and categories on error
        // Only set defaults if categories are completely empty
        setCategories(prevCategories => {
          if (prevCategories.length === 0) {
            return defaultCategories;
          }
          return prevCategories;
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
      fetchingServicesRef.current = false;
    }
  }, [filters.category, filters.status, filters.searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    mountedRef.current = true;
    fetchCategories();
    
    return () => {
      mountedRef.current = false;
      fetchingCategoriesRef.current = false;
    };
  }, [fetchCategories]);

  // Fetch services on mount and when filters change
  useEffect(() => {
    mountedRef.current = true;
    fetchServices();
    
    return () => {
      mountedRef.current = false;
      fetchingServicesRef.current = false;
    };
  }, [fetchServices]);

  const filteredServices = services.filter(service => {
    // Convert filter category name to ID for comparison
    if (filters.category !== 'all') {
      const filterCategoryId = getCategoryIdByName(filters.category);
      if (service.category !== filterCategoryId) {
        return false;
      }
    }

    if (filters.status === 'active' && !service.isActive) {
      return false;
    }

    if (filters.status === 'inactive' && service.isActive) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      // Convert service category ID to name for search
      const categoryName = getCategoryNameById(service.category);
      return (
        service.name.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query) ||
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
        // Convert category IDs to names for sorting
        const categoryA = getCategoryNameById(a.category);
        const categoryB = getCategoryNameById(b.category);
        comparison = categoryA.localeCompare(categoryB);
        break;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleAddService = async (data: ServiceFormData) => {
    try {
      // Convert category name to category ID
      const categoryId = getCategoryIdByName(data.category);
      
      const payload = {
        serviceName: data.name,
        category: categoryId,
        duration: formatDuration(data.duration),
        price: data.price,
        isActive: true,
        markAsPopularService: data.isPopular,
        description: data.description || '',
      };

      await serviceApi.createService(payload);
      
      // Refresh services from API
      await fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      // Optionally show error message to user
    }
  };

  // const handleEditService = (data: ServiceFormData) => {
  //   if (!editingService) return;

  //   const oldCategory = editingService.category;
  //   const newCategory = data.category;

  //   setServices(services.map(service =>
  //     service.id === editingService.id
  //       ? { ...service, ...data, updatedAt: new Date() }
  //       : service
  //   ));

  //   if (oldCategory !== newCategory) {
  //     updateCategoryCount(oldCategory, -1);
  //     updateCategoryCount(newCategory, 1);
  //   }

  //   setEditingService(null);
  // };
  const handleEditService = async (data: ServiceFormData) => {
    if (!editingService) return;
  
    try {
      // Convert category name to category ID
      const categoryId = getCategoryIdByName(data.category);
      
      const payload = {
        serviceName: data.name,
        category: categoryId,
        duration: formatDuration(data.duration),
        price: data.price,
        isActive: data.isActive ?? editingService.isActive,
        markAsPopularService: data.isPopular,
        description: data.description || '',
      };
  
      await serviceApi.updateService(editingService.id, payload);
  
      // refresh from backend to stay in sync
      await fetchServices();
  
      setEditingService(null);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };
  
  // const handleDeleteService = (serviceId: string) => {
  //   const service = services.find(s => s.id === serviceId);
  //   if (service) {
  //     setServices(services.filter(s => s.id !== serviceId));
  //     updateCategoryCount(service.category, -1);
  //     setSelectedServices(selectedServices.filter(id => id !== serviceId));
  //   }
  // };
  // const handleDeleteService = async (serviceId: string) => {
  //   try {
  //     await serviceApi.deleteService(serviceId);
  
  //     const service = services.find(s => s.id === serviceId);
  //     if (service) {
  //       updateCategoryCount(service.category, -1);
  //     }
  
  //     setServices(prev => prev.filter(s => s.id !== serviceId));
  //     setSelectedServices(prev => prev.filter(id => id !== serviceId));
  //   } catch (error) {
  //     console.error('Error deleting service:', error);
  //   }
  // };
  const handleDeleteService = async (serviceId: string) => {
    try {
      await serviceApi.deleteService(serviceId);
  
      // ✅ ALWAYS re-sync from backend
      await fetchServices();
  
      // clear selection safely
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
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
            const oldCategoryId = service.category;
            // Convert category name to ID
            const newCategoryId = getCategoryIdByName(operation.value as string);
            if (oldCategoryId !== newCategoryId) {
              updateCategoryCount(oldCategoryId, -1);
              updateCategoryCount(newCategoryId, 1);
            }
            return { ...service, category: newCategoryId, updatedAt: new Date() };
          default:
            return service;
        }
      }
      return service;
    });

    setServices(updatedServices);
    setSelectedServices([]);
  };

  const handleAddCategory = async (name: string) => {
    // Refresh categories from API after adding
    await fetchCategories();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // Refresh categories from API after deleting
    await fetchCategories();
  };

  const handleReorderCategories = (newCategories: ServiceCategory[]) => {
    setCategories(newCategories);
  };

  const updateCategoryCount = (categoryId: string, delta: number) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, serviceCount: Math.max(0, cat.serviceCount + delta) }
        : cat
    ));
  };
  const handleUpdateCategory = async (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, name } : cat
      )
    );
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

  return (
    <>
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
            onUpdateCategory={handleUpdateCategory}
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg">
              <Icon name="Loader2" size={48} className="text-muted-foreground mb-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <>
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
                      categories={categories.map(c => ({ id: c.id, name: c.name }))}
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
                  categories={categories.map(c => ({ id: c.id, name: c.name }))}
                />
              )}

              {filteredServices.length === 0 && !isLoading && (
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
            </>
          )}
    </div>

    <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        service={editingService}
        categories={categories.map(c => c.name)}
        categoriesWithIds={categories.map(c => ({ id: c.id, name: c.name }))}
      />
    </>
  );
};

export default ServiceManagement;