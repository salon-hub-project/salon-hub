"use client";
import { motion } from "motion/react";
import { Check, Sparkles, Crown, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import Icon from "../AppIcon";
import PaymentModal from "./PaymentModal";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";

const plans = [
  {
    name: "Basic Plan",
    price: "FREE",
    period: "up to 3 Months",
    description: "Perfect for salons just getting started",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    // features: [
    //   "Up to 50 appointments/month",
    //   "Basic customer management",
    //   "SMS reminders",
    //   "Single location",
    //   "Email support",
    //   "Basic reports",
    // ],
    features: [
      "100 Combo-Offers Messages",
      "500 Appointment Messages",
      "Unlimited Customers",
      "3 Combo Offers",
      "10 Staff Members",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro Plan",
    price: "₹551",
    period: "/ Month",
    description: "Ideal for high-growth salons & spas",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    // features: [
    //   "Unlimited appointments",
    //   "Advanced CRM with loyalty tracking",
    //   "WhatsApp & SMS automation",
    //   "Multi-location support",
    //   "Staff management & scheduling",
    //   "Combo offers & promotions",
    //   "Advanced analytics & reports",
    //   "Priority support",
    //   "Custom branding",
    // ],
    features: [
      "150 Combo-Offers Messages",
      "1000 Appointment Messages",
      "Unlimited Customers",
      "Unlimited Combo Offers",
      "Unlimited Staff Members",
    ],
    cta: "Get Started Now",
    popular: true,
  },
];

export function Pricing() {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrAmount, setQrAmount] = useState("₹0");
  const [qrTitle, setQrTitle] = useState("Scan to Pay");
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Simple. Transparent. Powerful.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your salon. Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute top-[-34px] left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm">
                    ⭐ MOST POPULAR
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full ${plan.popular ? "border-4 border-purple-200 shadow-2xl scale-105" : "border-2"} hover:shadow-xl transition-all duration-300`}
              >
                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>

                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-6">
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {plan.price}
                    </div>
                    <div className="text-gray-500 mt-2">{plan.period}</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </CardContent>

                <CardFooter className="pt-8">
                  <Link href="/salon-registration">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          : "bg-gray-900 hover:bg-gray-800"
                      } text-white py-6 text-lg group`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Addons & Gold Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-center items-stretch max-w-5xl mx-auto mt-16">
          <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm py-5 px-5 mb-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
              Addons
            </p>

            <ul className="w-full flex flex-col gap-4 mt-5">
              <li className="flex justify-between items-center w-full p-4 rounded-xl border border-gray-100">
                <span>50 Combo-Offer Messages</span>
                <span className="flex items-center gap-3 font-semibold">
                  100 INR
                  <button
                    className="py-2 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-sm font-semibold text-white"
                    onClick={() => {
                      setQrAmount("₹100");
                      setQrTitle("50 Combo-Offer Messages");
                      setQrOpen(true);
                    }}
                  >
                    Recharge Now
                  </button>
                </span>
              </li>

              <li className="flex justify-between items-center w-full p-4 rounded-xl border border-gray-100">
                <span>100 Appointment Messages</span>
                <span className="flex items-center gap-3 font-semibold">
                  100 INR
                  <button
                    className="py-2 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-sm font-semibold text-white"
                    onClick={() => {
                      setQrAmount("₹100");
                      setQrTitle("100 Appointment Messages");
                      setQrOpen(true);
                    }}
                  >
                    Recharge Now
                  </button>
                </span>
              </li>
            </ul>
          </div>

          <div className="relative flex flex-col p-2 rounded-3xl border bg-card border-primary shadow-lg ring-1 ring-primary/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white">
            {/* Header */}
            <div className="mb-8 p-6 rounded-xl text-white ">
              <center>
                <span className="text-1xl rounded-full inline-flex font-bold text-black bg-white px-3 py-2 mb-2">
                  Gold Plan
                </span>
              </center>

              <p className="mt-1 text-white leading-relaxed text-sm">
                A fully customized premium plan designed exclusively for
                high-end and multi-branch salons. Pricing and features are
                tailored based on your business size, usage, and growth goals.
              </p>
            </div>

            {/* Features */}
            <div className="flex-grow space-y-6 mb-10 px-5">
              <div className="pt-6 border-t border-white/30 space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Icon name="Phone" size={16} className="text-white" />
                  <span>Call / WhatsApp: 7987421625</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium">
                  <Icon name="Mail" size={16} className="text-white" />
                  <span>salonvala@magicalswap.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 space-y-4"
        >
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Upgrade anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            All prices are in Indian Rupees (₹). GST applicable as per Indian
            tax laws.
          </p>
        </motion.div>
      </div>
      <PaymentModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        amount={qrAmount}
        title={qrTitle}
      />
    </section>
  );
}
