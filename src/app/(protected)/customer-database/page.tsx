"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { customerApi } from '@/app/services/customer.api';
import Pagination from '@/app/components/Pagination';
import Loader from '@/app/components/Loader';

const CustomerDatabase = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [totalCustomers, setTotalCustomers] = useState(0);

  //  Customer Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    tags: [],
    gender: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [customerLoading, setCustomerLoading] = useState(false);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchCustomers = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response = await customerApi.getCustomers({
        page,
        limit: 10,
        fullName: filters.searchQuery,
        gender: filters.gender,
        customerTag: filters.tags,
      });
      setTotalCustomers(response.meta.total);
      // Only update state if component is still mounted
      if (!mountedRef.current) return;

      const mappedCustomers: Customer[] = response.data.map((c: any) => ({
        id: c._id,
        name: c.fullName,
        phone: c.userId.phoneNumber,
        email: c.userId.email,
        gender: c.gender,
        dateOfBirth: c.DOB,
        address: c.address || "",
        notes: c.notes || "",
        tags: c.customerTag || [],
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined,
        totalVisits: c.totalVisits,
        totalSpent: c.totalSpent,
        createdAt: new Date(c.createdAt),
        preferredStaff: c.preferredStaff?._id || c.preferredStaff?.fullName || "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}`,
      }));
      setCustomers(mappedCustomers);
      setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
    } catch (error) {
      if (mountedRef.current) {
        console.error("Error fetching customers", error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, [page, filters.searchQuery, filters.gender, filters.tags]);

  // Refetch whenever filters or page change
  useEffect(() => {
    mountedRef.current = true;
    fetchCustomers();
    
    return () => {
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, [fetchCustomers]);

  useEffect(() => {
  setPage(1);
}, [filters.searchQuery, filters.gender, filters.tags]);


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

  const filteredCustomers = customers;

  const customerFetchingRef = useRef(false);

  const handleCustomerSelect = async (customerId: string) => {
    // Prevent duplicate calls
    if (customerFetchingRef.current) return;
    
    customerFetchingRef.current = true;
    try {
      setCustomerLoading(true);
      setShowProfile(true);

      const c = await customerApi.getCustomerById(customerId);

      const mappedCustomer: Customer = {
        id: c._id,
        name: c.fullName,
        phone: c.userId.phoneNumber,
        email: c.userId.email,
        gender: c.gender,
        dateOfBirth: c.DOB.split('T')[0],
        address: c.address || "",
        notes: c.notes || "",
        tags: c.customerTag || [],
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : null, 
        totalVisits: c.totalVisits,
        totalSpent: c.totalSpent,
        createdAt: new Date(c.createdAt),
        preferredStaff: c.preferredStaff?.fullName || "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}`,
      };

      setSelectedCustomer(mappedCustomer);
    } catch (error) {
      console.error("Error fetching customer", error);
    } finally {
      setCustomerLoading(false);
      customerFetchingRef.current = false;
    }
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

  const handleSaveCustomer = () => {
    setShowForm(false);
    setEditingCustomer(undefined);
    fetchCustomers(); // Refetch customers after update
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

  return (
    <>
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
              totalCustomers={totalCustomers}
            />

            {loading ? (
              <Loader label="Loading customers..." />
            ) : customers.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <Icon name="Users" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters.searchQuery || filters.tags.length > 0 || filters.gender
                    ? 'Try adjusting your filters to see more results'
                    : 'Get started by adding your first customer'}
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
                    {customers.map((customer) => (
                      <MobileCustomerCard
                        key={customer.id}
                        customer={customer}
                        onSelect={() => handleCustomerSelect(customer.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <CustomerTable
                    customers={customers}
                    onCustomerSelect={(customer) => handleCustomerSelect(customer.id)}
                    onEditCustomer={handleEditCustomer}
                    selectedCustomerId={selectedCustomer?.id || null}
                    onCustomerDeleted={fetchCustomers}
                  />
                )}

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-end">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
    </div>

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
        loading={customerLoading}
        onEdit={handleEditCustomer}
        onBookAppointment={handleBookAppointment}
        onSendMessage={handleSendMessage}
      />
    )}

    {showForm && (
      <CustomerForm
        editingCustomer={editingCustomer}
        onClose={() => {
          setShowForm(false);
          setEditingCustomer(undefined);
        }}
        onSuccess={handleSaveCustomer}
      />
    )}
    </>
  );
};

export default CustomerDatabase;