import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Employee } from '../types';

interface MobileEmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const MobileEmployeeCard = ({ employee, onEdit, onToggleStatus, onViewDetails, onDelete }: MobileEmployeeCardProps) => {
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

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {employee.avatar ? (
            <Image
              src={employee.avatar}
              alt={`${employee.name} profile photo showing professional headshot`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={()=> onViewDetails(employee)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium cursor-pointer" onClick={()=> onViewDetails(employee)}>
              {employee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{employee.name}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleColor(employee.role)}`}>
            {employee.role}
          </span>
        </div>
        <button
          onClick={() => onToggleStatus(employee.id)}
          className={`flex-shrink-0 w-2 h-2 rounded-full ${employee.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
            }`}
          aria-label={`Toggle ${employee.name} status`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon name="Phone" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="truncate">{employee.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Icon name="Mail" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
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
            INR {(employee.performanceMetrics.revenueGenerated / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => onEdit(employee)}
          className="flex-1"
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
        >
          Delete
        </Button>
      </div>

    </div>
  );
};

export default MobileEmployeeCard;