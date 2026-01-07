import { useState } from "react";

const EmployeeAvatar = ({ employee, onViewDetails }: any) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
      onClick={() => onViewDetails(employee)}
    >
      {employee.staffImage && !imageError ? (
        <img
          src={employee.staffImage}
          alt={employee.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
          {employee.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default EmployeeAvatar;
