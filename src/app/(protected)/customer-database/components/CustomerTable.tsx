"use client";
import { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { Customer, CustomerTag } from "../types";
import { customerApi } from "@/app/services/customer.api";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface CustomerTableProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomerId: string | null;
  onCustomerDeleted: () => void;
}

const CustomerTable = ({
  customers,
  onCustomerSelect,
  selectedCustomerId,
  onCustomerDeleted
}: CustomerTableProps) => {
  const [sortBy, setSortBy] = useState<
    "name" | "lastVisit" | "totalVisits" | "totalSpent"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const getTagColor = (tag: CustomerTag): string => {
    const colors: Record<CustomerTag, string> = {
      VIP: "bg-accent text-accent-foreground",
      New: "bg-primary text-primary-foreground",
      Frequent: "bg-success text-success-foreground",
      Inactive: "bg-muted text-muted-foreground",
    };
    return colors[tag];
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "lastVisit":
        const dateA = a.lastVisit?.getTime() || 0;
        const dateB = b.lastVisit?.getTime() || 0;
        comparison = dateA - dateB;
        break;
      case "totalVisits":
        comparison = a.totalVisits - b.totalVisits;
        break;
      case "totalSpent":
        comparison = a.totalSpent - b.totalSpent;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setDeleting(true);
      await customerApi.deleteCustomer(customerToDelete.id);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      onCustomerDeleted();
    } finally {
      setDeleting(false);
    }
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) {
      return (
        <Icon
          name="ChevronsUpDown"
          size={16}
          className="text-muted-foreground"
        />
      );
    }
    return sortOrder === "asc" ? (
      <Icon name="ChevronUp" size={16} className="text-primary" />
    ) : (
      <Icon name="ChevronDown" size={16} className="text-primary" />
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Customer
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Contact
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Tags
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("lastVisit")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Last Visit
                  <SortIcon column="lastVisit" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("totalVisits")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Visits
                  <SortIcon column="totalVisits" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("totalSpent")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Total Spent
                  <SortIcon column="totalSpent" />
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCustomers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onCustomerSelect(customer)}
                className={`hover:bg-muted/30 transition-smooth cursor-pointer ${
                  selectedCustomerId === customer.id ? "bg-muted/50" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {customer.avatar ? (
                        <Image
                          src={customer.avatar}
                          alt={`${customer.name} profile photo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {customer.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {customer.phone}
                  </div>
                  {customer.email && (
                    <div className="text-xs text-muted-foreground">
                      {customer.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getTagColor(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(customer.lastVisit)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {customer.totalVisits}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">
                    INR {customer.totalSpent.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomerSelect(customer);
                      }}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      aria-label="View customer details"
                    >
                      <Icon
                        name="Eye"
                        size={16}
                        className="text-destructive"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomerToDelete(customer);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-md hover:bg-destructive/10 transition-smooth"
                      aria-label="Delete customer"
                    >
                      <Icon
                        name="Trash"
                        size={16}
                        className="text-destructive"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Customer"
          description={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
          onCancel={() => {
            setShowDeleteModal(false);
            setCustomerToDelete(null);
          }}
          onConfirm={handleDeleteCustomer}
          confirmColor="red"
        />
      </div>
    </div>
  );
};

export default CustomerTable;
