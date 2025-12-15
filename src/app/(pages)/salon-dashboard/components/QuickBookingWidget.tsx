"use client";
import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface QuickBookingWidgetProps {
  onCreateBooking: (data: BookingData) => void;
}

interface BookingData {
  customer: string;
  service: string;
  date: string;
  time: string;
  staff: string;
}

const QuickBookingWidget = ({ onCreateBooking }: QuickBookingWidgetProps) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    customer: '',
    service: '',
    date: '',
    time: '',
    staff: '',
  });

  const serviceOptions = [
    { value: 'haircut', label: 'Haircut' },
    { value: 'coloring', label: 'Hair Coloring' },
    { value: 'styling', label: 'Hair Styling' },
    { value: 'facial', label: 'Facial Treatment' },
    { value: 'manicure', label: 'Manicure' },
    { value: 'pedicure', label: 'Pedicure' },
  ];

  const staffOptions = [
    { value: 'sarah', label: 'Sarah Johnson' },
    { value: 'emily', label: 'Emily Davis' },
    { value: 'michael', label: 'Michael Brown' },
    { value: 'jessica', label: 'Jessica Wilson' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBooking(bookingData);
    setBookingData({
      customer: '',
      service: '',
      date: '',
      time: '',
      staff: '',
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CalendarPlus" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Quick Booking</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          type="text"
          placeholder="Search or enter customer name"
          value={bookingData.customer}
          onChange={(e) =>
            setBookingData({ ...bookingData, customer: e.target.value })
          }
          required
        />

        <Select
          label="Service"
          placeholder="Select service"
          options={serviceOptions}
          value={bookingData.service}
          onChange={(value) =>
            setBookingData({ ...bookingData, service: value as string })
          }
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={bookingData.date}
            onChange={(e) =>
              setBookingData({ ...bookingData, date: e.target.value })
            }
            required
          />

          <Input
            label="Time"
            type="time"
            value={bookingData.time}
            onChange={(e) =>
              setBookingData({ ...bookingData, time: e.target.value })
            }
            required
          />
        </div>

        <Select
          label="Staff Member"
          placeholder="Select staff"
          options={staffOptions}
          value={bookingData.staff}
          onChange={(value) =>
            setBookingData({ ...bookingData, staff: value as string })
          }
          required
        />

        <Button type="submit" variant="default" fullWidth iconName="Plus">
          Create Booking
        </Button>
      </form>
    </div>
  );
};

export default QuickBookingWidget;