"use client";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, X, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function CTA() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contactEmail = " support@salonvala.com";
  const contactNumber = " +91 7987421625";
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-8"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            Ready to Transform Your Salon?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/90 mb-12"
          >
            Join 100+ salon owners who are already growing their business with
            Salonvala.
            <br />
            Start your free 3-month trial today — no credit card required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/salon-registration">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold group"
              >
                Start Free for 3 Months
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-gray-500 hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Schedule a Demo
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free for 3 months</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isDemoModalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDemoModalOpen(false)}
                  className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm"
                />

                {/* Modal Container */}
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                  {/* Modal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Contact Us
                      </h2>
                      <button
                        onClick={() => setIsDemoModalOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <p className="text-gray-600 text-center">
                        Get in touch with us to schedule a demo
                      </p>

                      {/* Email */}
                      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <a
                            href={`mailto:${contactEmail}`}
                            className="text-lg font-semibold text-purple-600 hover:underline"
                          >
                            {contactEmail}
                          </a>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <a
                            href={`tel:${contactNumber}`}
                            className="text-lg font-semibold text-pink-600 hover:underline"
                          >
                            {contactNumber}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t">
                      <Button
                        onClick={() => setIsDemoModalOpen(false)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
