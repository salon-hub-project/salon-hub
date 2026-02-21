"use client";

import { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

import { StaffFilters as FilterType } from "../types";
import { StaffRoles } from "../types";
import { useDebounce } from "@/app/store/hooks";

interface StaffFiltersProps {
  filters: FilterType;
  roles: StaffRoles[];
  totalStaff: number;
  onFiltersChange: (filters: FilterType) => void;
}

const EmployeeFilters = ({
  filters,
  roles,
  totalStaff,
  onFiltersChange,
}: StaffFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [search, setSearch] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onFiltersChange({ ...filters, searchQuery: debouncedSearch });
  }, [debouncedSearch]);

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.role && filters.role !== "all" ? 1 : 0) +
    (filters.isActive ? 1 : 0) +
    (filters.dateOfAppointment ? 1 : 0) +
    (filters.timeOfAppointment ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      role: "all",
      isActive: "",
      dateOfAppointment: "",
      timeOfAppointment: "",
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 pt-0 space-y-4">
      {/* TOP BAR */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px] relative">
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search staff by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          iconName="Filter"
          iconPosition="left"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-6"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* ADVANCED */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Role"
              options={[
                { value: "all", label: "All Roles" },
                ...roles.map((r) => ({
                  value: r._id,
                  label: r.name,
                })),
              ]}
              value={filters.role}
              onChange={(value) => onFiltersChange({ ...filters, role: value })}
              searchable
            />

            <Select
              label="Status"
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              value={filters.isActive}
              onChange={(value) =>
                onFiltersChange({ ...filters, isActive: value as any })
              }
            />

            {/* <Input
              type="date"
              label="Appointment Date"
              value={filters.dateOfAppointment}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateOfAppointment: e.target.value,
                })
              }
            /> */}

            {/* <Input
              type="time"
              label="Appointment Time"
              value={filters.timeOfAppointment}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  timeOfAppointment: e.target.value,
                })
              }
            /> */}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {totalStaff} staff
            </span>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                iconName="X"
                iconPosition="left"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilters;
