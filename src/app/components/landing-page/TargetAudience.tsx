"use client";
import { motion } from "motion/react";
import { Scissors, Sparkles, Flower2, Palette, Building2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const businesses = [
  {
    icon: Scissors,
    title: "Hair Salons",
    description: "Perfect for traditional and modern hair salons",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Beauty & Unisex Salons",
    description: "Complete solution for full-service salons",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Flower2,
    title: "Luxury Spas",
    description: "Premium features for high-end spas",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Palette,
    title: "Nail, Makeup & Grooming Studios",
    description: "Tailored for specialty beauty services",
    color: "from-fuchsia-500 to-pink-500",
  },
  // {
  //   icon: Building2,
  //   title: "Multi-branch Salon Chains",
  //   description: "Scale across multiple locations",
  //   color: "from-purple-500 to-indigo-500",
  // },
];

export function TargetAudience() {
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Built for Every Salon & Spa Business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you run a small salon or a fast-growing spa, Salonvala grows
            with you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businesses.map((business, index) => (
            <motion.div
              key={business.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 group cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <business.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{business.title}</h3>
                  <p className="text-gray-500">{business.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-700 font-medium">
            Whether you run a small salon or a fast-growing spa, Salonvala grows
            with you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
