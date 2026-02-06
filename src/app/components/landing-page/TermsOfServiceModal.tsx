"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
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
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Terms & Conditions
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
                  Welcome to Salonvala. By accessing or using our website,
                  mobile app, or services (“Service”), you agree to comply with
                  and be bound by these Terms & Conditions. If you do not agree,
                  please do not use Salonvala.
                </p>

                <div className="space-y-4">
                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      1. About Salonvala
                    </h3>
                    <p>
                      Salonvala is an all-in-one Salon & Spa CRM platform
                      designed to help salon owners manage appointments,
                      customers, staff, services, promotions, and business
                      insights.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      2. Eligibility
                    </h3>
                    <p className="mb-2">You must be:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>At least 18 years old</li>
                      <li>
                        Authorized to represent a salon, spa, or grooming
                        business
                      </li>
                    </ul>
                    <p className="mt-2">
                      By using Salonvala, you confirm you meet these
                      requirements.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      3. Account Registration
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        You are responsible for maintaining the confidentiality
                        of your login credentials.
                      </li>
                      <li>
                        All information provided must be accurate and
                        up-to-date.
                      </li>
                      <li>
                        You are responsible for all activity under your account.
                      </li>
                      <li>
                        Salonvala reserves the right to suspend or terminate
                        accounts found to be misused.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      4. Free Trial & Subscription
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Salonvala may offer a free trial (up to 3 months).
                      </li>
                      <li>
                        After the trial, paid plans apply as per pricing shown.
                      </li>
                      <li>Pricing may change with prior notice.</li>
                      <li>No credit card is required for the free trial.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      5. Acceptable Use
                    </h3>
                    <p className="mb-2">You agree not to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use Salonvala for illegal or fraudulent purposes</li>
                      <li>Upload harmful, abusive, or misleading content</li>
                      <li>Attempt to hack, copy, or disrupt the platform</li>
                      <li>Misuse customer data collected through Salonvala</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      6. WhatsApp & SMS Communication
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Salonvala provides automated WhatsApp/SMS reminders and
                        notifications.
                      </li>
                      <li>
                        You are responsible for obtaining customer consent.
                      </li>
                      <li>
                        Message delivery depends on third-party providers.
                      </li>
                      <li>
                        Salonvala is not responsible for delivery failures.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      7. Data Accuracy & Business Decisions
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Salonvala provides reports and insights based on entered
                        data.
                      </li>
                      <li>We do not guarantee business profits or results.</li>
                      <li>
                        Decisions made using reports are solely your
                        responsibility.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      8. Intellectual Property
                    </h3>
                    <p className="mb-2">
                      All content, software, branding, and logos belong to
                      Salonvala. You may not:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Copy or resell the platform</li>
                      <li>Reverse engineer the software</li>
                      <li>Use branding without written permission</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      9. Termination
                    </h3>
                    <p className="mb-2">
                      Salonvala may suspend or terminate your access if:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You violate these terms</li>
                      <li>Your usage harms the platform or others</li>
                      <li>Required by law</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      10. Limitation of Liability
                    </h3>
                    <p className="mb-2">Salonvala is not liable for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Business losses</li>
                      <li>
                        Missed appointments due to internet or third-party
                        failures
                      </li>
                      <li>Data loss caused by user negligence</li>
                    </ul>
                    <p className="mt-2">
                      Use of the service is at your own risk.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      11. Changes to Terms
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Salonvala may update these Terms from time to time.
                      </li>
                      <li>Continued use means acceptance of updated terms.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      12. Governing Law
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>These Terms are governed by the laws of India.</li>
                      <li>
                        Any disputes shall be subject to Indian jurisdiction.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-2">
                      13. Contact Us
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
