import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

import { ComboOffer } from "../types";
import { format } from "date-fns";
import ConfirmModal from "../../../components/ui/ConfirmModal";

interface ComboTableProps {
  combos: ComboOffer[];
  onEdit: (combo: ComboOffer) => void;
  onDelete: (comboId: string) => void;
  onToggleStatus: (comboId: string) => void;
  onDuplicate: (combo: ComboOffer) => void;
  onPreview: (combo: ComboOffer) => void;
}

const ComboTable: React.FC<ComboTableProps> = ({
  combos,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onPreview,
}) => {
  const isExpired = (validUntil: Date) => {
    return new Date(validUntil) < new Date();
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Combo Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Services
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Original Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Combo Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Savings
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Popularity
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {combos.map((combo) => {
              const expired = isExpired(combo.validUntil);

              return (
                <tr
                  key={combo.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {combo.name}
                      </span>
                      <span className="text-sm text-muted-foreground mt-1">
                        Valid: {format(combo.validFrom, "MMM dd")} -{" "}
                        {format(combo.validUntil, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      {combo.services.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-sm text-muted-foreground"
                        >
                          • {service.name}
                        </span>
                      ))}
                      {combo.services.length > 2 && (
                        <span className="text-xs text-muted-foreground italic mt-1">
                          +{combo.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-muted-foreground line-through">
                      INR {combo.originalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-semibold text-foreground">
                      INR {combo.discountedPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <Icon name="TrendingDown" size={12} className="mr-1" />
                      {combo.savingsPercentage.toFixed(0)}% OFF
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {expired ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Icon name="Clock" size={12} className="mr-1" />
                        Expired
                      </span>
                    ) : combo.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Icon name="XCircle" size={12} className="mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-foreground">
                        {combo.popularity} bookings
                      </span>
                      <span className="text-xs text-muted-foreground">
                        INR {combo.revenueGenerated.toFixed(0)} revenue
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPreview(combo)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Preview"
                      >
                        <Icon
                          name="Eye"
                          size={16}
                          className="text-muted-foreground"
                        />
                      </button>
                      <button
                        onClick={() => onEdit(combo)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Edit"
                      >
                        <Icon
                          name="Edit"
                          size={16}
                          className="text-muted-foreground"
                        />
                      </button>
                      {/* <button
                        onClick={() => onDuplicate(combo)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Duplicate"
                      >
                        <Icon
                          name="Copy"
                          size={16}
                          className="text-muted-foreground"
                        />
                      </button> */}
                      {/* {!expired && (
                        <button
                          onClick={() => onToggleStatus(combo.id)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                          title={combo.isActive ? "Deactivate" : "Activate"}
                        >
                          <Icon
                            name={combo.isActive ? "ToggleRight" : "ToggleLeft"}
                            size={16}
                            className={
                              combo.isActive
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }
                          />
                        </button>
                      )} */}
                      <button
                        onClick={() => {
                          setSelectedComboId(combo.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Icon
                          name="Trash2"
                          size={16}
                          className="text-red-600"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    </div>
  );
};

export default ComboTable;
