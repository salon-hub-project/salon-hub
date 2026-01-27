"use client";

import React from "react";
import { X, Check, Star, Shield, Zap } from "lucide-react";
import Button from "./ui/Button";

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for independent artists and small salons.",
    features: [
      "Up to 2 Staff Members",
      "Basic Booking System",
      "Customer Database",
      "Email Notifications",
      "Mobile App Access",
    ],
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    color: "blue",
    trending: false,
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "The most popular choice for growing businesses.",
    features: [
      "Up to 10 Staff Members",
      "Advanced Booking & Calendar",
      "Inventory Management",
      "SMS & WhatsApp Alerts",
      "Financial Reporting",
      "Priority Support",
    ],
    icon: <Star className="w-6 h-6 text-amber-500" />,
    color: "amber",
    trending: true,
  },
  {
    name: "Enterprise",
    price: "₹4,999",
    period: "/month",
    description: "Comprehensive solutions for large salon chains.",
    features: [
      "Unlimited Staff Members",
      "Multi-location Support",
      "API Access & Integrations",
      "Custom Branding",
      "Dedicated Manager",
      "24/7 Premium Support",
    ],
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    color: "emerald",
    trending: false,
  },
];

const PlansModal: React.FC<PlansModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-card w-full max-w-6xl rounded-3xl shadow-2xl border border-border flex flex-col relative animate-in fade-in zoom-in duration-300 my-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-6 h-6 text-muted-foreground" />
        </button>

        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
            Choose Your Perfect Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scale your salon business with our flexible subscription options. 
            Select a plan that fits your current needs and upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12 pt-0">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.trending
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-105"
                  : "border-border bg-card"
              } transition-all hover:shadow-xl group`}
            >
              {plan.trending && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${plan.color}-100`}>
                  {plan.icon}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-foreground">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                {plan.description}
              </p>

              <div className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3.4 h-3.4 text-emerald-600 stroke-[3]" />
                    </div>
                    <span className="text-sm text-foreground/80 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.trending ? "default" : "outline"}
                className={`w-full py-6 text-lg font-bold transition-all ${
                  plan.trending
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
                onClick={() => {
                  alert(`Renewal request sent for ${plan.name} plan! Our team will contact you soon.`);
                  onClose();
                }}
              >
                Renew Now
              </Button>
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-border bg-muted/30 rounded-b-3xl text-center">
          <p className="text-muted-foreground">
            Looking for a custom enterprise solution?{" "}
            <a href="tel:0233445566" className="text-primary font-semibold hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansModal;
