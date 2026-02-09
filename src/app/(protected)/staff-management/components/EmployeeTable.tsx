"use client";
import { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Employee, SortField, SortOrder } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";
import { staffApi } from "@/app/services/staff.api";

interface Role {
  _id: string;
  name: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  roles: Role[]; // ✅ ONLY ADDITION
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string, isActive?: boolean) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete: (id: string) => void;
  profileWorkingDays?: string[];
}

const EmployeeTable = ({
  employees,
  roles,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onDelete,
  profileWorkingDays = [],
}: EmployeeTableProps) => {
  const [sortField, setSortField] = useState<SortField>("joinDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusUpdate, setStatusUpdate] = useState(true);

  // ✅ ROLE ID → ROLE NAME MAP
  const roleMap = useMemo(() => {
    return new Map(roles.map((r) => [r._id, r.name]));
  }, [roles]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;

      // case "role":
      // aValue =
      //   typeof a.role === "string"
      //     ? roleMap.get(a.role)?.toLowerCase() || ""
      //     : a.role?.name?.toLowerCase() || "";
      // bValue =
      //   typeof b.role === "string"
      //     ? roleMap.get(b.role)?.toLowerCase() || ""
      //     : b.role?.name?.toLowerCase() || "";
      // break;
      case "role":
        aValue = a.role.join(", ").toLowerCase();
        bValue = b.role.join(", ").toLowerCase();
        break;

      case "rating":
        aValue = a.performanceMetrics.customerRating;
        bValue = b.performanceMetrics.customerRating;
        break;

      case "revenue":
        aValue = a.performanceMetrics.revenueGenerated;
        bValue = b.performanceMetrics.revenueGenerated;
        break;

      case "joinDate":
        aValue = new Date(a.joinDate).getTime();
        bValue = new Date(b.joinDate).getTime();
        break;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
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
    <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                Name <SortIcon field="name" />
              </button>
            </th>

            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort("role")}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                Role <SortIcon field="role" />
              </button>
            </th>

            <th className="px-6 py-4 text-left">Contact</th>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort("rating")}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                Rating <SortIcon field="rating" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">Working Days</th>
            <th className="px-6 py-4 text-left">
              <button
                onClick={() => handleSort("revenue")}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                Revenue <SortIcon field="revenue" />
              </button>
            </th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {sortedEmployees.map((employee) => {
            // const roleName =
            //   typeof employee.role === "string"
            //     ? roleMap.get(employee.role)
            //     : employee.role?.name;

            const roleNames = Array.isArray(employee.role)
              ? employee.role
              : typeof employee.role === "string"
                ? [roleMap.get(employee.role) ?? employee.role]
                : employee.role
                  ? [employee.role]
                  : [];

            return (
              <tr
                key={employee.id}
                className={`cursor-pointer transition-all
                ${!employee.isActive ? "opacity-50 grayscale" : "hover:bg-muted/30"}
              `}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar
                      employee={employee}
                      onViewDetails={onViewDetails}
                      onClick={() => onViewDetails(employee)}
                    />
                    <div>
                      <div className="text-sm font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(employee.joinDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium `}>
                    {roleNames.length > 0 ? roleNames.join(", ") : "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div>{employee.phone}</div>
                  <div className="text-xs text-muted-foreground">
                    {employee.email}
                  </div>
                </td>

                <td className="px-6 py-4">
                  ⭐ {employee.performanceMetrics.customerRating.toFixed(1)}
                </td>

                <td className="px-6 py-4">
                  {getWorkingDays(employee.availability)}
                </td>

                <td className="px-6 py-4">
                  INR{" "}
                  {employee.performanceMetrics.revenueGenerated.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      employee.isActive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {employee.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <select
                      name="change status"
                      value={employee.isActive ? "active" : "inactive"}
                      onChange={async (e) => {
                        e.stopPropagation();
                        const newStatus = e.target.value === "active";

                        await staffApi.updateStaffStatus(
                          employee.id,
                          newStatus,
                        );
                        onToggleStatus(employee.id, newStatus);
                      }}
                      className="border rounded-md px-2 py-1 text-sm bg-background"
                    >
                      <option value="" disabled>
                        Change Status
                      </option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(employee);
                      }}
                      iconName="Edit"
                      iconSize={16}
                      disabled={!employee.isActive}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(employee.id);
                      }}
                      disabled={!employee.isActive}
                      iconName="Trash"
                      iconSize={16}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
