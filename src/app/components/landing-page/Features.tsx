"use client";
import { motion } from "motion/react";
import {
  Calendar,
  MessageSquare,
  Users,
  UserCheck,
  Gift,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    icon: Calendar,
    title: "Smart Appointment Management",
    description:
      "Book, reschedule, and manage appointments in seconds — walk-in or online.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Automation",
    description: "Automatic confirmations & reminders to reduce no-shows.",
    color: "from-green-500 to-emerald-500",
  },
  // {
  //   icon: Users,
  //   title: "Customer CRM",
  //   description:
  //     "Track visit history, preferences, repeat customers & spending.",
  //   color: "from-purple-500 to-violet-500",
  // },
  {
    icon: UserCheck,
    title: "Staff & Services Management",
    description:
      "Manage staff schedules, services, pricing & availability easily.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Gift,
    title: "Combo Offers & Promotions",
    description: "Create smart offers to increase revenue per customer.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Insights Dashboard",
    description: "See bookings, growth & performance at a glance.",
    color: "from-indigo-500 to-purple-500",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ✨ POWERFUL FEATURES
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Everything You Need to Run a Modern Salon
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools you need to streamline operations and delight your
            customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 hover:border-purple-200">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-6">
            Everything works together seamlessly
          </h3>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            From booking to billing, Salonvala's features are designed to work
            together perfectly, giving you a complete view of your salon
            business.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
