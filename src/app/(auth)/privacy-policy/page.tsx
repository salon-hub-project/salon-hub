"use client";

import { ScrollText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shadow-md">
            <ScrollText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Effective Date: February 6, 2026
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8 text-gray-600 leading-relaxed">
          <p>
            At <span className="font-semibold text-gray-900">Salonvala</span>,
            your privacy is important to us. This Privacy Policy explains how
            we collect, use, and protect your data.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              1. Information We Collect
            </h2>

            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                a) Business Information
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Salon name, address, contact details</li>
                <li>Owner name and account credentials</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                b) Customer Data (Entered by You)
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Customer name, phone number</li>
                <li>Appointment history</li>
                <li>Preferences and visit records</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800">c) Usage Data</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Login activity</li>
                <li>Features used</li>
                <li>Device and browser info</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Manage appointments & reminders</li>
              <li>Enable CRM features</li>
              <li>Improve platform performance</li>
              <li>Provide customer support</li>
              <li>Send important service updates</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              3. WhatsApp & SMS Data
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Customer contact data is used only for reminders &
                notifications.
              </li>
              <li>
                Salonvala does not sell or misuse customer contact details.
              </li>
              <li>
                Communication is sent via secure third-party providers.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              4. Data Sharing
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Trusted service providers (SMS, WhatsApp, hosting)</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              5. Data Security
            </h2>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>Secure servers</li>
              <li>Encrypted connections</li>
              <li>Access controls</li>
            </ul>
            <p>
              However, no system is 100% secure. You are responsible for
              safeguarding login credentials.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              6. Data Ownership
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You own your salon & customer data</li>
              <li>Salonvala only processes data to provide services</li>
              <li>You may request data export or deletion</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookies</h2>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>Improve user experience</li>
              <li>Track session activity</li>
              <li>Optimize performance</li>
            </ul>
            <p>You may disable cookies in your browser settings.</p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              8. Account Deletion
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You may request account deletion by contacting support.</li>
              <li>Data will be deleted as per legal requirements.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              9. Changes to Privacy Policy
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>This policy may be updated periodically.</li>
              <li>Continued use indicates acceptance of changes.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              10. Contact Us
            </h2>
            <div className="space-y-1">
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:support@magicalswap.com"
                  className="text-purple-600 hover:underline"
                >
                  support@magicalswap.com
                </a>
              </p>
              <p>📞 Phone: +91 7987421625</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}