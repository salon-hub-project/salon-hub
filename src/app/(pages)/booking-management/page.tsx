"use client";
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MobileBottomNav from '../../components/MobileBottomNav';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// import CalendarHeader from './components/CalendarHeader';
// import DayView from './components/DayView';
// import WeekView from './components/WeekView';
// import BookingForm from './components/BookingForm';
// import BookingDetailsModal from './components/BookingDetailsModal';
// import QuickFilters from './components/QuickFilters';
import { ViewMode,Booking,
      Customer,
      Service,
      Staff,
      TimeSlot,
      CalendarDay,
      BookingFormData,
      BookingFilters, } from './types';
import CalendarHeader from './components/CalendarHeader';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import QuickFilters from './components/QuickFilters';
import BookingForm from './components/BookingForm';
import BookingDetailsModal from './components/BookingDetailsModal';


const BookingManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const mockCustomers: Customer[] = [
    {
      id: 'c1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@email.com',
      gender: 'female',
      tags: ['VIP', 'Frequent'],
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      totalVisits: 15,
      lastVisit: new Date('2024-01-10'),
    },
    {
      id: 'c2',
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      email: 'michael.c@email.com',
      gender: 'male',
      tags: ['New'],
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      totalVisits: 2,
      lastVisit: new Date('2024-01-08'),
    },
    {
      id: 'c3',
      name: 'Emily Rodriguez',
      phone: '+1 (555) 345-6789',
      email: 'emily.r@email.com',
      gender: 'female',
      tags: ['Frequent'],
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      totalVisits: 8,
      lastVisit: new Date('2024-01-12'),
    },
  ];

  const mockServices: Service[] = [
    {
      id: 's1',
      name: 'Haircut & Styling',
      category: 'Hair',
      duration: 60,
      price: 45.0,
      isPopular: true,
      isActive: true,
    },
    {
      id: 's2',
      name: 'Hair Coloring',
      category: 'Hair',
      duration: 120,
      price: 85.0,
      isPopular: true,
      isActive: true,
    },
    {
      id: 's3',
      name: 'Manicure',
      category: 'Nails',
      duration: 45,
      price: 30.0,
      isPopular: false,
      isActive: true,
    },
    {
      id: 's4',
      name: 'Pedicure',
      category: 'Nails',
      duration: 60,
      price: 40.0,
      isPopular: false,
      isActive: true,
    },
    {
      id: 's5',
      name: 'Facial Treatment',
      category: 'Skincare',
      duration: 90,
      price: 75.0,
      isPopular: true,
      isActive: true,
    },
  ];

  const mockStaff: Staff[] = [
    {
      id: 'st1',
      name: 'Jessica Martinez',
      role: 'Senior Stylist',
      phone: '+1 (555) 111-2222',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      specializations: ['Hair', 'Styling'],
      isAvailable: true,
    },
    {
      id: 'st2',
      name: 'David Kim',
      role: 'Hair Colorist',
      phone: '+1 (555) 222-3333',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      specializations: ['Hair', 'Coloring'],
      isAvailable: true,
    },
    {
      id: 'st3',
      name: 'Amanda Foster',
      role: 'Nail Technician',
      phone: '+1 (555) 333-4444',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      specializations: ['Nails', 'Manicure', 'Pedicure'],
      isAvailable: true,
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: 'b1',
      customerId: 'c1',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      customerAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      serviceId: 's1',
      serviceName: 'Haircut & Styling',
      serviceCategory: 'Hair',
      serviceDuration: 60,
      servicePrice: 45.0,
      staffId: 'st1',
      staffName: 'Jessica Martinez',
      staffAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      status: 'confirmed',
      notes: 'Customer prefers layered cut',
      paymentStatus: 'pending',
      createdAt: new Date(),
    },
    {
      id: 'b2',
      customerId: 'c2',
      customerName: 'Michael Chen',
      customerPhone: '+1 (555) 234-5678',
      customerAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      serviceId: 's2',
      serviceName: 'Hair Coloring',
      serviceCategory: 'Hair',
      serviceDuration: 120,
      servicePrice: 85.0,
      staffId: 'st2',
      staffName: 'David Kim',
      staffAvatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      date: new Date(),
      startTime: '10:30',
      endTime: '12:30',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
    },
    {
      id: 'b3',
      customerId: 'c3',
      customerName: 'Emily Rodriguez',
      customerPhone: '+1 (555) 345-6789',
      customerAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      serviceId: 's3',
      serviceName: 'Manicure',
      serviceCategory: 'Nails',
      serviceDuration: 45,
      servicePrice: 30.0,
      staffId: 'st3',
      staffName: 'Amanda Foster',
      staffAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      date: new Date(),
      startTime: '14:00',
      endTime: '14:45',
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: new Date(),
    },
  ];

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
      const dateKey = booking.date.toISOString().split('T')[0];
      if (!bookingsByDay[dateKey]) {
        bookingsByDay[dateKey] = [];
      }
      bookingsByDay[dateKey].push(booking);
    });
    return bookingsByDay;
  };

  const handlePreviousClick = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
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
    setSelectedDate(currentDate);
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleBookingClick = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  const handleCreateBooking = (data: BookingFormData) => {
    const customer = mockCustomers.find((c) => c.id === data.customerId);
    const service = mockServices.find((s) => s.id === data.serviceId);
    const staff = mockStaff.find((s) => s.id === data.staffId);

    if (!customer || !service || !staff) return;

    const endTime = calculateEndTime(data.startTime, service.duration);

    const newBooking: Booking = {
      id: `b${bookings.length + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAvatar: customer.avatar,
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      serviceDuration: service.duration,
      servicePrice: service.price,
      staffId: staff.id,
      staffName: staff.name,
      staffAvatar: staff.avatar,
      date: data.date,
      startTime: data.startTime,
      endTime,
      status: 'pending',
      notes: data.notes,
      paymentStatus: 'pending',
      createdAt: new Date(),
    };

    setBookings([...bookings, newBooking]);
    setShowBookingForm(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleStatusChange = (bookingId: string, status: Booking['status']) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handlePaymentStatusChange = (bookingId: string, paymentStatus: 'pending' | 'paid') => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, paymentStatus } : b))
    );
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const currentUser = {
    name: 'John Smith',
    email: 'john.smith@salonhub.com',
    role: 'salon_owner' as const,
    salonName: 'Glamour Studio',
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={currentUser.role} />
      <Header user={currentUser} notifications={3} />

      <main className="lg:ml-sidebar pt-header pb-bottom-nav lg:pb-0">
        <div className="p-4 lg:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage appointments and schedule bookings
              </p>
            </div>

            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowBookingForm(true)}
            >
              New Booking
            </Button>
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
                  {viewMode === 'day' ? (
                    <DayView
                      timeSlots={generateTimeSlots()}
                      onBookingClick={handleBookingClick}
                      onTimeSlotClick={handleTimeSlotClick}
                      onStatusChange={handleStatusChange}
                    />
                  ) : (
                    <WeekView
                      weekDays={generateWeekDays()}
                      bookingsByDay={getBookingsByDay()}
                      onDayClick={handleDayClick}
                      onBookingClick={handleBookingClick}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <QuickFilters
                filters={filters}
                staff={mockStaff}
                services={mockServices}
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
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                    <span className="text-sm font-semibold text-foreground">
                      {bookings.filter((b) => b.date.toDateString() === new Date().toDateString()).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confirmed</span>
                    <span className="text-sm font-semibold text-primary">
                      {bookings.filter((b) => b.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="text-sm font-semibold text-warning">
                      {bookings.filter((b) => b.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-sm font-semibold text-success">
                      {bookings.filter((b) => b.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="max-w-2xl w-full">
            <BookingForm
              customers={mockCustomers}
              services={mockServices}
              staff={mockStaff}
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
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onDelete={handleDeleteBooking}
        />
      )}

      <MobileBottomNav userRole={currentUser.role} />
    </div>
  );
};

export default BookingManagement;