import type { Metadata } from "next";

import DashboardInteractive from "./components/DashboardInteractive";

export const metadata: Metadata = {
  title: "Dashboard Overview - SalonCRM SuperAdmin",
  description:
    "Comprehensive visibility into salon network performance, subscription health, and key business metrics across all onboarded salons.",
};

export default function DashboardOverviewPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <DashboardInteractive />
      </main>
    </>
  );
}
