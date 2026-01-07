import Loader from "@/app/components/Loader";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { Employee } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";

interface EmployeeDetailsPanelProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  loading?: boolean;
}

const EmployeeDetailsPanel = ({
  employee,
  onClose,
  onEdit,
  loading,
}: EmployeeDetailsPanelProps) => {
  if (!employee && !loading) return null;

  // From here on, employee is guaranteed to exist when not loading
  const workingDays = employee
    ? Object.entries(employee.availability)
        .filter(([_, isWorking]) => isWorking)
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
    : [];

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
              <p className="text-muted-foreground mt-1">{employee.role}</p>
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
                        Completed Services
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
                            100
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
                            1
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
                      <span className="text-sm text-muted-foreground">
                        Booking Completion
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {employee.performanceMetrics.bookingCompletionRate}%
                      </span>
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
                        Revenue Generated
                      </span>
                      <span className="text-lg font-bold text-success">
                        INR{" "}
                        {employee.performanceMetrics.revenueGenerated.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Calendar"
              iconPosition="left"
              fullWidth
            >
              View Schedule
            </Button>
            <Button
              variant="outline"
              iconName="MessageSquare"
              iconPosition="left"
              fullWidth
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPanel;
