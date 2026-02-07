"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDetailsPanel from "./components/EmployeeDetailsPanel";
import EmployeeFormModal from "./components/EmployeeFormModal";
import MobileEmployeeCard from "./components/MobileEmployeeCard";
import {
  Employee,
  EmployeeApiResponse,
  RoleFilter,
  Service,
  StaffFilters,
} from "./types";
import { staffApi } from "@/app/services/staff.api";
import Pagination from "@/app/components/Pagination";
import Loader from "@/app/components/Loader";
import NoData from "@/app/components/NoData";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { showToast } from "@/app/components/ui/toast";
import RolesManager from "./components/RolesManager";
import { rolesApi } from "@/app/services/roles.api";
import { StaffRoles } from "./types";
import ResetTargetModal from "./components/ResetTargetModal";
import EmployeeFilters from "./components/EmployeeFilters";
import { profileApi } from "@/app/services/profile.api";

const StaffManagement = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [roles, setRoles] = useState<StaffRoles[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [resetTargetModalOpen, setResetTargetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [filters, setFilters] = useState<StaffFilters>({
    searchQuery: "",
    role: "all",
    isActive: "",
    fullName: "",
    dateOfAppointment: "",
    timeOfAppointment: "",
  });

  const [profileWorkingDays, setProfileWorkingDays] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch shop profile to get working days
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        const resData = response?.data;

        let days: string[] = [];
        if (resData && resData.workingDays) {
          const DAY_LABELS = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          if (Array.isArray(resData.workingDays)) {
            days = resData.workingDays.map((d: any) => {
              const num = Number(d);
              if (!isNaN(num) && num >= 0 && num <= 6) {
                return DAY_LABELS[num];
              }
              const s = String(d);
              return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            });
          }
        }
        setProfileWorkingDays(days);
      } catch (error) {
        console.error("Failed to fetch profile for working days", error);
      }
    };
    fetchProfile();
  }, []);

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
    setIsDetailsOpen(false);
  };

  const handleToggleStatus = (id: string, isActive = false) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              isActive,
              status: isActive ? "active" : "inactive",
            }
          : emp,
      ),
    );
  };

  const handleResetAchievedAmount = async (staffId: string) => {
    try {
      await staffApi.resetIndividualAchievment(staffId);
      fetchEmployees();
      handleViewDetails({ id: staffId } as Employee);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await rolesApi.getAllRoles();
      if (res?.data) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const fetchEmployees = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      setLoading(true);
      const res = await staffApi.getAllStaff({
        page,
        limit,
        role: filters.role === "all" ? undefined : filters.role,
        fullName: filters.searchQuery || undefined,
        isActive:
          filters.isActive === "" ? undefined : filters.isActive === "true",
        dateOfAppointment: filters.dateOfAppointment || undefined,
        timeOfAppointment: filters.timeOfAppointment || undefined,
      });

      if (!mountedRef.current) return;

      const employeesFromApi = res.data as EmployeeApiResponse[];
      const mappedEmployees: Employee[] = employeesFromApi.map((emp) => ({
        id: emp._id,
        name: emp.fullName,
        role: emp.role,
        phone: emp.userId?.phoneNumber ?? "",
        email: emp.userId?.email ?? "",
        isActive: emp.isActive ?? emp.status === "active",
        status: emp.isActive ? "active" : "inactive",
        staffImage: emp.staffImage || "No image found",
        joinDate: emp.createdAt,
        assignedServices: emp.assignedServices.map((s) => s.serviceName),
        commissionRate: emp.commissionRate,
        target: emp.target || 0,
        targetType: emp.targetType || "N/A",
        availability: {
          monday:
            emp.workingDays?.some(
              (d: any) => String(d) === "1" || String(d) === "Monday",
            ) || false,
          tuesday:
            emp.workingDays?.some(
              (d: any) => String(d) === "2" || String(d) === "Tuesday",
            ) || false,
          wednesday:
            emp.workingDays?.some(
              (d: any) => String(d) === "3" || String(d) === "Wednesday",
            ) || false,
          thursday:
            emp.workingDays?.some(
              (d: any) => String(d) === "4" || String(d) === "Thursday",
            ) || false,
          friday:
            emp.workingDays?.some(
              (d: any) => String(d) === "5" || String(d) === "Friday",
            ) || false,
          saturday:
            emp.workingDays?.some(
              (d: any) => String(d) === "6" || String(d) === "Saturday",
            ) || false,
          sunday:
            emp.workingDays?.some(
              (d: any) => String(d) === "0" || String(d) === "Sunday",
            ) || false,
        },
        performanceMetrics: {
          completedServices: emp?.completedAppointments || 0,
          customerRating: emp?.rating ?? 0,
          revenueGenerated: emp?.lifetimeRevenue || 0,
          bookingCompletionRate: 0,
          achievedAmount: emp.achievedAmount || 0,
        },
      }));

      const sortedEmployees = [...mappedEmployees].sort(
        (a, b) =>
          new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
      );
      setEmployees(sortedEmployees);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      if (mountedRef.current) {
        console.error("Failed to fetch employees", error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchEmployees();

    return () => {
      mountedRef.current = false;
      fetchingRef.current = false;
    };
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const roleFilterOptions: RoleFilter[] = [
    { value: "all", label: "All Roles" },
    ...roles.map((role) => ({
      value: role.name,
      label: role.name,
    })),
  ];

  const handleViewDetails = async (employee: Employee) => {
    try {
      setDetailsLoading(true);
      setIsDetailsOpen(true);

      const res = await staffApi.getStaffDetails(employee.id);
      const emp = res.staffDetails;

      const mappedEmployee: Employee = {
        id: emp._id,
        name: emp.fullName,
        role: emp.role,
        phone: emp.userId?.phoneNumber ?? "",
        email: emp.userId?.email ?? "",
        status: emp.isActive ? "active" : "inactive",
        staffImage: emp.staffImage || "No image found",
        joinDate: emp.createdAt,
        assignedServices: emp.assignedServices.map((s: any) => s.serviceName),
        commissionRate: emp.commissionRate,
        target: emp.target,
        targetType: emp.targetType,
        availability: {
          monday:
            emp.workingDays?.some(
              (d: any) => String(d) === "1" || String(d) === "Monday",
            ) || false,
          tuesday:
            emp.workingDays?.some(
              (d: any) => String(d) === "2" || String(d) === "Tuesday",
            ) || false,
          wednesday:
            emp.workingDays?.some(
              (d: any) => String(d) === "3" || String(d) === "Wednesday",
            ) || false,
          thursday:
            emp.workingDays?.some(
              (d: any) => String(d) === "4" || String(d) === "Thursday",
            ) || false,
          friday:
            emp.workingDays?.some(
              (d: any) => String(d) === "5" || String(d) === "Friday",
            ) || false,
          saturday:
            emp.workingDays?.some(
              (d: any) => String(d) === "6" || String(d) === "Saturday",
            ) || false,
          sunday:
            emp.workingDays?.some(
              (d: any) => String(d) === "0" || String(d) === "Sunday",
            ) || false,
        },
        performanceMetrics: {
          completedServices: emp.completedAppointments || 0,
          customerRating: emp.rating ?? 0,
          revenueGenerated: emp?.lifetimeRevenue || 0,
          bookingCompletionRate: 0,
          achievedAmount: emp.achievedAmount || 0,
          totalCommisionEarned: emp?.totalCommisionEarned || 0,
          lifetimeCommision: emp?.lifetimeCommision || 0,
        },
      };
      setSelectedEmployee(mappedEmployee);
    } catch (err) {
      console.error("Failed to fetch staff details", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      setLoading(true);
      await staffApi.deleteStaff(employeeToDelete);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete));
    } catch (err) {
      showToast({
        message: "Failed to delete employees",
        status: "error",
      });
      console.error("Failed to delete employee", err);
    } finally {
      setLoading(false);
      setConfirmModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleResetTarget = async (targetType: "Weekly" | "Monthly") => {
    try {
      setIsResetting(true);
      await staffApi.resetAchievedAmount(targetType);
      setResetTargetModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to reset target", err);
    } finally {
      setIsResetting(false);
    }
  };

  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const totalRevenue = employees.reduce(
    (sum, emp) => sum + emp.performanceMetrics.revenueGenerated,
    0,
  );
  const averageRating =
    employees.reduce(
      (sum, emp) => sum + emp.performanceMetrics.customerRating,
      0,
    ) / employees.length;

  return (
    <>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage employees and track performance
            </p>
          </div>

          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            onClick={handleAddEmployee}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Add New Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {employees.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Users" size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {activeEmployees}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="UserCheck" size={24} className="text-success" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <RolesManager
            roles={roles}
            onAddRole={(name) => {
              setRoles((prev) => [...prev, { _id: crypto.randomUUID(), name }]);
            }}
            onUpdateRole={(id, name) => {
              setRoles((prev) =>
                prev.map((role) =>
                  role._id === id ? { ...role, name } : role,
                ),
              );
            }}
            onDeleteRole={(id) => {
              setRoles((prev) => prev.filter((role) => role._id !== id));
            }}
          />
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={() => setResetTargetModalOpen(true)}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Reset Target
          </Button>
        </div>

        <EmployeeFilters
          filters={filters}
          roles={roles}
          totalStaff={employees.length}
          onFiltersChange={setFilters}
        />

        <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                Employee Directory
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3"></div>
          </div>

          {loading ? (
            <Loader label="Loading staff..." />
          ) : employees.length === 0 ? (
            <NoData
              title="No employees found"
              description="Try adjusting filters or add a new employee."
            />
          ) : isMobile ? (
            <div className="space-y-4">
              {employees.map((employee) => (
                <MobileEmployeeCard
                  key={employee.id}
                  role={roles}
                  onDelete={handleDeleteClick}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onToggleStatus={handleToggleStatus}
                  onViewDetails={handleViewDetails}
                  profileWorkingDays={profileWorkingDays}
                />
              ))}
            </div>
          ) : (
            <EmployeeTable
              employees={employees}
              roles={roles}
              profileWorkingDays={profileWorkingDays}
              onDelete={handleDeleteClick}
              onEdit={handleEditEmployee}
              onToggleStatus={handleToggleStatus}
              onViewDetails={handleViewDetails}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {isDetailsOpen && (
        <EmployeeDetailsPanel
          employee={selectedEmployee}
          profileWorkingDays={profileWorkingDays}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedEmployee(null);
          }}
          loading={detailsLoading}
          onEdit={handleEditEmployee}
          onResetAchieved={handleResetAchievedAmount}
        />
      )}

      {isFormOpen && (
        <EmployeeFormModal
          employee={editingEmployee}
          roles={roles}
          profileWorkingDaysProp={profileWorkingDays}
          onRoleAdded={(newRole) => {
            setRoles((prev) => [...prev, newRole]);
          }}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEmployee(null);
            fetchEmployees();
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ResetTargetModal
        isOpen={resetTargetModalOpen}
        onClose={() => setResetTargetModalOpen(false)}
        onConfirm={handleResetTarget}
        isLoading={isResetting}
      />
    </>
  );
};

export default StaffManagement;
