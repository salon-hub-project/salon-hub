"use client";

import { useState, useEffect, useCallback } from "react";
import SubscriptionFilters from "./SubscriptionFilters";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";
import BulkActionsBar from "./BulkActionsBar";
import SubscriptionTable from "./SubscriptionTable";

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

interface Subscription {
  id: string;
  salonName: string;
  ownerName: string;
  planType: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  renewalCount: number;
  lastPayment: number;
  lifetimePayment: number;
  paymentMethod: string;
  autoRenewal: boolean;
  paymentHistory: PaymentHistory[];
}

interface FilterState {
  planType: string;
  paymentStatus: string;
  dateRange: string;
  searchQuery: string;
}

const SubscriptionManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "SUB001",
      salonName: "Elegance Hair Studio",
      ownerName: "Sarah Mitchell",
      planType: "professional",
      startDate: "01/15/2025",
      endDate: "01/15/2026",
      paymentStatus: "active",
      renewalCount: 3,
      lastPayment: 299.0,
      lifetimePayment: 897.0,
      paymentMethod: "Credit Card",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY001",
          date: "01/15/2025",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
        {
          id: "PAY002",
          date: "01/15/2024",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
        {
          id: "PAY003",
          date: "01/15/2023",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
      ],
    },
    {
      id: "SUB002",
      salonName: "Urban Cuts & Color",
      ownerName: "Michael Chen",
      planType: "enterprise",
      startDate: "02/01/2025",
      endDate: "02/01/2026",
      paymentStatus: "active",
      renewalCount: 2,
      lastPayment: 599.0,
      lifetimePayment: 1198.0,
      paymentMethod: "Bank Transfer",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY004",
          date: "02/01/2025",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
        {
          id: "PAY005",
          date: "02/01/2024",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
      ],
    },
    {
      id: "SUB003",
      salonName: "Glamour Beauty Bar",
      ownerName: "Jessica Rodriguez",
      planType: "basic",
      startDate: "12/10/2024",
      endDate: "12/10/2025",
      paymentStatus: "active",
      renewalCount: 1,
      lastPayment: 149.0,
      lifetimePayment: 149.0,
      paymentMethod: "Credit Card",
      autoRenewal: false,
      paymentHistory: [
        {
          id: "PAY006",
          date: "12/10/2024",
          amount: 149.0,
          method: "Credit Card",
          status: "active",
        },
      ],
    },
    {
      id: "SUB004",
      salonName: "Luxe Hair Lounge",
      ownerName: "David Thompson",
      planType: "premium",
      startDate: "11/20/2024",
      endDate: "11/20/2025",
      paymentStatus: "active",
      renewalCount: 4,
      lastPayment: 449.0,
      lifetimePayment: 1796.0,
      paymentMethod: "PayPal",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY007",
          date: "11/20/2024",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
        {
          id: "PAY008",
          date: "11/20/2023",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
        {
          id: "PAY009",
          date: "11/20/2022",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
        {
          id: "PAY010",
          date: "11/20/2021",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
      ],
    },
    {
      id: "SUB005",
      salonName: "Chic Styles Salon",
      ownerName: "Amanda Foster",
      planType: "professional",
      startDate: "10/05/2024",
      endDate: "10/05/2025",
      paymentStatus: "active",
      renewalCount: 2,
      lastPayment: 299.0,
      lifetimePayment: 598.0,
      paymentMethod: "Credit Card",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY011",
          date: "10/05/2024",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
        {
          id: "PAY012",
          date: "10/05/2023",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
      ],
    },
    {
      id: "SUB006",
      salonName: "Trendy Tresses",
      ownerName: "Robert Martinez",
      planType: "basic",
      startDate: "09/15/2024",
      endDate: "09/15/2025",
      paymentStatus: "expired",
      renewalCount: 0,
      lastPayment: 149.0,
      lifetimePayment: 149.0,
      paymentMethod: "Credit Card",
      autoRenewal: false,
      paymentHistory: [
        {
          id: "PAY013",
          date: "09/15/2024",
          amount: 149.0,
          method: "Credit Card",
          status: "expired",
        },
      ],
    },
    {
      id: "SUB007",
      salonName: "Radiant Beauty Studio",
      ownerName: "Emily Watson",
      planType: "enterprise",
      startDate: "08/01/2024",
      endDate: "08/01/2025",
      paymentStatus: "active",
      renewalCount: 1,
      lastPayment: 599.0,
      lifetimePayment: 599.0,
      paymentMethod: "Bank Transfer",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY014",
          date: "08/01/2024",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
      ],
    },
    {
      id: "SUB008",
      salonName: "Style Haven",
      ownerName: "Christopher Lee",
      planType: "professional",
      startDate: "07/20/2024",
      endDate: "07/20/2025",
      paymentStatus: "pending",
      renewalCount: 3,
      lastPayment: 299.0,
      lifetimePayment: 897.0,
      paymentMethod: "Credit Card",
      autoRenewal: false,
      paymentHistory: [
        {
          id: "PAY015",
          date: "07/20/2024",
          amount: 299.0,
          method: "Credit Card",
          status: "pending",
        },
        {
          id: "PAY016",
          date: "07/20/2023",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
        {
          id: "PAY017",
          date: "07/20/2022",
          amount: 299.0,
          method: "Credit Card",
          status: "active",
        },
      ],
    },
    {
      id: "SUB009",
      salonName: "Prestige Hair Design",
      ownerName: "Nicole Anderson",
      planType: "premium",
      startDate: "06/10/2024",
      endDate: "06/10/2025",
      paymentStatus: "active",
      renewalCount: 2,
      lastPayment: 449.0,
      lifetimePayment: 898.0,
      paymentMethod: "PayPal",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY018",
          date: "06/10/2024",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
        {
          id: "PAY019",
          date: "06/10/2023",
          amount: 449.0,
          method: "PayPal",
          status: "active",
        },
      ],
    },
    {
      id: "SUB010",
      salonName: "Modern Hair Boutique",
      ownerName: "Daniel Brown",
      planType: "basic",
      startDate: "05/25/2024",
      endDate: "05/25/2025",
      paymentStatus: "cancelled",
      renewalCount: 0,
      lastPayment: 149.0,
      lifetimePayment: 149.0,
      paymentMethod: "Credit Card",
      autoRenewal: false,
      paymentHistory: [
        {
          id: "PAY020",
          date: "05/25/2024",
          amount: 149.0,
          method: "Credit Card",
          status: "cancelled",
        },
      ],
    },
    {
      id: "SUB011",
      salonName: "Elite Beauty Salon",
      ownerName: "Sophia Williams",
      planType: "enterprise",
      startDate: "04/15/2024",
      endDate: "04/15/2025",
      paymentStatus: "active",
      renewalCount: 5,
      lastPayment: 599.0,
      lifetimePayment: 2995.0,
      paymentMethod: "Bank Transfer",
      autoRenewal: true,
      paymentHistory: [
        {
          id: "PAY021",
          date: "04/15/2024",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
        {
          id: "PAY022",
          date: "04/15/2023",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
        {
          id: "PAY023",
          date: "04/15/2022",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
        {
          id: "PAY024",
          date: "04/15/2021",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
        {
          id: "PAY025",
          date: "04/15/2020",
          amount: 599.0,
          method: "Bank Transfer",
          status: "active",
        },
      ],
    },
    {
      id: "SUB012",
      salonName: "Signature Styles",
      ownerName: "James Taylor",
      planType: "professional",
      startDate: "03/01/2024",
      endDate: "03/01/2025",
      paymentStatus: "expired",
      renewalCount: 1,
      lastPayment: 299.0,
      lifetimePayment: 299.0,
      paymentMethod: "Credit Card",
      autoRenewal: false,
      paymentHistory: [
        {
          id: "PAY026",
          date: "03/01/2024",
          amount: 299.0,
          method: "Credit Card",
          status: "expired",
        },
      ],
    },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    planType: "all",
    paymentStatus: "all",
    dateRange: "all",
    searchQuery: "",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filters.planType !== "all" && sub.planType !== filters.planType)
      return false;
    if (
      filters.paymentStatus !== "all" &&
      sub.paymentStatus !== filters.paymentStatus
    )
      return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !sub.salonName.toLowerCase().includes(query) &&
        !sub.ownerName.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSelectSubscription = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === paginatedSubscriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSubscriptions.map((sub) => sub.id));
    }
  }, [selectedIds.length, paginatedSubscriptions]);

  const handleViewDetails = useCallback((subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleBulkRenewal = useCallback(() => {
    alert(`Processing renewals for ${selectedIds.length} subscription(s)`);
  }, [selectedIds.length]);

  const handleBulkStatusUpdate = useCallback(() => {
    alert(`Updating status for ${selectedIds.length} subscription(s)`);
  }, [selectedIds.length]);

  const handleExport = useCallback(() => {
    alert(`Exporting ${selectedIds.length} subscription(s)`);
  }, [selectedIds.length]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setSelectedIds([]);
  }, []);

  if (!isHydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-muted rounded-lg"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      <SubscriptionFilters
        onFilterChange={handleFilterChange}
        totalCount={subscriptions.length}
        filteredCount={filteredSubscriptions.length}
      />

      <SubscriptionTable
        subscriptions={paginatedSubscriptions}
        selectedIds={selectedIds}
        onSelectSubscription={handleSelectSubscription}
        onSelectAll={handleSelectAll}
        onViewDetails={handleViewDetails}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onBulkRenewal={handleBulkRenewal}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onExport={handleExport}
      />

      <SubscriptionDetailsModal
        subscription={selectedSubscription}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default SubscriptionManagementInteractive;
