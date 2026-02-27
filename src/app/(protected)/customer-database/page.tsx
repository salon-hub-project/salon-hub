"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import CustomerTable from "./components/CustomerTable";
import CustomerFilters from "./components/CustomerFilters";
import CustomerProfile from "./components/CustomerProfile";
import CustomerForm from "./components/CustomerForm";
import MobileCustomerCard from "./components/MobileCustomerCard";
import { customerTags } from "./types";

import {
  Customer,
  CustomerFilters as FilterType,
  CustomerFormData,
  ServiceHistory,
  CustomerTagItem,
} from "./types";
import { useRouter, useSearchParams } from "next/navigation";
import { customerApi } from "@/app/services/customer.api";
import Pagination from "@/app/components/Pagination";
import Loader from "@/app/components/Loader";
import { showToast } from "@/app/components/ui/toast";
import { comboApi } from "@/app/services/combo.api";
import { ComboOffer } from "../combo-offers-management/types";
import { useDebounce } from "@/app/store/hooks";

const CustomerDatabase = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showProfile, setShowProfile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined,
  );
  const [totalCustomers, setTotalCustomers] = useState(0);

  //  Customer Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: "",
    tags: [],
    gender: "",
    type: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [customerLoading, setCustomerLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [availableCombos, setAvailableCombos] = useState<ComboOffer[]>([]);
  const [sendingMessages, setSendingMessages] = useState(false);
  const debouncedSearch = useDebounce(filters.searchQuery, 500);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  // Detect customerId from URL and open profile
  useEffect(() => {
    const customerIdFromUrl = searchParams.get("customerId");
    if (customerIdFromUrl) {
      handleCustomerSelect(customerIdFromUrl);
    }
  }, [searchParams]);

  //Fetch Customers:-
  const fetchCustomers = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    try {
      const response = await customerApi.getCustomers({
        page,
        limit: 10,
        ...(debouncedSearch &&
          (/^\d+$/.test(debouncedSearch)
            ? { phoneNumber: debouncedSearch }
            : { fullName: debouncedSearch })),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.tags.length > 0 && { customerTag: filters.tags }),
        ...(filters.type && { type: filters.type }),
      });

      setTotalCustomers(response.meta.total);
      // Only update state if component is still mounted
      if (!mountedRef.current) return;

      const mappedCustomers: Customer[] = response.data.map((c: any) => ({
        id: c._id,
        name: c.fullName,
        phone: c.phoneNumber,
        email: c.email,
        gender: c.gender,
        dateOfBirth: c.DOB ? c.DOB.split("T")[0] : "",
        address: c.address || "",
        notes: c.notes || "",
        tags: c.customerTag || [],
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined,
        totalVisits: c.totalVisits,
        totalSpent: c.totalSpent,
        createdAt: new Date(c.createdAt),
        preferredStaff:
          c.preferredStaff?._id || c.preferredStaff?.fullName || "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}`,
      }));
      const sortedCustomers = [...mappedCustomers].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      setCustomers(sortedCustomers);
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
  }, [page, debouncedSearch, filters.gender, filters.tags, filters.type]);

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
  }, [debouncedSearch, filters.gender, filters.tags, filters.type]);

  const mockServiceHistory: ServiceHistory[] = [
    {
      id: "1",
      customerId: "1",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      services: [
        {
          id: "1",
          name: "Hair Cut & Style",
          category: "Hair",
          duration: 60,
          price: 65.0,
        },
        {
          id: "2",
          name: "Deep Conditioning",
          category: "Hair",
          duration: 30,
          price: 35.0,
        },
      ],
      staffName: "Sarah Johnson",
      totalAmount: 100.0,
      paymentStatus: "paid",
      notes: "Customer very satisfied with the service.",
    },
    {
      id: "2",
      customerId: "1",
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      services: [
        {
          id: "3",
          name: "Hair Coloring",
          category: "Hair",
          duration: 120,
          price: 150.0,
        },
      ],
      staffName: "Sarah Johnson",
      totalAmount: 150.0,
      paymentStatus: "paid",
    },
    {
      id: "3",
      customerId: "1",
      date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      services: [
        {
          id: "1",
          name: "Hair Cut & Style",
          category: "Hair",
          duration: 60,
          price: 65.0,
        },
        {
          id: "4",
          name: "Manicure",
          category: "Nails",
          duration: 45,
          price: 40.0,
        },
      ],
      staffName: "Emily Rodriguez",
      totalAmount: 105.0,
      paymentStatus: "paid",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        phone: c.phoneNumber,
        email: c.email,
        gender: c.gender,
        dateOfBirth: c.DOB ? c.DOB.split("T")[0] : "",
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

  const handleImportCustomers = async (file: File) => {
    try {
      setLoading(true);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!jsonData.length) {
        showToast({ message: "Excel file is empty", status: "error" });
        return;
      }

      // ✅ Only name + phoneNumber
      const customers = jsonData
        .map((row) => ({
          fullName:
            row["name"] ||
            row["Name"] ||
            row["fullName"] ||
            row["Full Name"] ||
            row["customerName"] ||
            row["Customer Name"] ||
            row["clientName"] ||
            row["Client Name"] ||
            row["leadName"] ||
            row["Lead Name"] ||
            row["contactName"] ||
            row["Contact Name"] ||
            row["personName"] ||
            row["Person Name"] ||
            row["buyerName"] ||
            row["Buyer Name"] ||
            row["userName"] ||
            row["User Name"] ||
            row["consumerName"] ||
            row["Consumer Name"] ||
            row["accountName"] ||
            row["Account Name"] ||
            row["prospectName"] ||
            row["Prospect Name"] ||
            row["patientName"] ||
            row["Patient Name"] ||
            row["guestName"] ||
            row["Guest Name"] ||
            row["full_name"] ||
            row["customer_name"] ||
            row["client_name"] ||
            row["contact_name"] ||
            "",

          phoneNumber: String(
            row["phoneNumber"] ||
              row["Phone Number"] ||
              row["phone"] ||
              row["Phone"] ||
              row["mobile"] ||
              row["Mobile"] ||
              row["mobileNumber"] ||
              row["Mobile Number"] ||
              row["contactNumber"] ||
              row["Contact Number"] ||
              row["contactNo"] ||
              row["Contact No"] ||
              row["phoneNo"] ||
              row["Phone No"] ||
              row["telephone"] ||
              row["Telephone"] ||
              row["tel"] ||
              row["Tel"] ||
              row["cell"] ||
              row["Cell"] ||
              row["cellNumber"] ||
              row["Cell Number"] ||
              row["whatsapp"] ||
              row["WhatsApp"] ||
              row["whatsappNumber"] ||
              row["WhatsApp Number"] ||
              row["primaryPhone"] ||
              row["Primary Phone"] ||
              row["secondaryPhone"] ||
              row["Secondary Phone"] ||
              row["contact"] ||
              row["Contact"] ||
              row["phone_number"] ||
              row["mobile_number"] ||
              row["contact_number"] ||
              "",
          ).trim(),
        }))
        .filter((c) => c.fullName && c.phoneNumber);

      if (!customers.length) {
        showToast({
          message: "No valid name & phoneNumber found",
          status: "error",
        });
        return;
      }

      await customerApi.importCustomerByExcel(customers);

      showToast({
        message: `${customers.length} customers imported successfully`,
        status: "success",
      });

      fetchCustomers(); // refresh list
    } catch (error) {
      console.error("Import failed", error);
      showToast({ message: "Failed to import customers", status: "error" });
    } finally {
      setLoading(false);
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
    router.push(`/booking-management?customerId=${customerId}`);
  };

  const handleSendMessage = (customerId: string) => {
    console.log("Sending message to customer:", customerId);
    alert(
      "WhatsApp message feature will be implemented with WhatsApp Business API integration.",
    );
  };

  const handleExport = () => {
    console.log("Exporting customer data...");
    alert(
      "Customer data export functionality will generate an Excel file with all customer information.",
    );
  };

  const openComboModal = async () => {
    try {
      const res = await comboApi.getAllComboOffers({ limit: 100 });
      const mappedCombos = (res.data || []).map((combo: any) => ({
        ...combo,
        id: combo._id || combo.id,
        originalPrice: combo.actualPrice,
        discountedPrice: combo.discountedPrice,
      }));
      setAvailableCombos(mappedCombos);
      setIsComboModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch combos", error);
    }
  };

  const handleSendBulkCombo = async (comboId: string) => {
    try {
      setSendingMessages(true);
      const numbers = customers
        .filter((c) => selectedIds.includes(c.id))
        .map((c) => c.phone)
        .filter(Boolean);

      if (numbers.length === 0) {
        showToast({
          message: "No phone numbers found for selected customers",
          status: "error",
        });
        return;
      }

      await comboApi.sendComboMessage(comboId, numbers);
      setIsComboModalOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to send bulk combo", error);
    } finally {
      setSendingMessages(false);
    }
  };

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Customers
            </h1>
            <p className="text-muted-foreground">
              Manage customer relationships and service history
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button
                variant="outline"
                iconName="Send"
                onClick={openComboModal}
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
              >
                Send Combo Offer ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="default"
              iconName="UserPlus"
              iconPosition="left"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>

        <CustomerFilters
          filters={filters}
          onFiltersChange={setFilters}
          onImport={handleImportCustomers}
          totalCustomers={totalCustomers}
        />

        {loading ? (
          <Loader label="Loading customers..." />
        ) : customers.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Icon
              name="Users"
              size={64}
              className="text-muted-foreground mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No customers found
            </h3>
            <p className="text-muted-foreground mb-6">
              {filters.searchQuery || filters.tags.length > 0 || filters.gender
                ? "Try adjusting your filters to see more results"
                : "Get started by adding your first customer"}
            </p>
            {!filters.searchQuery &&
              filters.tags.length === 0 &&
              !filters.gender && (
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
                    isSelected={selectedIds.includes(customer.id)}
                    onToggle={(id) => {
                      setSelectedIds((prev) =>
                        prev.includes(id)
                          ? prev.filter((item) => item !== id)
                          : [...prev, id],
                      );
                    }}
                  />
                ))}
              </div>
            ) : (
              <CustomerTable
                customers={customers}
                onCustomerSelect={(customer) =>
                  handleCustomerSelect(customer.id)
                }
                onEditCustomer={handleEditCustomer}
                selectedCustomerId={selectedCustomer?.id || null}
                onCustomerDeleted={fetchCustomers}
                selectedCustomers={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
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
            (h) => h.customerId === selectedCustomer.id,
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
          customerTags={customerTags}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(undefined);
          }}
          onSuccess={handleSaveCustomer}
        />
      )}
      {isComboModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Select Combo Offer
              </h2>
              <button
                onClick={() => setIsComboModalOpen(false)}
                className="p-2 rounded-md hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {availableCombos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active combo offers found.
                </p>
              ) : (
                availableCombos.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => handleSendBulkCombo(combo.id)}
                    disabled={sendingMessages}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-smooth text-left group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {combo.name}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {combo.description}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-primary">
                          INR {combo.discountedPrice}
                        </div>
                        <div className="text-xs text-muted-foreground line-through">
                          INR {combo.originalPrice}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setIsComboModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDatabase;
