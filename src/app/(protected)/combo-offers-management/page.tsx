"use client";
import { useState, useEffect } from 'react';
import { ComboOffer, ComboFormData, ComboFilters, ComboService } from './types';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import ComboStats from './components/ComboStats';
import ComboFiltersComponent from './components/ComboFilters';
import ComboTable from './components/ComboTable';
import ComboMobileCard from './components/ComboMobileCard';
import ComboFormModal from './components/ComboFormModal';
import ComboPreviewModal from './components/ComboPreviewModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAppSelector } from '../../store/hooks';
import AuthGuard from '../../components/AuthGuard';
import { comboApi } from '../../services/combo.api';
import { serviceApi } from '../../services/service.api';
import { showToast } from '../../components/ui/toast';

const ComboOffersManagement = () => {
  const authUser = useAppSelector((state) => state.auth.user);
  
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<ComboFilters>({
    status: 'all',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboOffer | null>(null);
  const [previewCombo, setPreviewCombo] = useState<ComboOffer | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch services first to map names/prices
      const servicesRes = await serviceApi.getAllServices({ limit: 100 });
      const servicesData = servicesRes?.data || [];
      
      const mappedServices = servicesData.map((s: any) => ({
        id: s._id,
        name: s.serviceName,
        duration: parseInt(s.duration) || 0, // Handle "45 minutes" vs number
        price: s.price
      }));
      
      setAvailableServices(mappedServices);

      const combosRes = await comboApi.getAllComboOffers();
      const combosData = combosRes?.data || []; // Adjust based on actual API response structure
     
      // Transform API data to UI model
      const mappedCombos: ComboOffer[] = combosData.map((c: any) => {
        // Map service IDs to full service objects
        const comboServices: ComboService[] = c.services.map((serviceId: string) => {
          const found = mappedServices.find((s: any) => s.id === serviceId);
          return found ? {
            id: found.id,
            name: found.name,
            duration: found.duration,
            originalPrice: found.price
          } : null;
        }).filter(Boolean);

        return {
            id: c._id || c.id,
            name: c.name,
            description: c.description,
            services: comboServices,
            originalPrice: c.actualPrice,
            discountedPrice: c.discountedPrice,
            savingsPercentage: c.savedPercent,
            isActive: true, // API doesn't seem to return isActive for combo, defaulting to true
            validFrom: new Date(c.validFrom),
            validUntil: new Date(c.validTill), // note naming difference
            customerEligibility: 'all', // defaulting
            staffCommissionRate: 0, // defaulting
            popularity: 0,
            totalBookings: 0,
            revenueGenerated: c.savedAmount || 0, // Just putting something here
            createdAt: new Date(),
            updatedAt: new Date()
        };
      });

      setCombos(mappedCombos);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCombos = combos
    .filter((combo) => {
      const now = new Date();
      // Safe check for valid dates
      const validUntil = combo.validUntil ? new Date(combo.validUntil) : now;
      const isExpired = validUntil < now;

      if (filters.status === 'active' && (!combo.isActive || isExpired)) {
        return false;
      }

      if (filters.status === 'inactive' && (combo.isActive || isExpired)) {
        return false;
      }

      if (filters.status === 'expired' && !isExpired) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          combo.name.toLowerCase().includes(query) ||
          combo.description.toLowerCase().includes(query) ||
          combo.services.some((s) => s.name.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'savings':
          comparison = a.savingsPercentage - b.savingsPercentage;
          break;
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
        case 'revenue':
          comparison = a.revenueGenerated - b.revenueGenerated;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddCombo = async (data: ComboFormData) => {
    try {
      const originalPrice = data.services.reduce((sum, s) => sum + s.originalPrice, 0);
      const savingsPercentage = ((originalPrice - data.discountedPrice) / originalPrice) * 100;
      const savedAmount = originalPrice - data.discountedPrice;

      const payload = {
        name: data.name,
        description: data.description,
        services: data.services.map(s => s.id),
        validFrom: new Date(data.validFrom).toISOString(),
        validTill: new Date(data.validUntil).toISOString(),
        actualPrice: originalPrice,
        discountedPrice: data.discountedPrice,
        savedAmount: savedAmount,
        savedPercent: savingsPercentage
      };

      await comboApi.createComboOffer(payload);
      handleCloseModal();
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to create combo", error);
    }
  };

  const handleEditCombo = async (data: ComboFormData) => {
    if (!editingCombo) return;

    const originalPrice = data.services.reduce((sum, s) => sum + s.originalPrice, 0);
    const savingsPercentage = ((originalPrice - data.discountedPrice) / originalPrice) * 100;
    const savedAmount = originalPrice - data.discountedPrice;

    const payload = {
        name: data.name,
        description: data.description,
        services: data.services.map(s => s.id),
        validFrom: new Date(data.validFrom).toISOString(),
        validTill: new Date(data.validUntil).toISOString(),
        actualPrice: originalPrice,
        discountedPrice: data.discountedPrice,
        savedAmount: savedAmount,
        savedPercent: savingsPercentage
      };

    try {
        await comboApi.updateComboOffer(editingCombo.id, payload);
        handleCloseModal();
        fetchData(); // Refresh list
    } catch (error) {
        console.error("Failed to update combo", error);
    }
  };

  const handleDeleteCombo = async (comboId: string) => {
    if (window.confirm('Are you sure you want to delete this combo offer?')) {
        try {
            await comboApi.deleteComboOffer(comboId);
            fetchData();
        } catch (error) {
            console.error("Failed to delete combo", error);
        }
    }
  };

  const handleToggleStatus = (comboId: string) => {
     // API toggle not yet implemented
     console.log("Toggle requires backend support or full update payload", comboId);
  };

  const handleDuplicate = (combo: ComboOffer) => {
    // Client-side duplication logic could be kept, but saving requires Create API
    const duplicatedData: ComboFormData = {
        name: `${combo.name} (Copy)`,
        description: combo.description,
        services: combo.services,
        discountedPrice: combo.discountedPrice,
        validFrom: new Date(),
        validUntil: combo.validUntil,
        customerEligibility: combo.customerEligibility,
        staffCommissionRate: combo.staffCommissionRate
    };
    // Pre-fill the form modal
    setEditingCombo(null); // Ensure it's treated as new
    // We can't easily pre-fill the form without passing data, 
    // but the modal takes 'combo' prop for editing. 
    // To support duplicate-as-new, we might need to adjust logic, but for now let's just log.
    console.log("Duplicate to new not fully implemented", duplicatedData);
  };

  const handlePreview = async (combo: ComboOffer) => {
    try {
        const res = await comboApi.getComboOfferById(combo.id);
        const c = res.data || res; // handle potential response wrapper
        
        // Map service IDs to full service objects (reusing mappedServices would be ideal but for single item we can look up from availableServices state if populated, or fetch again if needed. For now assuming availableServices has data)
        const comboServices: ComboService[] = c.services.map((serviceId: string) => {
          const found = availableServices.find((s: any) => s.id === serviceId);
          return found ? {
            id: found.id,
            name: found.name,
            duration: found.duration,
            originalPrice: found.price
          } : null;
        }).filter(Boolean);

        const mappedCombo: ComboOffer = {
            id: c._id || c.id,
            name: c.name,
            description: c.description,
            services: comboServices,
            originalPrice: c.actualPrice,
            discountedPrice: c.discountedPrice,
            savingsPercentage: c.savedPercent,
            isActive: true, 
            validFrom: new Date(c.validFrom),
            validUntil: new Date(c.validTill), 
            customerEligibility: 'all', 
            staffCommissionRate: 0, 
            popularity: 0,
            totalBookings: 0,
            revenueGenerated: c.savedAmount || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setPreviewCombo(mappedCombo);
        setIsPreviewModalOpen(true);
    } catch (error) {
        console.error("Failed to fetch combo details", error);
        showToast({ message: "Failed to load details", status: "error" });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const handleOpenAddModal = () => {
    setEditingCombo(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (combo: ComboOffer) => {
    setEditingCombo(combo);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingCombo(null);
  };

  const handleFormSubmit = (data: ComboFormData) => {
    if (editingCombo) {
      handleEditCombo(data);
    } else {
      handleAddCombo(data);
    }
  };

  const user = {
    name: 'Sarah Johnson',
    email: authUser?.email || 'sarah@glamoursalon.com',
    role: authUser?.role || 'salon_owner',
    salonName: 'Glamour Salon & Spa',
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleSalonSwitch = () => {
    console.log('Salon switch clicked');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} />
      {/* <Header 
        user={user} 
        notifications={3} 
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        onSalonSwitch={handleSalonSwitch}
      /> */}

      <main className="lg:ml-sidebar pt-header pb-safe lg:pb-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Combo Offers Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and manage service bundles with discounted pricing
              </p>
            </div>

            <Button
              variant="default"
              onClick={handleOpenAddModal}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Create New Combo
            </Button>
          </div>

          <ComboStats combos={combos} />

          <ComboFiltersComponent
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />
          
          {isLoading ? (
               <div className="flex justify-center p-10"><p>Loading...</p></div>
          ) : (
            <>
                {isMobileView ? (
                    <div className="space-y-4 pb-bottom-nav">
                    {filteredCombos.map((combo) => (
                        <ComboMobileCard
                        key={combo.id}
                        combo={combo}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteCombo}
                        onToggleStatus={handleToggleStatus}
                        onDuplicate={handleDuplicate}
                        onPreview={handlePreview}
                        />
                    ))}
                    </div>
                ) : (
                    <ComboTable
                    combos={filteredCombos}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteCombo}
                    onToggleStatus={handleToggleStatus}
                    onDuplicate={handleDuplicate}
                    onPreview={handlePreview}
                    />
                )}

                {filteredCombos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg">
                    <Icon name="Package" size={64} className="text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No combo offers found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                        {filters.searchQuery || filters.status !== 'all' ?'Try adjusting your filters to see more results' :'Get started by creating your first combo offer to boost revenue'}
                    </p>
                    {!filters.searchQuery && filters.status === 'all' && (
                        <Button
                        variant="default"
                        onClick={handleOpenAddModal}
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={16}
                        >
                        Create Your First Combo
                        </Button>
                    )}
                    </div>
                )}
            </>
          )}

          
        </div>
      </main>

      <MobileBottomNav userRole={user.role} />

      <ComboFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        combo={editingCombo}
        availableServices={availableServices}
      />

      <ComboPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        combo={previewCombo}
      />
    </div>
    </AuthGuard>
  );
};

export default ComboOffersManagement;