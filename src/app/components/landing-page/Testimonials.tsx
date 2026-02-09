"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Owner, Glow & Style Salon",
    content:
      "Salonvala has completely transformed how I manage my appointments. No more double bookings and my customers love the WhatsApp reminders!",
    rating: 5,
    location: "Mumbai",
  },
  {
    name: "Rahul Verma",
    role: "Manager, The Men's Lounge",
    content:
      "The inventory management feature alone has saved us thousands. Highly recommend this for any salon looking to scale.",
    rating: 5,
    location: "Delhi",
  },
  {
    name: "Anjali Gupta",
    role: "Freelance Makeup Artist",
    content:
      "Simple, effective, and affordable. The best part is the customer support - they are always there to help.",
    rating: 5,
    location: "Bangalore",
  },
  {
    name: "Vikram Singh",
    role: "Director, Luxury Spa",
    content:
      "We switched from a generic software to Salonvala and the difference is day and night. It's built specifically for our needs.",
    rating: 5,
    location: "Pune",
  },
  {
    name: "Sneha Patel",
    role: "Owner, Cut & Curl",
    content:
      "My staff loves using it. It's so intuitive that I didn't even have to train them. Great job team Salonvala!",
    rating: 5,
    location: "Ahmedabad",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container px-4 mx-auto mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            HAPPY CUSTOMERS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Trusted by 500+ Salon Owners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what successful salon owners
            have to say about Salonvala.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        {/* Marquee Container */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 py-4 px-4"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {/* Double the list for infinite loop effect */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${index}`}
                className="w-[350px] md:w-[400px] flex-shrink-0 hover:shadow-lg transition-shadow duration-300 border-none shadow-sm"
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic relative z-0">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
