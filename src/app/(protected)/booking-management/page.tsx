"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import {
  ViewMode,
  Booking,
  Customer,
  Service,
  Staff,
  TimeSlot,
  CalendarDay,
  BookingFormData,
  BookingFilters,
} from "./types";
import CalendarHeader from "./components/CalendarHeader";
import DayView from "./components/DayView";
import WeekView from "./components/WeekView";
import ViewAllAppointments from "./components/viewAll";
import QuickFilters from "./components/QuickFilters";
import BookingForm from "./components/BookingForm";
import BookingDetailsModal from "./components/BookingDetailsModal";
import { appointmentApi } from "@/app/services/appointment.api";
import { customerApi } from "@/app/services/customer.api";
import { serviceApi } from "@/app/services/service.api";
import { staffApi } from "@/app/services/staff.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { fetchProfileTimings } from "@/app/store/slices/profileSlice";
import Loader from "@/app/components/Loader";
import { isStaff } from "@/app/utils/routePermissions";

const BookingManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const user = useSelector((state: any) => state.auth.user);
  const timings = useSelector((state: any) => state.profile.timings);
  const isStaffUser = isStaff(user?.role);
  const loadBookings = useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);
      let res;

      if (user?.role?.[0] === "STAFF") {
        const staffId = user?._id || (user as any)?.id;
        if (!staffId) {
          console.error("Staff ID not found in user object");
          setLoading(false);
          return;
        }
        res = await appointmentApi.getStaffAppointments({ limit: 1000, staffId, role: "STAFF" });
      } else {
        res = await appointmentApi.getAllAppointments({ limit: 1000 });
      }
      // res is guaranteed to be an array now
      const rawBookings = Array.isArray(res) ? res : [];

      const mappedBookings: Booking[] = rawBookings.map((b: any) => {
        const services = Array.isArray(b.services) ? b.services : [];
        const singleService = b.serviceId;

        let serviceName = "Unknown Service";
        let serviceId = "";
        let serviceCategory = "General";
        let serviceDuration = 30;
        let servicePrice = 0;

        if (services.length > 0) {
          // When multiple services exist (populated)
          serviceName = services
            .map((s: any) => s?.serviceName || s?.name || "Service")
            .join(", ");

          serviceId = services[0]?._id || "";
          serviceCategory = services[0]?.category || "General";

          serviceDuration = services.reduce(
            (acc: any, s: any) => acc + (s?.duration || 0),
            0
          );

          servicePrice = services.reduce(
            (acc: any, s: any) => acc + (s?.price || 0),
            0
          );
        } else if (singleService) {
          // Single service fallback
          serviceName = singleService?.serviceName || "Unknown Service";
          serviceId = singleService?._id || "";
          serviceCategory = singleService?.category || "General";
          serviceDuration = singleService?.duration || 30;
          servicePrice = singleService?.price || 0;
        }

        return {
          id: b._id,
          customerId: b.customerId?._id,
          customerName: b.customerId?.fullName || "Unknown Customer",
          customerPhone: b.customerId?.phoneNumber,

          serviceId,
          serviceName,
          serviceCategory,
          serviceDuration,
          servicePrice,

          staffId: b.staffId?._id,
          staffName: b.staffId?.fullName || "Unknown Staff",

          date: new Date(b.appointmentDate),
          startTime: b.appointmentTime,
          endTime: calculateEndTime(b.appointmentTime, serviceDuration),

          status: b.status || "pending",
          notes: b.notes,
          paymentStatus: b.paymentStatus || "pending",
          createdAt: new Date(b.createdAt),
        };
      });

      if (mountedRef.current) {
        setBookings(mappedBookings);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error("Failed to load bookings", error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user]);

  const loadInitialData = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      // Skip protected resources when staff only has appointments access
      if (!isStaffUser) {
        try {
          const customerRes = await customerApi.getCustomers({
            page: 1,
            limit: 100,
          });
          const rawCustomers = Array.isArray(customerRes)
            ? customerRes
            : customerRes?.data || [];

          if (!mountedRef.current) return;

          setCustomers(
            rawCustomers.map((c: any) => ({
              ...c,
              id: c._id || c.id,
              name: c.fullName || c.name,
              phone: c.phoneNumber || c.phone,
              tags: c.customerTag || c.tags || [],
            }))
          );
        } catch (error) {
          // Silently fail customer fetch for non-staff users too
          console.error("Failed to load customers", error);
        }
        const serviceRes = await serviceApi.getAllServices({
          page: 1,
          limit: 100,
        });
        const rawServices = Array.isArray(serviceRes)
          ? serviceRes
          : serviceRes?.data || [];

        if (!mountedRef.current) return;

        setServices(
          rawServices.map((s: any) => ({
            ...s,
            id: s._id || s.id,
            name: s.serviceName || s.name,
          }))
        );

        const staffRes = await staffApi.getAllStaff({ page: 1, limit: 100 });
        const rawStaff = Array.isArray(staffRes)
          ? staffRes
          : staffRes?.data || [];

        if (!mountedRef.current) return;

        setStaff(
          rawStaff.map((s: any) => ({
            ...s,
            id: s._id || s.id,
            name: s.fullName || s.name,
            phone: s.phoneNumber || s.phone,
            isAvailable: s.isActive,
          }))
        );
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error("Failed to load booking dependencies", error);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProfileTimings());
  }, [dispatch]);

  useEffect(() => {
    mountedRef.current = true;
    loadInitialData();

    return () => {
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, [loadInitialData]);

  useEffect(() => {
    const staffIdFromUrl = searchParams.get("staffId");
    if (staffIdFromUrl) {
      setFilters((prev) => ({
        ...prev,
        staffId: staffIdFromUrl,
      }));
    }
  }, [searchParams]);

  const generateTimeSlots = (): TimeSlot[] => {
    // Default values if timings are not available
    let startHour = 9;
    let startMinute = 0;
    let endHour = 20; // Last booking slot starts at 20:00 (so closes after that)
    let endMinute = 0;

    let workingDays = [0, 1, 2, 3, 4, 5, 6]; // Default: all days

    if (timings) {
      if (timings.openingTime) {
        const [h, m] = timings.openingTime.split(":").map(Number);
        startHour = h;
        startMinute = m;
      }
      if (timings.closingTime) {
        const [h, m] = timings.closingTime.split(":").map(Number);
        endHour = h;
        endMinute = m;
      }
      if (timings.workingDays && Array.isArray(timings.workingDays)) {
        workingDays = timings.workingDays;
      }
    }

    const currentDayOfWeek = currentDate.getDay();
    // If today is not a working day, return empty slots or closed indication
    // For now, let's return empty slots effectively disabling the day
    if (!workingDays.includes(currentDayOfWeek)) {
       return [];
    }


    const slots: TimeSlot[] = [];
    
    // Convert everything to minutes for easier comparison
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Generate slots
    for (let timeInMinutes = startTotalMinutes; timeInMinutes < endTotalMinutes; timeInMinutes += 30) {
        const hour = Math.floor(timeInMinutes / 60);
        const minute = timeInMinutes % 60;
        
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
          
        const slotBookings = bookings.filter(
          (b) =>
            b.date.toDateString() === currentDate.toDateString() &&
            b.startTime === time &&
            (!filters.status || b.status === filters.status) &&
            (!filters.staffId || b.staffId === filters.staffId) &&
            (!filters.serviceId || b.serviceId === filters.serviceId)
        );
        
        slots.push({
          time,
          isAvailable: slotBookings.length === 0,
          bookings: slotBookings,
        });
    }
    
    return slots;
  };

  const generateWeekDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const bookingCount = bookings.filter(
        (b) => b.date.toDateString() === date.toDateString()
      ).length;

      days.push({
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: selectedDate?.toDateString() === date.toDateString(),
        bookingCount,
      });
    }
    return days;
  };

  const getBookingsByDay = (): Record<string, Booking[]> => {
    const bookingsByDay: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split("T")[0];
      if (!bookingsByDay[dateKey]) {
        bookingsByDay[dateKey] = [];
      }
      bookingsByDay[dateKey].push(booking);
    });
    return bookingsByDay;
  };

  const handlePreviousClick = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (time: string) => {
    if (isStaffUser) return;
    setSelectedDate(currentDate);
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
    setViewMode("day");
  };

  const convertDuration = (durationString: string) => {
    if (!durationString) return 30;
    const num = parseInt(durationString);
    if (durationString.includes("hour")) return num * 60;
    return num;
  };

  const handleBookingClick = async (bookingId: string) => {
    try {
      // API CALL
      const data = await appointmentApi.getAppointmentDetails(bookingId);
      if (!data) return;

      // MAP RESPONSE → Booking type used by modal
      const mappedBooking: Booking = {
        id: data._id,
        customerId: data.customerId?._id,
        customerName: data.customerId?.fullName || "Unknown Customer",
        customerPhone: data.customerId?.phoneNumber,

        serviceId: data.services?.[0]?._id || "",
        serviceName: data.services?.map((s: any) => s.serviceName).join(", "),
        serviceCategory: "General",
        serviceDuration: convertDuration(data.services?.[0]?.duration),
        servicePrice: data.services?.reduce(
          (sum: number, s: any) => sum + (s.price || 0),
          0
        ),

        staffId: data.staffId?._id,
        staffName: data.staffId?.fullName,

        date: new Date(data.appointmentDate),
        startTime: data.appointmentTime,
        endTime: calculateEndTime(
          data.appointmentTime,
          convertDuration(data.services?.[0]?.duration)
        ),

        status: data.status || "pending",
        notes: data.notes,
        paymentStatus: "pending",
        createdAt: new Date(data.createdAt),
      };

      setSelectedBooking(mappedBooking);
    } catch (err) {
      console.error("Error fetching appointment details:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, loadBookings]);

  const handleCreateBooking = async (data: BookingFormData) => {
    try {
      if (
        !data.customerId ||
        data.services.length === 0 ||
        !data.staffId ||
        !data.date ||
        !data.startTime
      ) {
        console.error("Missing required booking data");
        return;
      }

      await appointmentApi.createAppointment({
        customerId: data.customerId,
        services: data.services,
        staffId: data.staffId,
        appointmentDate: data.date.toISOString().split("T")[0],
        appointmentTime: data.startTime,
        notes: data.notes,
      });

      // Refetch bookings to update calendar
      // Refetch bookings to update calendar
      await loadBookings();

      setShowBookingForm(false);
      setSelectedDate(undefined);
      setSelectedTime(undefined);

      // OPTIONAL: You might want to show a success toast here if the API doesn't handle it
    } catch (error) {
      console.error("Failed to create appointment:", error);
      // Toast is already handled in appointmentApi
    }
  };

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handlePaymentStatusChange = (
    bookingId: string,
    paymentStatus: "pending" | "paid"
  ) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, paymentStatus } : b))
    );
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      await appointmentApi.updateAppointmentStatus(selectedBooking.id);

      await loadBookings(); // 🔥 Auto refresh UI
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Booking Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage appointments and schedule bookings
            </p>
          </div>

          {!isStaffUser && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowBookingForm(true)}
            >
              New Booking
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <CalendarHeader
                currentDate={currentDate}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onPreviousClick={handlePreviousClick}
                onNextClick={handleNextClick}
                onTodayClick={handleTodayClick}
              />

              <div className="min-h-[600px]">
                {loading ? (
                  <Loader label="Loading bookings..." />
                ) : (
                  <>
                    {viewMode === "day" && (
                      <DayView
                        timeSlots={generateTimeSlots()}
                        onBookingClick={handleBookingClick}
                        onTimeSlotClick={handleTimeSlotClick}
                        onStatusChange={handleStatusChange}
                      />
                    )}

                    {viewMode === "week" && (
                      <WeekView
                        weekDays={generateWeekDays()}
                        bookingsByDay={getBookingsByDay()}
                        onDayClick={handleDayClick}
                        onBookingClick={handleBookingClick}
                      />
                    )}

                    {viewMode === "viewAll" && (
                      <ViewAllAppointments
                        onBookingClick={handleBookingClick}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <QuickFilters
              filters={filters}
              staff={staff}
              services={services}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={16} />
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Bookings
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {
                      // bookings.filter(
                      //   (b) =>
                      //     b.date.toDateString() === new Date().toDateString()
                      // ).length
                      bookings.length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Today's Bookings
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {
                      bookings.filter(
                        (b) =>
                          b.date.toDateString() === new Date().toDateString()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Confirmed
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {bookings.filter((b) => b.status === "Confirmed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="text-sm font-semibold text-success">
                    {bookings.filter((b) => b.status === "Completed").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isStaffUser && showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="max-w-2xl w-full">
            <BookingForm
              customers={customers}
              services={services}
              staff={staff}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={handleCreateBooking}
              onCancel={() => {
                setShowBookingForm(false);
                setSelectedDate(undefined);
                setSelectedTime(undefined);
              }}
            />
          </div>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          handleStatusUpdate={handleStatusUpdate}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onDelete={handleDeleteBooking}
        />
      )}
    </>
  );
};

export default BookingManagement;
