"use client";
import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Employee, SortField, SortOrder } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete:(id:string) => void;
}

const EmployeeTable = ({ employees, onEdit, onToggleStatus, onViewDetails,onDelete }: EmployeeTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'role':
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
        break;
      case 'rating':
        aValue = a.performanceMetrics.customerRating;
        bValue = b.performanceMetrics.customerRating;
        break;
      case 'revenue':
        aValue = a.performanceMetrics.revenueGenerated;
        bValue = b.performanceMetrics.revenueGenerated;
        break;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Manager': 'bg-purple-100 text-purple-800',
      'Stylist': 'bg-blue-100 text-blue-800',
      'Colorist': 'bg-pink-100 text-pink-800',
      'Nail Technician': 'bg-green-100 text-green-800',
      'Receptionist': 'bg-yellow-100 text-yellow-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <Icon name="ChevronsUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? (
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
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Employee
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Role
                  <SortIcon field="role" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Contact</span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('rating')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Rating
                  <SortIcon field="rating" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Working Days</span>
              </th>

              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  Revenue
                  <SortIcon field="revenue" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Status</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {employee.avatar ? (
                        <Image
                          src={employee.avatar}
                          alt={`${employee.name} profile photo showing professional headshot`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        className="text-sm font-medium text-foreground hover:text-primary transition-smooth"
                      >
                        {employee.name}
                      </button>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Icon name="Phone" size={14} className="text-muted-foreground" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                      <Icon name="Mail" size={14} />
                      {employee.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">
                      {employee.performanceMetrics.customerRating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {getWorkingDays(employee.availability)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">
                    INR {employee.performanceMetrics.revenueGenerated.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(employee.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth ${employee.status === 'active' ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${employee.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                    {employee.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={16}
                      onClick={() => onEdit(employee)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => onViewDetails(employee)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2" // or whatever trash/delete icon you have
                      iconSize={16}
                      onClick={() => onDelete(employee.id)} // pass employee ID
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
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