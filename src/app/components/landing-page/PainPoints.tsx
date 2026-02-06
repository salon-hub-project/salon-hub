"use client";
import { motion } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";

const problems = [
  "Missed & double bookings",
  "Customers forget appointments",
  "No customer history or loyalty tracking",
  "Staff scheduling confusion",
  "No visibility on salon performance",
];

export function PainPoints() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Still managing your salon manually?
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Problems Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Common Problems
                </h3>
              </div>
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <motion.li
                    key={problem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{problem}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solution Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">
                  Salonvala Solves All of This
                </h3>
              </div>
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Smart booking system prevents conflicts</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Automatic WhatsApp & reminders</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Complete customer history & loyalty tracking</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Easy staff schedule management</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Real-time analytics & performance insights</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg">
              ✨ Transform Your Salon Today
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
