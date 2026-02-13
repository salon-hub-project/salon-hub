import Loader from "@/app/components/Loader";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { Employee } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";
import { appointmentApi } from "@/app/services/appointment.api";
import { staffApi } from "@/app/services/staff.api";
import { useState } from "react";

interface EmployeeDetailsPanelProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  loading?: boolean;
  onResetAchieved: (staffId: string) => void;
  profileWorkingDays?: string[];
}

const EmployeeDetailsPanel = ({
  employee,
  onClose,
  onEdit,
  loading,
  onResetAchieved,
  profileWorkingDays = [],
}: EmployeeDetailsPanelProps) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showCommissionHistory, setShowCommissionHistory] = useState(false);
  const [commissionHistory, setCommissionHistory] = useState<any[]>([]);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionError, setCommissionError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null,
  );

  if (!employee && !loading) return null;

  // From here on, employee is guaranteed to exist when not loading
  const workingDays = employee
    ? Object.entries(employee.availability ?? {})
        .filter(([day, isWorking]) => {
          if (!isWorking) return false;
          if (profileWorkingDays.length === 0) return true;
          const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
          return profileWorkingDays.includes(capitalizedDay);
        })
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
    : [];

  const handleFetchCommissionHistory = async (staffId: string) => {
    try {
      setCommissionLoading(true);
      setCommissionError(null);

      const res = await staffApi.commissionHistory(staffId);

      if (res?.success) {
        setCommissionHistory(res.data || []);
      } else {
        setCommissionHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch commission history", error);
      setCommissionError("Failed to load commission history");
    } finally {
      setCommissionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Employee Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              iconSize={20}
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
          <div className="p-6">
            <Loader label="Loading employee details..." />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const totalCommission =
    Number(employee.performanceMetrics?.totalCommisionEarned || 0) +
    Number(employee.performanceMetrics?.lifetimeCommision || 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Employee Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <EmployeeAvatar employee={employee} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground">
                {employee.name}
              </h3>
              <p className="text-muted-foreground mt-1">
                {employee.role.length > 0 ? employee.role.join(", ") : "N/A"}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    employee.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      employee.status === "active"
                        ? "bg-success"
                        : "bg-muted-foreground"
                    }`}
                  />
                  {employee.status === "active" ? "Active" : "Inactive"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => onEdit(employee)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon
                      name="Phone"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon
                      name="Mail"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon
                      name="Calendar"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-foreground">
                      Joined{" "}
                      {new Date(employee.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Working Days
                </h4>
                <div className="flex flex-wrap gap-2">
                  {workingDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Commission Rate
                </h4>
                <p className="text-2xl font-bold text-primary">
                  {employee.commissionRate}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Completed Appointments
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {employee.performanceMetrics.completedServices}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-smooth"
                        style={{
                          width: `${Math.min(
                            (employee.performanceMetrics.completedServices /
                              100) *
                              100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Customer Rating
                      </span>
                      <div className="flex items-center gap-1">
                        <Icon
                          name="Star"
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {employee.performanceMetrics.customerRating.toFixed(
                            1,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-smooth"
                        style={{
                          width: `${
                            (employee.performanceMetrics.customerRating / 5) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      {/* <span className="text-sm text-muted-foreground">
                        Booking Completion
                      </span> */}
                      {/* <span className="text-sm font-medium text-foreground">
                        {employee.performanceMetrics.bookingCompletionRate}%
                      </span> */}
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-smooth"
                        style={{
                          width: `${employee.performanceMetrics.bookingCompletionRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Achieved Amount
                      </span>
                      <span className="text-lg font-bold text-success">
                        INR{" "}
                        {(
                          employee.performanceMetrics?.achievedAmount ?? 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Revenue Generated
                    </span>
                    <span className="text-lg font-bold text-success">
                      INR{" "}
                      {employee.performanceMetrics.revenueGenerated.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Commission Earned
                    </span>
                    <span className="text-lg font-bold text-success">
                      INR {totalCommission}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Paid Commission
                    </span>
                    <span className="text-lg font-bold text-success">
                      INR{" "}
                      {employee.performanceMetrics.lifetimeCommision?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Remaining Commission
                    </span>
                    <span className="text-lg font-bold text-success">
                      INR{" "}
                      {(
                        totalCommission -
                        (employee.performanceMetrics?.lifetimeCommision ?? 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  iconName="RotateCcw"
                  onClick={() => onResetAchieved(employee.id)}
                  className="w-full"
                >
                  Reset Commission
                </Button>
              </div>

              {/* Reset Summary */}
              {employee?.performanceMetrics?.lastResetCommissionAmount !==
                undefined && (
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Reset Commission Amount
                    </span>
                    <span className="text-sm font-semibold text-destructive">
                      INR{" "}
                      {employee.performanceMetrics.lastResetCommissionAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Assigned Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {employee.assignedServices.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-muted text-foreground rounded-md text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target */}
            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Target
              </h4>
              <p className="text-lg font-bold text-primary">
                {employee.target || "-"}
              </p>
            </div>

            {/* Target Type */}
            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Target Type
              </h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                {employee.targetType || "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Calendar"
              iconPosition="left"
              fullWidth
              onClick={async () => {
                if (!employee) return;
                setShowSchedule(true);
                if (appointments.length > 0) return;
                try {
                  setAppointmentsLoading(true);
                  setAppointmentsError(null);
                  const data = await appointmentApi.getStaffAppointments({
                    staffId: employee.id,
                    limit: 1000,
                  });
                  setAppointments(Array.isArray(data) ? data : []);
                } catch (err) {
                  console.error("Failed to load staff appointments", err);
                  setAppointmentsError("Failed to load appointments");
                } finally {
                  setAppointmentsLoading(false);
                }
              }}
            >
              View Schedule
            </Button>
            <Button
              variant="outline"
              iconPosition="left"
              fullWidth
              onClick={async () => {
                if (!employee) return;
                setShowCommissionHistory(true);
                if (commissionHistory.length === 0) {
                  handleFetchCommissionHistory(employee.id);
                }
              }}
            >
              View Commission History
            </Button>
          </div>

          {/* {showSchedule && (
            <div className="mt-4 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Appointment Schedule
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSchedule(false)}
                >
                  Close
                </Button>
              </div>

              {appointmentsLoading ? (
                <Loader label="Loading appointments..." />
              ) : appointmentsError ? (
                <p className="text-sm text-destructive">{appointmentsError}</p>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No appointments found for this staff member.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="p-2 font-medium text-foreground">
                          Date
                        </th>
                        <th className="p-2 font-medium text-foreground">
                          Time
                        </th>
                        <th className="p-2 font-medium text-foreground">
                          Customer
                        </th>
                        <th className="p-2 font-medium text-foreground">
                          Services
                        </th>
                        <th className="p-2 font-medium text-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr
                          key={appt._id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-2">
                            {appt.appointmentDate
                              ? new Date(
                                  appt.appointmentDate
                                ).toLocaleDateString("en-US")
                              : "-"}
                          </td>
                          <td className="p-2">
                            {appt.appointmentTime || "-"}
                          </td>
                          <td className="p-2">
                            {appt.customerId?.fullName || "Unknown"}
                          </td>
                          <td className="p-2">
                            {Array.isArray(appt.services) &&
                            appt.services.length > 0
                              ? appt.services
                                  .map(
                                    (s: any) =>
                                      s?.serviceName || s?.name || "Service"
                                  )
                                  .join(", ")
                              : appt.serviceId?.serviceName || "-"}
                          </td>
                          <td className="p-2">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-foreground">
                              {appt.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )} */}
          {showSchedule && (
            <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-foreground">
                    Appointment Schedule
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    iconSize={18}
                    onClick={() => setShowSchedule(false)}
                    className="text-muted-foreground hover:text-foreground"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {appointmentsLoading ? (
                    <Loader label="Loading appointments..." />
                  ) : appointmentsError ? (
                    <p className="text-sm text-destructive">
                      {appointmentsError}
                    </p>
                  ) : appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No appointments found for this staff member.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="p-2 font-medium text-foreground">
                              Date
                            </th>
                            <th className="p-2 font-medium text-foreground">
                              Time
                            </th>
                            <th className="p-2 font-medium text-foreground">
                              Customer
                            </th>
                            <th className="p-2 font-medium text-foreground">
                              Services
                            </th>
                            <th className="p-2 font-medium text-foreground">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appt) => (
                            <tr
                              key={appt._id}
                              className="border-b border-border last:border-0"
                            >
                              <td className="p-2">
                                {appt.appointmentDate
                                  ? new Date(
                                      appt.appointmentDate,
                                    ).toLocaleDateString("en-US")
                                  : "-"}
                              </td>
                              <td className="p-2">
                                {appt.appointmentTime || "-"}
                              </td>
                              <td className="p-2">
                                {appt.customerId?.fullName || "Unknown"}
                              </td>
                              <td className="p-2">
                                {Array.isArray(appt.services) &&
                                appt.services.length > 0
                                  ? appt.services
                                      .map(
                                        (s: any) =>
                                          s?.serviceName ||
                                          s?.name ||
                                          "Service",
                                      )
                                      .join(", ")
                                  : appt.serviceId?.serviceName || "-"}
                              </td>
                              <td className="p-2">
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-foreground">
                                  {appt.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showCommissionHistory && (
            <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-foreground">
                    Commission History
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    iconSize={18}
                    onClick={() => setShowCommissionHistory(false)}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {commissionLoading ? (
                    <Loader label="Loading commission history..." />
                  ) : commissionError ? (
                    <p className="text-sm text-destructive">
                      {commissionError}
                    </p>
                  ) : commissionHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No commission history found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="p-2">Target Type</th>
                            <th className="p-2">Start Date</th>
                            <th className="p-2">End Date</th>
                            {/* <th className="p-2">Achieved Amount</th> */}
                            {/* <th className="p-2">Commission Before Reset</th> */}
                            <th className="p-2">Reset Commission</th>
                            <th className="p-2">Reset At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissionHistory.map((item) => (
                            <tr
                              key={item._id}
                              className="border-b border-border last:border-0"
                            >
                              <td className="p-2">{item.targetType}</td>

                              <td className="p-2">
                                {item?.resetStartDate
                                  ? new Date(
                                      item.resetStartDate,
                                    ).toLocaleDateString("en-GB")
                                  : "-"}
                              </td>

                              <td className="p-2">
                                {item?.resetEndDate
                                  ? new Date(
                                      item.resetEndDate,
                                    ).toLocaleDateString("en-GB")
                                  : "-"}
                              </td>

                              {/* <td className="p-2">
                                INR{" "}
                                {item.achievedAmountBeforeReset?.toLocaleString()}
                              </td> */}

                              {/* <td className="p-2">
                                INR{" "}
                                {item.commissionEarnedBeforeReset?.toFixed(2)}
                              </td> */}

                              <td className="p-2">
                                INR {item.resetCommissionAmount?.toFixed(2) || 0}
                              </td>

                              <td className="p-2">
                                {new Date(item.resetAt).toLocaleString("en-GB")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPanel;
