"use client";

import { FileText } from "lucide-react";

export default function TermsService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500">
              Effective Date: February 6, 2026
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8 text-gray-600 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-gray-900">Salonvala</span>.
            By accessing or using our website, mobile app, or services
            (“Service”), you agree to comply with and be bound by these
            Terms & Conditions.
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              1. About Salonvala
            </h2>
            <p>
              Salonvala is an all-in-one Salon & Spa CRM platform designed to
              help salon owners manage appointments, customers, staff,
              services, promotions, and business insights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              2. Eligibility
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>At least 18 years old</li>
              <li>Authorized to represent a salon, spa, or grooming business</li>
            </ul>
            <p className="mt-2">
              By using Salonvala, you confirm you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              3. Account Registration
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are responsible for maintaining login credentials.</li>
              <li>Information provided must be accurate and up-to-date.</li>
              <li>You are responsible for all activity under your account.</li>
              <li>
                Salonvala reserves the right to suspend or terminate accounts
                found to be misused.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              4. Free Trial & Subscription
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Free trial up to 3 months (if applicable).</li>
              <li>Paid plans apply after trial period.</li>
              <li>Pricing may change with prior notice.</li>
              <li>No credit card required for free trial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              5. Acceptable Use
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Do not use for illegal or fraudulent purposes.</li>
              <li>Do not upload harmful or misleading content.</li>
              <li>Do not attempt to hack or disrupt the platform.</li>
              <li>Do not misuse customer data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              6. WhatsApp & SMS Communication
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Automated reminders and notifications are provided.</li>
              <li>You are responsible for obtaining customer consent.</li>
              <li>Delivery depends on third-party providers.</li>
              <li>Salonvala is not responsible for delivery failures.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              7. Data Accuracy & Business Decisions
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reports are based on entered data.</li>
              <li>No guarantee of business profits.</li>
              <li>Business decisions are your responsibility.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              8. Intellectual Property
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All software and branding belong to Salonvala.</li>
              <li>Do not copy or resell the platform.</li>
              <li>Do not reverse engineer the software.</li>
              <li>Do not use branding without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              9. Termination
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violation of terms</li>
              <li>Harmful usage</li>
              <li>Required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              10. Limitation of Liability
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Business losses</li>
              <li>Third-party delivery failures</li>
              <li>Data loss due to negligence</li>
            </ul>
            <p className="mt-2">Use of the service is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              11. Changes to Terms
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Terms may be updated periodically.</li>
              <li>Continued use means acceptance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              12. Governing Law
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Governed by the laws of India.</li>
              <li>Disputes subject to Indian jurisdiction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              13. Contact Us
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