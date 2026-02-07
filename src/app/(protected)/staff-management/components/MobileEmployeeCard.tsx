import { staffApi } from "@/app/services/staff.api";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { Employee } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";

interface Role {
  _id: string;
  name: string;
}

interface MobileEmployeeCardProps {
  employee: Employee;
  role: Role[];
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string, isActive?: boolean) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete: (id: string) => void;
  profileWorkingDays?: string[];
}

const MobileEmployeeCard = ({
  employee,
  role,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onDelete,
  profileWorkingDays = [],
}: MobileEmployeeCardProps) => {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Manager: "bg-purple-100 text-purple-800",
      Stylist: "bg-blue-100 text-blue-800",
      Colorist: "bg-pink-100 text-pink-800",
      "Nail Technician": "bg-green-100 text-green-800",
      Receptionist: "bg-yellow-100 text-yellow-800",
      "Hair Stylist": "bg-blue-100 text-blue-800",
      "Nails technician": "bg-green-100 text-green-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  // ✅ ONLY ROLE FIX
  const roleName =
    typeof employee.role === "object" && employee.role?.name
      ? employee.role?.name
      : "N/A";

  const getWorkingDays = (availability: Employee["availability"]) => {
    return Object.entries(availability)
      .filter(([day, isWorking]) => {
        if (!isWorking) return false;
        if (profileWorkingDays.length === 0) return true;
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
        return profileWorkingDays.includes(capitalizedDay);
      })
      .map(([day]) => day.slice(0, 3))
      .join(", ");
  };

  return (
    <div
      className={`rounded-lg border border-border p-4 space-y-4 transition-all
    ${employee.isActive ? "bg-card" : "bg-muted/40 opacity-60 grayscale"}
  `}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          <EmployeeAvatar employee={employee} onViewDetails={onViewDetails} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {employee.name}
          </h3>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleColor(
              roleName,
            )}`}
          >
            {roleName}
          </span>
        </div>

        <button
          onClick={() => onToggleStatus(employee.id, !employee.isActive)}
          className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
            employee.isActive ? "bg-green-500" : "bg-gray-400"
          }`}
          aria-label={`Toggle ${employee.name} status`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon
            name="Phone"
            size={14}
            className="text-muted-foreground flex-shrink-0"
          />
          <span className="truncate">{employee.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon
            name="Mail"
            size={14}
            className="text-muted-foreground flex-shrink-0"
          />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon
            name="Calendar"
            size={14}
            className="text-muted-foreground flex-shrink-0"
          />
          <span className="truncate">
            {getWorkingDays(employee.availability)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon
              name="Star"
              size={14}
              className="text-yellow-500 fill-yellow-500"
            />
            <span className="text-xs text-muted-foreground">Rating</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {employee.performanceMetrics.customerRating.toFixed(1)}
          </p>
        </div>

        <div className="bg-muted rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="IndianRupee" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            INR{" "}
            {(employee.performanceMetrics.revenueGenerated / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
        <select
          value={employee.isActive ? "active" : "inactive"}
          onChange={async (e) => {
            e.stopPropagation();
            const newStatus = e.target.value === "active";

            await staffApi.updateStaffStatus(employee.id, newStatus);
            onToggleStatus(employee.id, newStatus);
          }}
          className="border rounded-md px-2 py-1 text-sm bg-background"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => onEdit(employee)}
          className="flex-1"
          disabled={!employee.isActive}
        >
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(employee)}
          className="flex-1"
          disabled={!employee.isActive}
        >
          View
        </Button>

        <Button
          variant="outline"
          size="sm"
          iconName="Trash2"
          iconPosition="left"
          onClick={() => onDelete(employee.id)}
          className="flex-1 text-red-500 hover:text-red-700"
          disabled={!employee.isActive}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MobileEmployeeCard;
