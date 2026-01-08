import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { ComboOffer } from "../types";
import { format } from "date-fns";
import ConfirmModal from "@/app/components/ui/ConfirmModal";

interface ComboMobileCardProps {
  combo: ComboOffer;
  onEdit: (combo: ComboOffer) => void;
  onDelete: (comboId: string) => void;
  onToggleStatus: (comboId: string) => void;
  onDuplicate: (combo: ComboOffer) => void;
  onPreview: (combo: ComboOffer) => void;
}

const ComboMobileCard: React.FC<ComboMobileCardProps> = ({
  combo,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onPreview,
}) => {
  const isExpired = new Date(combo.validUntil) < new Date();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{combo.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {combo.description}
          </p>
        </div>
        {isExpired ? (
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full whitespace-nowrap">
            Expired
          </span>
        ) : combo.isActive ? (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
            Active
          </span>
        ) : (
          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full whitespace-nowrap">
            Inactive
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Services:</span>
          <span className="text-sm font-medium text-foreground">
            {combo.services.length} services
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Original Price:</span>
          <span className="text-sm text-muted-foreground line-through">
            INR {combo.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Combo Price:</span>
          <span className="text-lg font-bold text-foreground">
            INR {combo.discountedPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">You Save:</span>
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full">
            <Icon name="TrendingDown" size={12} className="mr-1" />
            <span className="text-sm font-semibold">
              {combo.savingsPercentage.toFixed(0)}% OFF
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Valid Until:</span>
          <span className="text-sm font-medium text-foreground">
            {format(combo.validUntil, "MMM dd, yyyy")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Popularity:</span>
          <span className="text-sm font-medium text-foreground">
            {combo.popularity} bookings
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPreview(combo)}
          iconName="Eye"
          iconPosition="left"
          iconSize={14}
          className="flex-1"
        >
          Preview
        </Button>
        <Button
          variant="outline"
          onClick={() => onEdit(combo)}
          iconName="Edit"
          iconPosition="left"
          iconSize={14}
          className="flex-1"
        >
          Edit
        </Button>
        <button
          onClick={() => onDuplicate(combo)}
          className="p-2 hover:bg-muted rounded transition-colors"
          title="Duplicate"
        >
          <Icon name="Copy" size={18} className="text-muted-foreground" />
        </button>
        {!isExpired && (
          <button
            onClick={() => onToggleStatus(combo.id)}
            className="p-2 hover:bg-muted rounded transition-colors"
            title={combo.isActive ? "Deactivate" : "Activate"}
          >
            <Icon
              name={combo.isActive ? "ToggleRight" : "ToggleLeft"}
              size={18}
              className={
                combo.isActive ? "text-green-600" : "text-muted-foreground"
              }
            />
          </button>
        )}
        <button
          onClick={() => {
            setSelectedComboId(combo.id);
            setIsDeleteModalOpen(true);
          }}
          className="p-1.5 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Icon name="Trash2" size={18} className="text-red-600" />
        </button>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Combo Offer"
        description="Are you sure you want to delete this combo offer? This action cannot be undone."
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedComboId(null);
        }}
        onConfirm={() => {
          if (selectedComboId) {
            onDelete(selectedComboId);
          }
          setIsDeleteModalOpen(false);
          setSelectedComboId(null);
        }}
      />
    </div>
  );
};

export default ComboMobileCard;
