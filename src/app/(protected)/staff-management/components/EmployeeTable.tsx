"use client";
import { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { Employee, SortField, SortOrder } from "../types";
import EmployeeAvatar from "../types/EmployeeAvatar";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable = ({
  employees,
  onEdit,
  onToggleStatus,
  onViewDetails,
  onDelete,
}: EmployeeTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
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
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Employee
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Role
                  <SortIcon field="role" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Contact
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("rating")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Rating
                  <SortIcon field="rating" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Working Days
                </span>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("revenue")}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Revenue
                  <SortIcon field="revenue" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">
                  Status
                </span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEmployees.map((employee) => (
              <tr
                key={employee.id}
                onClick={() => onViewDetails(employee)}
                className="hover:bg-muted/30 transition-smooth cursor-pointer"
              >
                {/* Employee */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <EmployeeAvatar
                        employee={employee}
                        onViewDetails={onViewDetails}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {employee.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(employee.joinDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleColor(
                      employee.role
                    )}`}
                  >
                    {employee.role}
                  </span>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {employee.phone}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {employee.email}
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name="Star"
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {employee.performanceMetrics.customerRating.toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Working Days */}
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {getWorkingDays(employee.availability)}
                  </span>
                </td>

                {/* Revenue */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">
                    INR{" "}
                    {employee.performanceMetrics.revenueGenerated.toLocaleString()}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(employee.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth ${
                      employee.status === "active"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        employee.status === "active"
                          ? "bg-success"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {employee.status === "active" ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(employee);
                      }}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                    >
                      <Icon
                        name="Eye"
                        size={16}
                        className="text-muted-foreground"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(employee);
                      }}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                    >
                      <Icon
                        name="Edit"
                        size={16}
                        className="text-muted-foreground"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(employee.id);
                      }}
                      className="p-2 rounded-md hover:bg-destructive/10 transition-smooth"
                    >
                      <Icon
                        name="Trash"
                        size={16}
                        className="text-destructive"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
