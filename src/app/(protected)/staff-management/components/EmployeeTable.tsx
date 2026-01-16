"use client";
import { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Employee, SortField, SortOrder } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";

interface Role {
  _id: string;
  name: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  roles: Role[]; // ✅ ONLY ADDITION
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable = ({
  employees,
  roles,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onDelete,
}: EmployeeTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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

      case "role":
        aValue =
          typeof a.role === "string"
            ? roleMap.get(a.role)?.toLowerCase() || ""
            : a.role?.name?.toLowerCase() || "";
        bValue =
          typeof b.role === "string"
            ? roleMap.get(b.role)?.toLowerCase() || ""
            : b.role?.name?.toLowerCase() || "";
        break;

      case "rating":
        aValue = a.performanceMetrics.customerRating;
        bValue = b.performanceMetrics.customerRating;
        break;

      case "revenue":
        aValue = a.performanceMetrics.revenueGenerated;
        bValue = b.performanceMetrics.revenueGenerated;
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
      .filter(([_, isWorking]) => isWorking)
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
                Employee <SortIcon field="name" />
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
            const roleName =
              typeof employee.role === "string"
                ? roleMap.get(employee.role)
                : employee.role?.name;

            return (
              <tr
                key={employee.id}
                onClick={() => onViewDetails(employee)}
                className="hover:bg-muted/30 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar employee={employee} onViewDetails={onViewDetails} />
                    <div>
                      <div className="text-sm font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(employee.joinDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleColor(
                      roleName || ""
                    )}`}
                  >
                    {roleName || "N/A"}
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
                  {employee.status === "active" ? "Active" : "Inactive"}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(employee); }}>
                      <Icon name="Edit" size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(employee.id); }}>
                      <Icon name="Trash" size={16} />
                    </button>
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
