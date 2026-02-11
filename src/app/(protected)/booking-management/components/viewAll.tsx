"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import Icon from "@/app/components/AppIcon";
import Pagination from "@/app/components/Pagination";
import Loader from "@/app/components/Loader";
import { formatTo12Hour } from "@/app/utils/formatHour";
import { Booking, BookingFilters } from "../types";

interface UserRef {
  _id?: string;
  fullName?: string;
}

interface Appointment {
  _id: string;
  customerId: UserRef;
  staffId: UserRef;
  status: string;
  commisionEarned: number;
  appointmentDate: string;
  appointmentTime: string;
}

interface ViewAllAppointmentsProps {
  bookings: Booking[];
  filters: BookingFilters;
  onBookingClick: (bookingId: string) => void;
}

const ViewAllAppointments = ({
  onBookingClick,
  bookings,
  filters,
}: ViewAllAppointmentsProps) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const user = useAppSelector((state) => state.auth.user);
  const role = (user?.role ?? []) as ("OWNER" | "STAFF")[];

  const filteredAppointments = bookings.filter((b) => {
    if (filters.status && b.status !== filters.status) return false;
    if (filters.staffId && b.staffId !== filters.staffId) return false;
    if (filters.serviceId && b.serviceId !== filters.serviceId) return false;
    if (
      filters.searchQuery &&
      !b.customerName?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 text-success font-medium">
          <Icon name="CheckCircle" size={14} />
          Completed
        </span>
      );
    }

    if (status === "Confirmed") {
      return (
        <span className="inline-flex items-center gap-1 text-primary font-medium">
          Confirmed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-warning font-medium">
        Pending
      </span>
    );
  };

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Appointments</h2>
        <p className="text-sm text-muted-foreground">
          View and manage all appointments
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3 font-bold text-foreground">Customer</th>
              <th className="p-3 font-bold text-foreground">
                {" "}
                {role[0] === "OWNER" && "Staff"}
              </th>
              <th className="p-3 font-bold text-foreground">Date of Appt.</th>
              <th className="p-3 font-bold text-foreground">Time of Appt.</th>
              <th className="p-3 font-bold text-foreground">Status</th>
              <th className="p-3 font-bold text-foreground">Commission</th>
              <th className="p-3 font-bold text-foreground text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-muted-foreground"
                >
                  <Loader label="Loading appointments..." />
                </td>
              </tr>
            ) : paginatedAppointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  No appointments found
                </td>
              </tr>
            ) : (
              paginatedAppointments.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition"
                >
                  <td className="p-3">{item.customerName ?? "-"}</td>
                  <td className="p-3 font-medium">
                    {role[0] === "OWNER" && (item.staffName ?? "-")}
                  </td>
                  <td className="p-3">
                    {item?.date
                      ? new Date(item.date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "/")
                      : "-"}
                  </td>

                  <td className="p-3">
                    {item?.startTime ? formatTo12Hour(item.startTime) : "-"}
                  </td>

                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3 pl-10">
                    {item?.commisionEarned
                      ? `${item?.commisionEarned}INR`
                      : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <Icon
                        name="Eye"
                        size={16}
                        className="cursor-pointer"
                        onClick={() => onBookingClick(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="pb-4"
      />
    </div>
  );
};

export default ViewAllAppointments;
