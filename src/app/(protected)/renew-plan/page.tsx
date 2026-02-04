"use client";

import React from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const RenewPlan = () => {
  const plans = [
    {
      name: "Basic Plan",
      priceold: "251",
      price: "Free",
      duration: " UPTO 3 Months",
      duration1: "/ Per Months",
      description: "Perfect for small salons just getting started.",
      features: [
        { label: "50 WhatsApp Messages", icon: "MessageSquare" },

        { label: "Unlimited Customers", icon: "Users" },
        { label: "3 Combo Offers", icon: "BadgePercent" },
        { label: "10 Staff Members", icon: "UserCog" },
      ],
      buttonText: "Renew Basic",
      isPopular: false,
    },
    {
      name: "Pro Plan",
      price: "₹551",
      duration: "/ Per Month",
      duration2: "",
      description: "The ultimate solution for high-growth salons.",
      features: [
        { label: "150 WhatsApp Messages", icon: "MessageSquare" },
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
            className={`relative flex flex-col p-2 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
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

            <div className="mb-8 p-6 rounded-xl text-white bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600">
              <center>
                <span className="text-1xl rounded-full inline-flex font-bold text-foreground mb-2 text-black bg-white px-3 py-2">
                  {plan.name}
                </span>
              </center>
              <div className="mb-4">
                <div className="flex justify-between w-full">
                  <div>
                    <span className="text-4xl font-extrabold text-foreground text-white">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground font-medium text-white">
                      {plan.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold text-foreground line-through opacity-45 text-white">
                      {plan.priceold}
                    </span>
                    <span className="text-muted-foreground font-medium line-through opacity-45 text-white">
                      {plan.duration1}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-5 text-white">
                  {plan.description}
                </p>
              </div>
            </div>

            <div className="flex-grow space-y-6 mb-10 px-5">
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
            {/* <div className="w-full border-0 border-t border-b py-5 px-5 mb-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
                Addons
              </p>
              <ul className="w-full flex flex-col gap-3 mt-5">
                <li className="flex justify-between w-full ">
                  <span>50 WhatsApp Messages</span>
                  <span className="text-bold">100ru</span>
                </li>
                <li className="flex justify-between w-full ">
                  <span>100 WhatsApp Messages</span>
                  <span className="text-bold">200ru</span>
                </li>
                <li className="flex justify-between w-full ">
                  <span>150 WhatsApp Messages</span>
                  <span className="text-bold">300ru</span>
                </li>
              </ul>
            </div> */}

            <Button
              variant={plan.isPopular ? "default" : "outline"}
              className={`w-full py-6 text-lg font-bold rounded-2xl transition-all duration-300 ${
                plan.isPopular
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                  : "hover:bg-primary/5 border-2"
              }`}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-center items-stretch">
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm py-5 px-5 mb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
            Addons
          </p>

          <ul className="w-full flex flex-col gap-4 mt-5">
            <li className="flex justify-between items-center w-full p-4 rounded-xl border border-gray-100">
              <span>50 WhatsApp Messages</span>
              <span className="flex items-center gap-3 font-semibold">
                100INR
                <button className="py-2 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-sm font-semibold text-white">
                  Recharge Now
                </button>
              </span>
            </li>

            <li className="flex justify-between items-center w-full p-4 rounded-xl border border-gray-100">
              <span>100 WhatsApp Messages</span>
              <span className="flex items-center gap-3 font-semibold">
                200INR
                <button className="py-2 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-sm font-semibold text-white">
                  Recharge Now
                </button>
              </span>
            </li>

            <li className="flex justify-between items-center w-full p-4 rounded-xl border border-gray-100">
              <span>150 WhatsApp Messages</span>
              <span className="flex items-center gap-3 font-semibold">
                300INR
                <button className="py-2 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-sm font-semibold text-white">
                  Recharge Now
                </button>
              </span>
            </li>
          </ul>
        </div>

        <div
          className="relative flex flex-col p-2 rounded-3xl border bg-card border-primary shadow-lg ring-1 ring-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white
"
        >
          {/* Header */}
          <div className="mb-8 p-6 rounded-xl text-white ">
            <center>
              <span className="text-1xl rounded-full inline-flex font-bold text-black bg-white px-3 py-2 mb-2">
                Gold Plan
              </span>
            </center>

            <p className="mt-5 text-white leading-relaxed">
              The ultimate solution for high-growth salons.
            </p>
          </div>

          {/* Features */}
          <div className="flex-grow space-y-6 mb-10 px-5">
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Users" size={16} className="text-primary" />
                </div>
                <span className="font-medium">Contact: 7987421625</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    name="MessageSquare"
                    size={16}
                    className="text-primary"
                  />
                </div>
                <span className="font-medium">
                  Support: salonhub@yuvasoftech.com
                </span>
              </li>
            </ul>
          </div>
        </div>
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
