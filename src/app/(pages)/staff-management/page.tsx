"use client";
import { useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MobileBottomNav from "../../components/MobileBottomNav";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDetailsPanel from "./components/EmployeeDetailsPanel";
import EmployeeFormModal from "./components/EmployeeFormModal";
import MobileEmployeeCard from "./components/MobileEmployeeCard";
import {
  Employee,
  EmployeeFormData,
  PerformancePeriod,
  RoleFilter,
  Service,
} from "./types";
import { useAppSelector } from '../../store/hooks';

const StaffManagement = () => {
  const authUser = useAppSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [performancePeriod, setPerformancePeriod] = useState<string>("month");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentUser = {
    name: "Sarah Johnson",
    email: authUser?.email || "sarah@salonhub.com",
    role: authUser?.role || "salon_owner",
    salonName: "Elegance Beauty Salon",
  };

  const services: Service[] = [
    { id: "1", name: "Haircut & Styling", category: "Hair" },
    { id: "2", name: "Hair Coloring", category: "Hair" },
    { id: "3", name: "Balayage", category: "Hair" },
    { id: "4", name: "Keratin Treatment", category: "Hair" },
    { id: "5", name: "Manicure", category: "Nails" },
    { id: "6", name: "Pedicure", category: "Nails" },
    { id: "7", name: "Gel Nails", category: "Nails" },
    { id: "8", name: "Facial Treatment", category: "Skincare" },
    { id: "9", name: "Makeup Application", category: "Makeup" },
    { id: "10", name: "Bridal Makeup", category: "Makeup" },
  ];

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Emily Rodriguez",
      role: "Stylist",
      phone: "+91 1234567890",
      email: "emily.rodriguez@salonhub.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "active",
      joinDate: "2023-01-15",
      assignedServices: ["Haircut & Styling", "Hair Coloring", "Balayage"],
      performanceMetrics: {
        completedServices: 87,
        customerRating: 4.8,
        revenueGenerated: 12450,
        bookingCompletionRate: 94,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
      commissionRate: 40,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Colorist",
      phone: "+91 1234567890",
      email: "michael.chen@salonhub.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      status: "active",
      joinDate: "2022-08-20",
      assignedServices: ["Hair Coloring", "Balayage", "Keratin Treatment"],
      performanceMetrics: {
        completedServices: 92,
        customerRating: 4.9,
        revenueGenerated: 15680,
        bookingCompletionRate: 96,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      commissionRate: 45,
    },
    {
      id: "3",
      name: "Jessica Martinez",
      role: "Nail Technician",
      phone: "+91 1234567890",
      email: "jessica.martinez@salonhub.com",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      status: "active",
      joinDate: "2023-03-10",
      assignedServices: ["Manicure", "Pedicure", "Gel Nails"],
      performanceMetrics: {
        completedServices: 78,
        customerRating: 4.7,
        revenueGenerated: 9340,
        bookingCompletionRate: 91,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
      commissionRate: 35,
    },
    {
      id: "4",
      name: "David Thompson",
      role: "Manager",
      phone: "+91 1234567890",
      email: "david.thompson@salonhub.com",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      status: "active",
      joinDate: "2021-05-01",
      assignedServices: [
        "Haircut & Styling",
        "Facial Treatment",
        "Makeup Application",
      ],
      performanceMetrics: {
        completedServices: 65,
        customerRating: 4.6,
        revenueGenerated: 18920,
        bookingCompletionRate: 89,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
      commissionRate: 50,
    },
    {
      id: "5",
      name: "Amanda Wilson",
      role: "Receptionist",
      phone: "+91 1234567890",
      email: "amanda.wilson@salonhub.com",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      status: "active",
      joinDate: "2023-06-15",
      assignedServices: ["Facial Treatment", "Makeup Application"],
      performanceMetrics: {
        completedServices: 45,
        customerRating: 4.5,
        revenueGenerated: 5670,
        bookingCompletionRate: 88,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      commissionRate: 30,
    },
    {
      id: "6",
      name: "Robert Anderson",
      role: "Stylist",
      phone: "+91 1234567890",
      email: "robert.anderson@salonhub.com",
      status: "inactive",
      joinDate: "2022-11-20",
      assignedServices: ["Haircut & Styling", "Keratin Treatment"],
      performanceMetrics: {
        completedServices: 56,
        customerRating: 4.4,
        revenueGenerated: 7890,
        bookingCompletionRate: 85,
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: true,
        sunday: false,
      },
      commissionRate: 38,
    },
  ]);

  const roleFilterOptions: RoleFilter[] = [
    { value: "all", label: "All Roles" },
    { value: "Manager", label: "Manager" },
    { value: "Stylist", label: "Stylist" },
    { value: "Colorist", label: "Colorist" },
    { value: "Nail Technician", label: "Nail Technician" },
    { value: "Receptionist", label: "Receptionist" },
  ];

  const performancePeriodOptions: PerformancePeriod[] = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const filteredEmployees = employees.filter((employee) => {
    if (roleFilter === "all") return true;
    return employee.role === roleFilter;
  });

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
    setIsDetailsOpen(false);
  };

  const handleToggleStatus = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
          : emp
      )
    );
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  // const handleSaveEmployee = (data: EmployeeFormData) => {
  //   if (editingEmployee) {
  //     setEmployees((prev) =>
  //       prev.map((emp) =>
  //         emp.id === editingEmployee.id
  //           ? {
  //               ...emp,
  //               ...data,
  //             }
  //           : emp
  //       )
  //     );
  //   } else {
  //     const newEmployee: Employee = {
  //       id: Date.now().toString(),
  //       ...data,
  //       role: data.role as Employee["role"], 
  //       status: "active",
  //       joinDate: new Date().toISOString(),
  //       avatar: undefined,
  //       performanceMetrics: {
  //         completedServices: 0,
  //         customerRating: 0,
  //         revenueGenerated: 0,
  //         bookingCompletionRate: 0,
  //       },
  //     };
  //     setEmployees((prev) => [...prev, newEmployee]);
  //   }
  //   setIsFormOpen(false);
  //   setEditingEmployee(null);
  // };

  // fixed ts error in handleSaveEmployee
  const handleSaveEmployee = (data: EmployeeFormData) => {
    if (editingEmployee) {
      setEmployees((prev): Employee[] =>
        prev.map((emp) => {
          if (emp.id !== editingEmployee.id) return emp;
  
          return {
            ...emp,
            name: data.name,
            role: data.role as Employee["role"],
            phone: data.phone,
            email: data.email,
            commissionRate: data.commissionRate,
            assignedServices: data.assignedServices,
            availability: data.availability,
          };
        })
      );
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: data.name,
        role: data.role as Employee["role"],
        phone: data.phone,
        email: data.email,
        assignedServices: data.assignedServices,
        availability: data.availability,
        commissionRate: data.commissionRate,
        status: "active",
        joinDate: new Date().toISOString(),
        avatar: undefined,
        performanceMetrics: {
          completedServices: 0,
          customerRating: 0,
          revenueGenerated: 0,
          bookingCompletionRate: 0,
        },
      };
  
      setEmployees((prev) => [...prev, newEmployee]);
    }
  
    setIsFormOpen(false);
    setEditingEmployee(null);
  };
  
  const activeEmployees = employees.filter(
    (emp) => emp.status === "active"
  ).length;
  const totalRevenue = employees.reduce(
    (sum, emp) => sum + emp.performanceMetrics.revenueGenerated,
    0
  );
  const averageRating =
    employees.reduce(
      (sum, emp) => sum + emp.performanceMetrics.customerRating,
      0
    ) / employees.length;

  return (
    <>
      
        <title>Staff Management - SalonHub</title>
        <meta
          name="description"
          content="Manage salon employees, track performance, and assign booking responsibilities efficiently"
        />
      

      <div className="min-h-screen bg-background">
        <Sidebar userRole={currentUser.role} />
        <Header user={currentUser} notifications={3} />

        <main className="lg:ml-sidebar pt-header pb-safe lg:pb-4">
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
                className="w-full lg:w-auto"
              >
                Add New Employee
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      Active Staff
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {activeEmployees}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Icon name="UserCheck" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      INR {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name="IndianRupee" size={24} className="text-accent" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    Employee Directory
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredEmployees.length}{" "}
                    {filteredEmployees.length === 1 ? "employee" : "employees"}{" "}
                    found
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select
                    placeholder="Filter by role"
                    options={roleFilterOptions}
                    value={roleFilter}
                    onChange={(value) => setRoleFilter(value as string)}
                    className="w-full sm:w-48"
                  />
                  <Select
                    placeholder="Performance period"
                    options={performancePeriodOptions}
                    value={performancePeriod}
                    onChange={(value) => setPerformancePeriod(value as string)}
                    className="w-full sm:w-48"
                  />
                </div>
              </div>

              {isMobile ? (
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <MobileEmployeeCard
                      key={employee.id}
                      employee={employee}
                      onEdit={handleEditEmployee}
                      onToggleStatus={handleToggleStatus}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <EmployeeTable
                  employees={filteredEmployees}
                  onEdit={handleEditEmployee}
                  onToggleStatus={handleToggleStatus}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="CheckCircle"
                      size={20}
                      className="text-success"
                    />
                    <span className="text-sm text-muted-foreground">
                      Avg. Completion Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {(
                      employees.reduce(
                        (sum, emp) =>
                          sum + emp.performanceMetrics.bookingCompletionRate,
                        0
                      ) / employees.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Star" size={20} className="text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      Avg. Rating
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {averageRating.toFixed(1)}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Briefcase" size={20} className="text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Total Services
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {employees.reduce(
                      (sum, emp) =>
                        sum + emp.performanceMetrics.completedServices,
                      0
                    )}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="TrendingUp"
                      size={20}
                      className="text-success"
                    />
                    <span className="text-sm text-muted-foreground">
                      Avg. Revenue
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    INR
                    {(totalRevenue / employees.length).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 0 }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {isMobile && <MobileBottomNav userRole={currentUser.role} />}

        {isDetailsOpen && (
          <EmployeeDetailsPanel
            employee={selectedEmployee}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedEmployee(null);
            }}
            onEdit={handleEditEmployee}
          />
        )}

        {isFormOpen && (
          <EmployeeFormModal
            employee={editingEmployee}
            services={services}
            onClose={() => {
              setIsFormOpen(false);
              setEditingEmployee(null);
            }}
            onSave={handleSaveEmployee}
          />
        )}
      </div>
    </>
  );
};

export default StaffManagement;
