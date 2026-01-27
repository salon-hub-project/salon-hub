import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ComboOffer } from '../types';
import { format } from 'date-fns';

interface ComboPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  combo: ComboOffer | null;
}

const ComboPreviewModal: React.FC<ComboPreviewModalProps> = ({
  isOpen,
  onClose,
  combo,
}) => {
  if (!isOpen || !combo) return null;

  // const eligibilityLabel = {
  //   all: 'All Customers',
  //   new: 'New Customers Only',
  //   existing: 'Existing Customers',
  //   vip: 'VIP Members',
  // };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Combo Offer Preview</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-foreground">{combo.name}</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full">
                <Icon name="TrendingDown" size={16} />
                <span className="font-bold text-lg">
                  {combo.savingsPercentage.toFixed(0)}% OFF
                </span>
              </div>
            </div>
            <p className="text-muted-foreground">{combo.description}</p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Original Price:</span>
              <span className="text-lg text-muted-foreground line-through">
                INR {combo.originalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Combo Price:</span>
              <span className="text-3xl font-bold text-primary">
                INR {combo.discountedPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <span className="text-sm font-medium text-green-700">You Save:</span>
              <span className="text-lg font-bold text-green-700">
                INR {(combo.originalPrice - combo.discountedPrice).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Services Included */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Package" size={18} />
              Services Included ({combo.services.length})
            </h4>
            <div className="space-y-2">
              {combo.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration} minutes
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    INR {service.originalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Valid From</span>
              </div>
              <p className="font-medium text-foreground">
                {format(combo.validFrom, 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Valid Until</span>
              </div>
              <p className="font-medium text-foreground">
                {format(combo.validUntil, 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Eligibility</span>
              </div>
              <p className="font-medium text-foreground">
                {combo.customerEligibility}
                {/* {eligibilityLabel[combo.customerEligibility as keyof typeof eligibilityLabel] || "Specific Group (" + combo.customerEligibility.substring(0, 8) + "...) " } */}
              </p>
            </div>

            {/* <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Percent" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Staff Commission</span>
              </div>
              <p className="font-medium text-foreground">
                {combo.staffCommissionRate}%
              </p>
            </div> */}
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
            {/* <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Bookings</span>
              </div>
               <p className="text-2xl font-bold text-foreground">{combo.popularity}</p> 
            </div> */}

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="IndianRupee" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Revenue Generated</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                INR {combo.revenueGenerated.toFixed(2)}
              </p>
            </div>
          </div>

          {combo.minBookingRequirement && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={18} className="text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Minimum Booking Requirement</p>
                  <p className="text-sm text-amber-700">
                    Customers must book at least {combo.minBookingRequirement} sessions to access
                    this offer
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboPreviewModal;