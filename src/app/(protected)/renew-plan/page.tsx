"use client";

import React from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const RenewPlan = () => {
  const plans = [
    {
      name: "Basic Plan",
      price: "Free",
      duration: "3 Months",
      description: "Perfect for small salons just getting started.",
      features: [
        { label: "50 WhatsApp Messages", icon: "MessageSquare" },
        { label: "Unlimited Appointments", icon: "Calendar" },
        { label: "Unlimited Customers", icon: "Users" },
        { label: "3 Combo Offers", icon: "BadgePercent" },
        { label: "10 Staff Members", icon: "UserCog" },
      ],
      buttonText: "Renew Basic",
      isPopular: false,
    },
    {
      name: "Pro Plan",
      price: "₹2,499",
      duration: "Per Month",
      description: "The ultimate solution for high-growth salons.",
      features: [
        { label: "150 WhatsApp Messages", icon: "MessageSquare" },
        { label: "Unlimited Appointments", icon: "Calendar" },
        { label: "Unlimited Customers", icon: "Users" },
        { label: "Unlimited Combo Offers", icon: "BadgePercent" },
        { label: "Unlimited Staff Members", icon: "UserCog" },
      ],
      buttonText: "Renew Pro",
      isPopular: true,
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
          Renew Your <span className="text-primary">SalonHub</span> Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the best plan to keep your salon running smoothly and provide
          an exceptional experience for your customers.
        </p>
      </div>

      {/* Plans Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-center items-stretch">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
              plan.isPopular
                ? "bg-card border-primary shadow-lg ring-1 ring-primary/20"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground font-medium">
                  /{plan.duration}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex-grow space-y-6 mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
                What's included:
              </p>
              <ul className="space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon
                        name={feature.icon as any}
                        size={16}
                        className="text-primary"
                      />
                    </div>
                    <span className="text-foreground font-medium">
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant={plan.isPopular ? "default" : "outline"}
              className={`w-full py-6 text-lg font-bold rounded-2xl transition-all duration-300 ${
                plan.isPopular
                  ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                  : "hover:bg-primary/5 border-2"
              }`}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8 border-t border-border/50">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted/30 border border-border text-sm text-muted-foreground">
          <Icon name="ShieldCheck" size={16} className="text-green-500" />
          <span>Secure checkout provided by SalonHub Payments</span>
        </div>
      </div>
    </div>
  );
};

export default RenewPlan;
