'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/app/components/AppIcon';
import RenewalStatsCard from './RenewalStatsCard';
import RenewalFilters from './RenewalFilters';
import RenewalsTable from './RenewalsTable';
import RenewalsMobileCard from './RenewalsMobileCard';
import RenewalDetailsModal from './RenewalDetailsModal';
import BulkActionsBar from './BulkActionsBar';
// import Pagination from './pagination';
import Pagination from '@/app/components/Pagination';

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: string;
}

interface RenewalRecord {
  id: number;
  salonName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planType: string;
  amount: number;
  paymentMethod: string;
  renewalDate: string;
  status: 'overdue' | 'upcoming' | 'completed' | 'pending';
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  autoRenewal: boolean;
  renewalCount: number;
  lifetimePayment: number;
  paymentHistory: PaymentHistory[];
}

const RenewalsInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedPlanType, setSelectedPlanType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRenewals, setSelectedRenewals] = useState<number[]>([]);
  const [selectedRenewal, setSelectedRenewal] = useState<RenewalRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockRenewals: RenewalRecord[] = [
    {
      id: 1,
      salonName: "Glamour Studio",
      ownerName: "Sarah Johnson",
      ownerEmail: "sarah.johnson@glamourstudio.com",
      ownerPhone: "+1 (555) 123-4567",
      planType: "professional",
      amount: 299,
      paymentMethod: "credit_card",
      renewalDate: "02/15/2026",
      status: "upcoming",
      subscriptionStartDate: "02/15/2025",
      subscriptionEndDate: "02/15/2026",
      autoRenewal: true,
      renewalCount: 3,
      lifetimePayment: 897,
      paymentHistory: [
        { id: 1, date: "02/15/2025", amount: 299, method: "credit_card", status: "completed" },
        { id: 2, date: "02/15/2024", amount: 299, method: "credit_card", status: "completed" },
        { id: 3, date: "02/15/2023", amount: 299, method: "credit_card", status: "completed" }
      ]
    },
    {
      id: 2,
      salonName: "Elite Hair Lounge",
      ownerName: "Michael Chen",
      ownerEmail: "michael.chen@elitehair.com",
      ownerPhone: "+1 (555) 234-5678",
      planType: "enterprise",
      amount: 599,
      paymentMethod: "bank_transfer",
      renewalDate: "01/20/2026",
      status: "overdue",
      subscriptionStartDate: "01/20/2025",
      subscriptionEndDate: "01/20/2026",
      autoRenewal: false,
      renewalCount: 2,
      lifetimePayment: 1198,
      paymentHistory: [
        { id: 1, date: "01/20/2025", amount: 599, method: "bank_transfer", status: "completed" },
        { id: 2, date: "01/20/2024", amount: 599, method: "bank_transfer", status: "completed" }
      ]
    },
    {
      id: 3,
      salonName: "Beauty Haven",
      ownerName: "Emily Rodriguez",
      ownerEmail: "emily.rodriguez@beautyhaven.com",
      ownerPhone: "+1 (555) 345-6789",
      planType: "basic",
      amount: 149,
      paymentMethod: "paypal",
      renewalDate: "03/10/2026",
      status: "upcoming",
      subscriptionStartDate: "03/10/2025",
      subscriptionEndDate: "03/10/2026",
      autoRenewal: true,
      renewalCount: 4,
      lifetimePayment: 596,
      paymentHistory: [
        { id: 1, date: "03/10/2025", amount: 149, method: "paypal", status: "completed" },
        { id: 2, date: "03/10/2024", amount: 149, method: "paypal", status: "completed" },
        { id: 3, date: "03/10/2023", amount: 149, method: "paypal", status: "completed" },
        { id: 4, date: "03/10/2022", amount: 149, method: "paypal", status: "completed" }
      ]
    },
    {
      id: 4,
      salonName: "Luxe Salon & Spa",
      ownerName: "David Thompson",
      ownerEmail: "david.thompson@luxesalon.com",
      ownerPhone: "+1 (555) 456-7890",
      planType: "professional",
      amount: 299,
      paymentMethod: "debit_card",
      renewalDate: "02/28/2026",
      status: "pending",
      subscriptionStartDate: "02/28/2025",
      subscriptionEndDate: "02/28/2026",
      autoRenewal: true,
      renewalCount: 1,
      lifetimePayment: 299,
      paymentHistory: [
        { id: 1, date: "02/28/2025", amount: 299, method: "debit_card", status: "completed" }
      ]
    },
    {
      id: 5,
      salonName: "Chic Cuts",
      ownerName: "Jessica Martinez",
      ownerEmail: "jessica.martinez@chiccuts.com",
      ownerPhone: "+1 (555) 567-8901",
      planType: "basic",
      amount: 149,
      paymentMethod: "credit_card",
      renewalDate: "01/05/2026",
      status: "completed",
      subscriptionStartDate: "01/05/2025",
      subscriptionEndDate: "01/05/2026",
      autoRenewal: true,
      renewalCount: 5,
      lifetimePayment: 745,
      paymentHistory: [
        { id: 1, date: "01/05/2026", amount: 149, method: "credit_card", status: "completed" },
        { id: 2, date: "01/05/2025", amount: 149, method: "credit_card", status: "completed" },
        { id: 3, date: "01/05/2024", amount: 149, method: "credit_card", status: "completed" },
        { id: 4, date: "01/05/2023", amount: 149, method: "credit_card", status: "completed" },
        { id: 5, date: "01/05/2022", amount: 149, method: "credit_card", status: "completed" }
      ]
    },
    {
      id: 6,
      salonName: "Modern Mane",
      ownerName: "Robert Wilson",
      ownerEmail: "robert.wilson@modernmane.com",
      ownerPhone: "+1 (555) 678-9012",
      planType: "enterprise",
      amount: 599,
      paymentMethod: "bank_transfer",
      renewalDate: "03/25/2026",
      status: "upcoming",
      subscriptionStartDate: "03/25/2025",
      subscriptionEndDate: "03/25/2026",
      autoRenewal: true,
      renewalCount: 2,
      lifetimePayment: 1198,
      paymentHistory: [
        { id: 1, date: "03/25/2025", amount: 599, method: "bank_transfer", status: "completed" },
        { id: 2, date: "03/25/2024", amount: 599, method: "bank_transfer", status: "completed" }
      ]
    },
    {
      id: 7,
      salonName: "Style Sanctuary",
      ownerName: "Amanda Lee",
      ownerEmail: "amanda.lee@stylesanctuary.com",
      ownerPhone: "+1 (555) 789-0123",
      planType: "professional",
      amount: 299,
      paymentMethod: "paypal",
      renewalDate: "02/08/2026",
      status: "upcoming",
      subscriptionStartDate: "02/08/2025",
      subscriptionEndDate: "02/08/2026",
      autoRenewal: false,
      renewalCount: 3,
      lifetimePayment: 897,
      paymentHistory: [
        { id: 1, date: "02/08/2025", amount: 299, method: "paypal", status: "completed" },
        { id: 2, date: "02/08/2024", amount: 299, method: "paypal", status: "completed" },
        { id: 3, date: "02/08/2023", amount: 299, method: "paypal", status: "completed" }
      ]
    },
    {
      id: 8,
      salonName: "Radiant Beauty Bar",
      ownerName: "Christopher Davis",
      ownerEmail: "chris.davis@radiantbeauty.com",
      ownerPhone: "+1 (555) 890-1234",
      planType: "basic",
      amount: 149,
      paymentMethod: "credit_card",
      renewalDate: "01/15/2026",
      status: "overdue",
      subscriptionStartDate: "01/15/2025",
      subscriptionEndDate: "01/15/2026",
      autoRenewal: true,
      renewalCount: 1,
      lifetimePayment: 149,
      paymentHistory: [
        { id: 1, date: "01/15/2025", amount: 149, method: "credit_card", status: "completed" }
      ]
    },
    {
      id: 9,
      salonName: "Prestige Hair Studio",
      ownerName: "Nicole Anderson",
      ownerEmail: "nicole.anderson@prestigehair.com",
      ownerPhone: "+1 (555) 901-2345",
      planType: "enterprise",
      amount: 599,
      paymentMethod: "debit_card",
      renewalDate: "03/18/2026",
      status: "upcoming",
      subscriptionStartDate: "03/18/2025",
      subscriptionEndDate: "03/18/2026",
      autoRenewal: true,
      renewalCount: 4,
      lifetimePayment: 2396,
      paymentHistory: [
        { id: 1, date: "03/18/2025", amount: 599, method: "debit_card", status: "completed" },
        { id: 2, date: "03/18/2024", amount: 599, method: "debit_card", status: "completed" },
        { id: 3, date: "03/18/2023", amount: 599, method: "debit_card", status: "completed" },
        { id: 4, date: "03/18/2022", amount: 599, method: "debit_card", status: "completed" }
      ]
    },
    {
      id: 10,
      salonName: "Trendy Tresses",
      ownerName: "Brandon Taylor",
      ownerEmail: "brandon.taylor@trendytresses.com",
      ownerPhone: "+1 (555) 012-3456",
      planType: "professional",
      amount: 299,
      paymentMethod: "bank_transfer",
      renewalDate: "02/22/2026",
      status: "pending",
      subscriptionStartDate: "02/22/2025",
      subscriptionEndDate: "02/22/2026",
      autoRenewal: false,
      renewalCount: 2,
      lifetimePayment: 598,
      paymentHistory: [
        { id: 1, date: "02/22/2025", amount: 299, method: "bank_transfer", status: "completed" },
        { id: 2, date: "02/22/2024", amount: 299, method: "bank_transfer", status: "completed" }
      ]
    },
    {
      id: 11,
      salonName: "Elegant Edge Salon",
      ownerName: "Sophia White",
      ownerEmail: "sophia.white@elegantedge.com",
      ownerPhone: "+1 (555) 123-4568",
      planType: "basic",
      amount: 149,
      paymentMethod: "paypal",
      renewalDate: "03/05/2026",
      status: "upcoming",
      subscriptionStartDate: "03/05/2025",
      subscriptionEndDate: "03/05/2026",
      autoRenewal: true,
      renewalCount: 3,
      lifetimePayment: 447,
      paymentHistory: [
        { id: 1, date: "03/05/2025", amount: 149, method: "paypal", status: "completed" },
        { id: 2, date: "03/05/2024", amount: 149, method: "paypal", status: "completed" },
        { id: 3, date: "03/05/2023", amount: 149, method: "paypal", status: "completed" }
      ]
    },
    {
      id: 12,
      salonName: "Vogue Hair Design",
      ownerName: "Daniel Harris",
      ownerEmail: "daniel.harris@voguehair.com",
      ownerPhone: "+1 (555) 234-5679",
      planType: "enterprise",
      amount: 599,
      paymentMethod: "credit_card",
      renewalDate: "01/28/2026",
      status: "completed",
      subscriptionStartDate: "01/28/2025",
      subscriptionEndDate: "01/28/2026",
      autoRenewal: true,
      renewalCount: 5,
      lifetimePayment: 2995,
      paymentHistory: [
        { id: 1, date: "01/28/2026", amount: 599, method: "credit_card", status: "completed" },
        { id: 2, date: "01/28/2025", amount: 599, method: "credit_card", status: "completed" },
        { id: 3, date: "01/28/2024", amount: 599, method: "credit_card", status: "completed" },
        { id: 4, date: "01/28/2023", amount: 599, method: "credit_card", status: "completed" },
        { id: 5, date: "01/28/2022", amount: 599, method: "credit_card", status: "completed" }
      ]
    }
  ];

  const filteredRenewals = mockRenewals.filter((renewal) => {
    const matchesStatus = selectedStatus === 'all' || renewal.status === selectedStatus;
    const matchesPayment = selectedPaymentMethod === 'all' || renewal.paymentMethod === selectedPaymentMethod;
    const matchesPlan = selectedPlanType === 'all' || renewal.planType === selectedPlanType;
    const matchesSearch = searchQuery === '' || 
      renewal.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      renewal.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const renewalDate = new Date(renewal.renewalDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = renewalDate >= startDate && renewalDate <= endDate;
    }

    return matchesStatus && matchesPayment && matchesPlan && matchesSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredRenewals.length / itemsPerPage);
  const paginatedRenewals = filteredRenewals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectRenewal = (id: number) => {
    setSelectedRenewals((prev) =>
      prev.includes(id) ? prev.filter((renewalId) => renewalId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRenewals.length === paginatedRenewals.length) {
      setSelectedRenewals([]);
    } else {
      setSelectedRenewals(paginatedRenewals.map((r) => r.id));
    }
  };

  const handleExport = () => {
    alert('Exporting renewal data...');
  };

  const handleConfirmPayments = () => {
    alert(`Confirming payments for ${selectedRenewals.length} renewals...`);
    setSelectedRenewals([]);
  };

  const handleSendReminders = () => {
    alert(`Sending reminders for ${selectedRenewals.length} renewals...`);
    setSelectedRenewals([]);
  };

  const stats = {
    totalRenewals: mockRenewals.length,
    overdueRenewals: mockRenewals.filter(r => r.status === 'overdue').length,
    upcomingRenewals: mockRenewals.filter(r => r.status === 'upcoming').length,
    completedRenewals: mockRenewals.filter(r => r.status === 'completed').length,
    totalRevenue: mockRenewals.reduce((sum, r) => sum + r.amount, 0)
  };

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Renewals Management</h1>
          <p className="text-text-secondary">
            Track and process subscription renewals across all salon locations
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth font-medium flex items-center gap-2 shadow-elevation-1"
        >
          <Icon name="ArrowDownTrayIcon" size={20} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RenewalStatsCard
          title="Total Renewals"
          value={stats.totalRenewals}
          icon="DocumentTextIcon"
          bgColor="bg-primary"
          trend={{ value: "+12%", isPositive: true }}
        />
        <RenewalStatsCard
          title="Overdue"
          value={stats.overdueRenewals}
          icon="ExclamationTriangleIcon"
          bgColor="bg-error"
          trend={{ value: "-8%", isPositive: true }}
        />
        <RenewalStatsCard
          title="Upcoming"
          value={stats.upcomingRenewals}
          icon="ClockIcon"
          bgColor="bg-warning"
        />
        <RenewalStatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="CurrencyDollarIcon"
          bgColor="bg-success"
          trend={{ value: "+18%", isPositive: true }}
        />
      </div>

      <RenewalFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        selectedPlanType={selectedPlanType}
        onPlanTypeChange={setSelectedPlanType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="hidden lg:block">
        <RenewalsTable
          renewals={paginatedRenewals}
          onViewDetails={setSelectedRenewal}
          selectedRenewals={selectedRenewals}
          onSelectRenewal={handleSelectRenewal}
          onSelectAll={handleSelectAll}
        />
      </div>

      <div className="lg:hidden">
        <RenewalsMobileCard
          renewals={paginatedRenewals}
          onViewDetails={setSelectedRenewal}
          selectedRenewals={selectedRenewals}
          onSelectRenewal={handleSelectRenewal}
        />
      </div>

      {filteredRenewals.length > itemsPerPage && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        //   itemsPerPage={itemsPerPage}
        />
      )}

      <BulkActionsBar
        selectedCount={selectedRenewals.length}
        onConfirmPayments={handleConfirmPayments}
        onSendReminders={handleSendReminders}
        onExport={handleExport}
        onClearSelection={() => setSelectedRenewals([])}
      />

      {selectedRenewal && (
        <RenewalDetailsModal
          renewal={selectedRenewal}
          onClose={() => setSelectedRenewal(null)}
        />
      )}
    </div>
  );
};

export default RenewalsInteractive;