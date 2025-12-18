"use client";
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CustomerTable from './components/CustomerTable';
import CustomerFilters from './components/CustomerFilters';
import CustomerProfile from './components/CustomerProfile';
import CustomerForm from './components/CustomerForm';
import MobileCustomerCard from './components/MobileCustomerCard';
import {
  Customer,
  CustomerFilters as FilterType,
  CustomerFormData,
  ServiceHistory,
} from './types';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';

const CustomerDatabase = () => {
  // const navigate = useNavigate();
  const router = useRouter()
  const authUser = useAppSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    tags: [],
    gender: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Emma Thompson',
      phone: '+91 1234567890',
      email: 'emma.thompson@email.com',
      gender: 'female',
      dateOfBirth: '1985-03-15',
      address: '123 Main Street, New York, NY 10001',
      notes: 'Prefers natural hair treatments. Allergic to certain chemical dyes.',
      tags: ['VIP', 'Frequent'],
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      totalVisits: 24,
      totalSpent: 1850.0,
      createdAt: new Date('2023-01-15'),
      preferredStaff: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      phone: '+91 1234567890',
      email: 'michael.r@email.com',
      gender: 'male',
      address: '456 Oak Avenue, Brooklyn, NY 11201',
      notes: 'Regular customer for beard grooming. Prefers appointments on weekends.',
      tags: ['Frequent'],
      lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      totalVisits: 18,
      totalSpent: 920.0,
      createdAt: new Date('2023-03-20'),
      preferredStaff: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      name: 'Sarah Williams',
      phone: '+91 1234567890',
      email: 'sarah.w@email.com',
      gender: 'female',
      dateOfBirth: '1992-07-22',
      address: '789 Pine Street, Manhattan, NY 10002',
      notes: 'First-time customer. Interested in hair coloring services.',
      tags: ['New'],
      lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalVisits: 1,
      totalSpent: 120.0,
      createdAt: new Date('2024-01-10'),
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      id: '4',
      name: 'James Chen',
      phone: '+91 1234567890',
      gender: 'male',
      address: '321 Elm Street, Queens, NY 11354',
      notes: 'VIP customer. Prefers premium services and products.',
      tags: ['VIP'],
      lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      totalVisits: 32,
      totalSpent: 3200.0,
      createdAt: new Date('2022-11-05'),
      preferredStaff: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      phone: '+91 1234567890',
      email: 'lisa.anderson@email.com',
      gender: 'female',
      dateOfBirth: '1988-11-30',
      notes: 'Regular manicure and pedicure customer.',
      tags: ['Frequent'],
      lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      totalVisits: 15,
      totalSpent: 750.0,
      createdAt: new Date('2023-05-12'),
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      id: '6',
      name: 'David Kim',
      phone: '+91 1234567890',
      gender: 'male',
      address: '654 Maple Drive, Bronx, NY 10451',
      notes: 'Has not visited in over 6 months. Send promotional offer.',
      tags: ['Inactive'],
      lastVisit: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      totalVisits: 8,
      totalSpent: 320.0,
      createdAt: new Date('2023-02-18'),
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
  ];

  const mockServiceHistory: ServiceHistory[] = [
    {
      id: '1',
      customerId: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      services: [
        { id: '1', name: 'Hair Cut & Style', category: 'Hair', duration: 60, price: 65.0 },
        { id: '2', name: 'Deep Conditioning', category: 'Hair', duration: 30, price: 35.0 },
      ],
      staffName: 'Sarah Johnson',
      totalAmount: 100.0,
      paymentStatus: 'paid',
      notes: 'Customer very satisfied with the service.',
    },
    {
      id: '2',
      customerId: '1',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      services: [
        { id: '3', name: 'Hair Coloring', category: 'Hair', duration: 120, price: 150.0 },
      ],
      staffName: 'Sarah Johnson',
      totalAmount: 150.0,
      paymentStatus: 'paid',
    },
    {
      id: '3',
      customerId: '1',
      date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      services: [
        { id: '1', name: 'Hair Cut & Style', category: 'Hair', duration: 60, price: 65.0 },
        { id: '4', name: 'Manicure', category: 'Nails', duration: 45, price: 40.0 },
      ],
      staffName: 'Emily Rodriguez',
      totalAmount: 105.0,
      paymentStatus: 'paid',
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filterCustomers = (customers: Customer[]): Customer[] => {
    return customers.filter((customer) => {
      const matchesSearch =
        !filters.searchQuery ||
        customer.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        customer.phone.includes(filters.searchQuery);

      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => customer.tags.includes(tag));

      const matchesGender = !filters.gender || customer.gender === filters.gender;

      return matchesSearch && matchesTags && matchesGender;
    });
  };

  const filteredCustomers = filterCustomers(mockCustomers);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowProfile(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowProfile(false);
    setShowForm(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setShowForm(true);
  };

  const handleSaveCustomer = (data: CustomerFormData) => {
    console.log('Saving customer:', data);
    setShowForm(false);
    setEditingCustomer(undefined);
  };

  const handleBookAppointment = (customerId: string) => {
    // router.push('/booking-management', { state: { customerId } });
    router.push(`/booking-management?customerId=${customerId}`);

  };

  const handleSendMessage = (customerId: string) => {
    console.log('Sending message to customer:', customerId);
    alert('WhatsApp message feature will be implemented with WhatsApp Business API integration.');
  };

  const handleExport = () => {
    console.log('Exporting customer data...');
    alert('Customer data export functionality will generate an Excel file with all customer information.');
  };

  const user = {
    name: 'John Smith',
    email: authUser?.email || 'john.smith@salonhub.com',
    role: authUser?.role || 'salon_owner',
    salonName: 'Glamour Studio',
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user.role} />
      <Header
        user={user}
        notifications={3}
        onLogout={() =>  router.push('/salon-registration')}
        onProfileClick={() => console.log('Profile clicked')}
        onNotificationClick={() => console.log('Notifications clicked')}
      />

      <main className="lg:ml-sidebar pt-header pb-bottom-nav lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Customer Database
              </h1>
              <p className="text-muted-foreground">
                Manage customer relationships and service history
              </p>
            </div>
            <Button
              variant="default"
              iconName="UserPlus"
              iconPosition="left"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>

          <CustomerFilters
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            totalCustomers={filteredCustomers.length}
          />

          {filteredCustomers.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Icon name="Users" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No customers found</h3>
              <p className="text-muted-foreground mb-6">
                {filters.searchQuery || filters.tags.length > 0 || filters.gender
                  ? 'Try adjusting your filters to see more results' :'Get started by adding your first customer'}
              </p>
              {!filters.searchQuery && filters.tags.length === 0 && !filters.gender && (
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={handleAddCustomer}
                >
                  Add Customer
                </Button>
              )}
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="space-y-3">
                  {filteredCustomers.map((customer) => (
                    <MobileCustomerCard
                      key={customer.id}
                      customer={customer}
                      onSelect={handleCustomerSelect}
                    />
                  ))}
                </div>
              ) : (
                <CustomerTable
                  customers={filteredCustomers}
                  onCustomerSelect={handleCustomerSelect}
                  selectedCustomerId={selectedCustomer?.id || null}
                />
              )}
            </>
          )}
        </div>
      </main>

      <MobileBottomNav userRole={user.role} />

      {showProfile && selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          serviceHistory={mockServiceHistory.filter(
            (h) => h.customerId === selectedCustomer.id
          )}
          onClose={() => {
            setShowProfile(false);
            setSelectedCustomer(null);
          }}
          onEdit={handleEditCustomer}
          onBookAppointment={handleBookAppointment}
          onSendMessage={handleSendMessage}
        />
      )}

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(undefined);
          }}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default CustomerDatabase;