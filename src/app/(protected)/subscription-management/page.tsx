import type { Metadata } from "next";
import SubscriptionManagementInteractive from "./components/SubscriptionManagementInteractive";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

export const metadata: Metadata = {
  title: "Subscription Management - SalonCRM SuperAdmin",
  description:
    "Comprehensive subscription management dashboard for tracking salon plans, payment status, renewals, and lifetime payment totals across the network.",
};

export default function SubscriptionManagementPage() {
  return (
    <>
      <Sidebar />
      {/* <Header /> */}

      <main className="min-h-screen bg-background lg:ml-60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">
              Subscription Management
            </h1>
            <p className="text-base text-text-secondary">
              Monitor and manage all salon subscription plans, payment tracking,
              and renewal workflows across your network
            </p>
          </div>

          <SubscriptionManagementInteractive />
        </div>
      </main>
    </>
  );
}
