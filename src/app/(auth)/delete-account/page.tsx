"use client";

import { Trash2 } from "lucide-react";

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shadow-md">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Delete Salonvala Account
            </h1>
            <p className="text-sm text-gray-500">
              Request account and data deletion
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-gray-600 leading-relaxed">
          <p>
            If you would like to delete your{" "}
            <span className="font-semibold text-gray-900">
              Salonvala account
            </span>
            , please follow the instructions below.
          </p>

          {/* Instructions */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              How to Request Account Deletion
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Send an email to{" "}
                <a
                  href="mailto:support@salonvala.in"
                  className="text-red-600 hover:underline"
                >
                  support@salonvala.in
                </a>
              </li>
              <li>
                Use your <strong>registered email address</strong> for the
                request
              </li>
              <li>Mention "Account Deletion Request" in the subject</li>
            </ul>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Processing Time
            </h2>
            <p>
              We will process your request within <strong>24–48 hours</strong>{" "}
              after verifying your identity.
            </p>
          </section>

          {/* Data Deletion */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              What Happens After Deletion
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account will be permanently deleted</li>
              <li>All associated salon and customer data will be removed</li>
              <li>
                Some data may be retained if required for legal or security
                purposes
              </li>
            </ul>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Learn More</h2>
            <p>
              For more details on how we handle your data, please refer to our{" "}
              <a
                href="/privacy-policy"
                className="text-red-600 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h2>
            <p>
              If you have any questions, feel free to contact us at{" "}
              <a
                href="mailto:support@salonvala.in"
                className="text-red-600 hover:underline"
              >
                support@salonvala.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
