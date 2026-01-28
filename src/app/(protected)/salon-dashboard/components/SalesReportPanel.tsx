"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";
import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";
import Loader from "@/app/components/Loader";
import { appointmentApi } from "@/app/services/appointment.api";
import { showToast } from "@/app/components/ui/toast";
import { staffApi } from "@/app/services/staff.api";

const FILTER_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Custom", value: "custom" },
];

export default function SalesReportPanel() {
  const [filterType, setFilterType] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>();

  const fetchStaff = async () => {
    try {
      const res = await staffApi.getAllStaff();
      setStaff(res.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const staffOptions = staff.map((s: any) => ({
    label: s.fullName,
    value: s._id,
  }));

  const fetchReport = async () => {
    if (filterType === "custom") {
      if (!startDate || !endDate) {
        showToast({
          message: "Please select both start and end date",
          status: "info",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const params: any = {
        ...(filterType === "custom" ? { startDate, endDate } : {}),
        ...(selectedStaffId ? { staffId: selectedStaffId } : {}),
      };
      const res = await appointmentApi.getAppointmentSalesReport(
        filterType,
        params,
      );
      setReport(res);
      if (filterType === "custom") {
        setStartDate("");
        setEndDate("");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterType !== "custom") {
      fetchReport();
    }
  }, [filterType]);

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-56">
            <Select
              label="Date Filter"
              options={FILTER_OPTIONS}
              value={filterType}
              onChange={(val: string) => setFilterType(val)}
            />
          </div>

          <div className="w-56">
            <Select
              label="Staff"
              placeholder="All Staff"
              options={staffOptions}
              value={selectedStaffId}
              onChange={(val: string) => setSelectedStaffId(val)}
              clearable
            />
          </div>

          {filterType === "custom" && (
            <>
              <div className="w-44">
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="w-44">
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <Button className="h-10" onClick={fetchReport}>
                Apply
              </Button>
            </>
          )}
        </div>
      </div>

      {loading && <Loader label="Loading SalesReport..." />}

      {report && !loading && (
        <>
          {/* Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold">₹{report.totalSales}</p>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Commission</p>
              <p className="text-2xl font-semibold">
                ₹{report.totalCommission}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold">
                {report.totalAppointments}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-sm text-gray-500">Date Range</p>
              <p className="text-sm">
                {new Date(report.dateRange.from).toLocaleDateString()} –{" "}
                {new Date(report.dateRange.to).toLocaleDateString()}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
