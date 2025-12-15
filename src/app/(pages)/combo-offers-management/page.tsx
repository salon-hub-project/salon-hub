"use client";
import { useState, useEffect } from 'react';
import { ComboOffer, ComboFormData, ComboFilters } from './types';
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

const ComboOffersManagement = () => {
  // Mock services data for combo creation
  const availableServices = [
    { id: '1', name: 'Classic Haircut', duration: 45, price: 35.0 },
    { id: '2', name: 'Hair Coloring', duration: 120, price: 85.0 },
    { id: '3', name: 'Manicure', duration: 30, price: 25.0 },
    { id: '4', name: 'Pedicure', duration: 45, price: 35.0 },
    { id: '5', name: 'Facial Treatment', duration: 60, price: 65.0 },
    { id: '6', name: 'Waxing', duration: 30, price: 30.0 },
    { id: '7', name: 'Makeup Application', duration: 60, price: 75.0 },
    { id: '8', name: 'Hair Treatment', duration: 90, price: 55.0 },
  ];

  const [combos, setCombos] = useState<ComboOffer[]>([
    {
      id: '1',
      name: 'Hair & Nail Luxury Package',
      description: 'Complete hair transformation with premium nail care',
      services: [
        { id: '2', name: 'Hair Coloring', duration: 120, originalPrice: 85.0 },
        { id: '3', name: 'Manicure', duration: 30, originalPrice: 25.0 },
        { id: '4', name: 'Pedicure', duration: 45, originalPrice: 35.0 },
      ],
      originalPrice: 145.0,
      discountedPrice: 115.0,
      savingsPercentage: 20.69,
      isActive: true,
      validFrom: new Date('2024-12-01'),
      validUntil: new Date('2025-03-31'),
      minBookingRequirement: undefined,
      customerEligibility: 'all',
      staffCommissionRate: 15,
      popularity: 87,
      totalBookings: 87,
      revenueGenerated: 10005.0,
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15'),
    },
    {
      id: '2',
      name: 'Bridal Beauty Bundle',
      description: 'Complete bridal beauty package with hair, makeup, and nails',
      services: [
        { id: '2', name: 'Hair Coloring', duration: 120, originalPrice: 85.0 },
        { id: '7', name: 'Makeup Application', duration: 60, originalPrice: 75.0 },
        { id: '3', name: 'Manicure', duration: 30, originalPrice: 25.0 },
        { id: '4', name: 'Pedicure', duration: 45, originalPrice: 35.0 },
      ],
      originalPrice: 220.0,
      discountedPrice: 165.0,
      savingsPercentage: 25.0,
      isActive: true,
      validFrom: new Date('2024-12-01'),
      validUntil: new Date('2025-06-30'),
      minBookingRequirement: undefined,
      customerEligibility: 'all',
      staffCommissionRate: 18,
      popularity: 52,
      totalBookings: 52,
      revenueGenerated: 8580.0,
      createdAt: new Date('2024-11-10'),
      updatedAt: new Date('2024-11-10'),
    },
    {
      id: '3',
      name: 'Weekend Pampering Special',
      description: 'Relaxing weekend package with facial and nail services',
      services: [
        { id: '5', name: 'Facial Treatment', duration: 60, originalPrice: 65.0 },
        { id: '3', name: 'Manicure', duration: 30, originalPrice: 25.0 },
        { id: '4', name: 'Pedicure', duration: 45, originalPrice: 35.0 },
      ],
      originalPrice: 125.0,
      discountedPrice: 99.0,
      savingsPercentage: 20.8,
      isActive: true,
      validFrom: new Date('2024-12-01'),
      validUntil: new Date('2025-02-28'),
      minBookingRequirement: undefined,
      customerEligibility: 'existing',
      staffCommissionRate: 14,
      popularity: 64,
      totalBookings: 64,
      revenueGenerated: 6336.0,
      createdAt: new Date('2024-11-20'),
      updatedAt: new Date('2024-11-20'),
    },
    {
      id: '4',
      name: 'New Customer Welcome Pack',
      description: 'Special introductory offer for first-time clients',
      services: [
        { id: '1', name: 'Classic Haircut', duration: 45, originalPrice: 35.0 },
        { id: '3', name: 'Manicure', duration: 30, originalPrice: 25.0 },
      ],
      originalPrice: 60.0,
      discountedPrice: 45.0,
      savingsPercentage: 25.0,
      isActive: true,
      validFrom: new Date('2024-12-01'),
      validUntil: new Date('2025-12-31'),
      minBookingRequirement: undefined,
      customerEligibility: 'new',
      staffCommissionRate: 12,
      popularity: 128,
      totalBookings: 128,
      revenueGenerated: 5760.0,
      createdAt: new Date('2024-11-05'),
      updatedAt: new Date('2024-11-05'),
    },
    {
      id: '5',
      name: 'VIP Premium Treatment',
      description: 'Exclusive package for VIP members with all premium services',
      services: [
        { id: '2', name: 'Hair Coloring', duration: 120, originalPrice: 85.0 },
        { id: '8', name: 'Hair Treatment', duration: 90, originalPrice: 55.0 },
        { id: '5', name: 'Facial Treatment', duration: 60, originalPrice: 65.0 },
        { id: '7', name: 'Makeup Application', duration: 60, originalPrice: 75.0 },
      ],
      originalPrice: 280.0,
      discountedPrice: 210.0,
      savingsPercentage: 25.0,
      isActive: false,
      validFrom: new Date('2024-11-01'),
      validUntil: new Date('2024-12-31'),
      minBookingRequirement: 3,
      customerEligibility: 'vip',
      staffCommissionRate: 20,
      popularity: 23,
      totalBookings: 23,
      revenueGenerated: 4830.0,
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-11-25'),
    },
  ]);

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

  const filteredCombos = combos
    .filter((combo) => {
      const now = new Date();
      const isExpired = new Date(combo.validUntil) < now;

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

  const handleAddCombo = (data: ComboFormData) => {
    const originalPrice = data.services.reduce((sum, s) => sum + s.originalPrice, 0);
    const savingsPercentage = ((originalPrice - data.discountedPrice) / originalPrice) * 100;

    const newCombo: ComboOffer = {
      id: Date.now().toString(),
      ...data,
      originalPrice,
      savingsPercentage,
      isActive: true,
      popularity: 0,
      totalBookings: 0,
      revenueGenerated: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCombos([...combos, newCombo]);
  };

  const handleEditCombo = (data: ComboFormData) => {
    if (!editingCombo) return;

    const originalPrice = data.services.reduce((sum, s) => sum + s.originalPrice, 0);
    const savingsPercentage = ((originalPrice - data.discountedPrice) / originalPrice) * 100;

    setCombos(
      combos.map((combo) =>
        combo.id === editingCombo.id
          ? {
              ...combo,
              ...data,
              originalPrice,
              savingsPercentage,
              updatedAt: new Date(),
            }
          : combo
      )
    );

    setEditingCombo(null);
  };

  const handleDeleteCombo = (comboId: string) => {
    if (window.confirm('Are you sure you want to delete this combo offer?')) {
      setCombos(combos.filter((c) => c.id !== comboId));
    }
  };

  const handleToggleStatus = (comboId: string) => {
    setCombos(
      combos.map((combo) =>
        combo.id === comboId
          ? { ...combo, isActive: !combo.isActive, updatedAt: new Date() }
          : combo
      )
    );
  };

  const handleDuplicate = (combo: ComboOffer) => {
    const duplicatedCombo: ComboOffer = {
      ...combo,
      id: Date.now().toString(),
      name: `${combo.name} (Copy)`,
      isActive: false,
      popularity: 0,
      totalBookings: 0,
      revenueGenerated: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCombos([...combos, duplicatedCombo]);
  };

  const handlePreview = (combo: ComboOffer) => {
    setPreviewCombo(combo);
    setIsPreviewModalOpen(true);
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
    email: 'sarah@glamoursalon.com',
    role: 'salon_owner' as const,
    salonName: 'Glamour Salon & Spa',
  };

  // Add this block - Handler functions for Header component
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
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} />
      <Header 
        user={user} 
        notifications={3} 
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        onSalonSwitch={handleSalonSwitch}
      />

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
  );
};

export default ComboOffersManagement;