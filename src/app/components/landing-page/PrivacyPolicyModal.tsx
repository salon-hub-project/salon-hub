"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Privacy Policy
                    </h2>
                    <p className="text-xs text-gray-500">
                      Effective Date: February 6, 2026
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-gray-600 text-sm leading-relaxed">
                <p>
                  At Salonvala, your privacy is important to us. This Privacy
                  Policy explains how we collect, use, and protect your data.
                </p>

                <div className="space-y-4">
                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      1. Information We Collect
                    </h3>

                    <div className="mb-2">
                      <span className="font-semibold">
                        a) Business Information
                      </span>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Salon name, address, contact details</li>
                        <li>Owner name and account credentials</li>
                      </ul>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold">
                        b) Customer Data (Entered by You)
                      </span>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Customer name, phone number</li>
                        <li>Appointment history</li>
                        <li>Preferences and visit records</li>
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold">c) Usage Data</span>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Login activity</li>
                        <li>Features used</li>
                        <li>Device and browser info</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      2. How We Use Your Information
                    </h3>
                    <p className="mb-2">We use your data to:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Manage appointments & reminders</li>
                      <li>Enable CRM features</li>
                      <li>Improve platform performance</li>
                      <li>Provide customer support</li>
                      <li>Send important service updates</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      3. WhatsApp & SMS Data
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Customer contact data is used only for reminders &
                        notifications.
                      </li>
                      <li>
                        Salonvala does not sell or misuse customer contact
                        details.
                      </li>
                      <li>
                        Communication is sent via secure third-party providers.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      4. Data Sharing
                    </h3>
                    <p className="mb-2">
                      We do not sell your personal or customer data. Data may be
                      shared only with:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Trusted service providers (SMS, WhatsApp, hosting)
                      </li>
                      <li>Legal authorities if required by law</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      5. Data Security
                    </h3>
                    <p className="mb-2">We use:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>Secure servers</li>
                      <li>Encrypted connections</li>
                      <li>Access controls</li>
                    </ul>
                    <p>
                      However, no system is 100% secure. You are responsible for
                      safeguarding login credentials.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      6. Data Ownership
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You own your salon & customer data</li>
                      <li>Salonvala only processes data to provide services</li>
                      <li>You may request data export or deletion</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">7. Cookies</h3>
                    <p className="mb-2">Salonvala uses cookies to:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>Improve user experience</li>
                      <li>Track session activity</li>
                      <li>Optimize performance</li>
                    </ul>
                    <p>You may disable cookies in your browser settings.</p>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      8. Account Deletion
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        You may request account deletion by contacting support.
                      </li>
                      <li>Data will be deleted as per legal requirements.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      9. Changes to Privacy Policy
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>This policy may be updated periodically.</li>
                      <li>Continued use indicates acceptance of changes.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      10. Contact Us
                    </h3>
                    <div className="space-y-1">
                      <p>
                        📧 Email:{" "}
                        <a
                          href="mailto:support@salonvala.com"
                          className="text-purple-600 hover:underline"
                        >
                          support@salonvala.com
                        </a>
                      </p>
                      <p>📞 Phone: +91 7987421625</p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
