"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "./MetricCard";
import RecentRenewalsWidget from "./RecentRenewalsWidget";
import ExpirationAlertsWidget from "./ExpirationAlertsWidget";
import { ownerApi } from "@/app/services/owner.api";
import { useAppSelector } from "@/app/store/hooks";
import { normalizeRole } from "@/app/utils/normalizeRole";

interface MetricData {
  totalSalons: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  renewalCount: number;
  totalRevenue: number;
  totalAppointments: number;
}

interface Renewal {
  id: string | number;
  salonName: string;
  phoneNumber: string;
  address: string;
  date: string;
}

interface ExpirationAlert {
  id: string | number;
  salonName: string;
  ownerName: string;
  expirationDate: string;
  daysRemaining: number;
  planType?: string;
}

interface ChartDataPoint {
  month: string;
  revenue: number;
  renewals: number;
}

const DashboardInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [metrics, setMetrics] = useState<MetricData>({
    totalSalons: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    renewalCount: 156,
    totalRevenue: 487650.0,
    totalAppointments: 12847,
  });
  const [recentRenewals, setRecentRenewals] = useState<Renewal[]>([]);
  const [expirationAlerts, setExpirationAlerts] = useState<ExpirationAlert[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const authUser = useAppSelector((state) => state.auth.user);
  const effectiveRole = Array.isArray(authUser?.role)
    ? authUser?.role[0]
    : (authUser?.role ?? "salon_owner");
  const normalizedRole = normalizeRole(effectiveRole);

  useEffect(() => {
    if (normalizedRole !== "SUPERADMIN") {
      router.replace("/salon-dashboard");
    }
  }, [normalizedRole, router]);

  useEffect(() => {
    setIsHydrated(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        totalSalons,
        activeSalons,
        expiredSalons,
        recentOnboardedResponse,
        expiringSalonsResponse,
      ] = await Promise.all([
        ownerApi.getTotalSalonsCount(),
        ownerApi.getActiveSalonsCount(),
        ownerApi.getExpiredSalonsCount(),
        ownerApi.getRecentOnboardedSalons(),
        ownerApi.getExpiringSalons(),
      ]);

      setMetrics((prev) => ({
        ...prev,
        totalSalons,
        activeSubscriptions: activeSalons,
        expiredSubscriptions: expiredSalons,
      }));

      // Map API data to Renewal format
      if (recentOnboardedResponse && Array.isArray(recentOnboardedResponse)) {
        const mappedRenewals: Renewal[] = recentOnboardedResponse.map(
          (item: any) => ({
            id: item._id,
            salonName: item.user?.email || "Unknown Salon",
            phoneNumber: item.user?.phoneNumber || "N/A",
            address: item.user?.address || "N/A",
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
              : "N/A",
          }),
        );
        setRecentRenewals(mappedRenewals);
      }

      // Map API data to ExpirationAlert format
      if (expiringSalonsResponse && Array.isArray(expiringSalonsResponse)) {
        const mappedAlerts: ExpirationAlert[] = expiringSalonsResponse.map(
          (item: any) => ({
            id: item._id,
            salonName: item.user?.email || "Unknown Salon",
            ownerName:
              item.user?.email?.split("@")[0] ||
              item.user?.phoneNumber ||
              "N/A",
            expirationDate: item.subscriptionEndDate
              ? new Date(item.subscriptionEndDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
              : "N/A",
            daysRemaining: item.daysLeft || 0,
            // planType: "Active Plan", // API doesn't seem to provide plan name directly in this snippet
          }),
        );
        setExpirationAlerts(mappedAlerts);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const expirationAlerts: ExpirationAlert[] = [
  //   {
  //     id: 1,
  //     salonName: "Radiant Beauty Bar",
  //     ownerName: "Sarah Johnson",
  //     expirationDate: "02/03/2026",
  //     daysRemaining: 5,
  //     planType: "Premium Plan",
  //   },
  //   {
  //     id: 2,
  //     salonName: "Chic Cuts & Color",
  //     ownerName: "Michael Chen",
  //     expirationDate: "02/08/2026",
  //     daysRemaining: 10,
  //     planType: "Standard Plan",
  //   },
  //   {
  //     id: 3,
  //     salonName: "Serenity Spa & Salon",
  //     ownerName: "Emily Rodriguez",
  //     expirationDate: "02/12/2026",
  //     daysRemaining: 14,
  //     planType: "Premium Plan",
  //   },
  //   {
  //     id: 4,
  //     salonName: "Urban Style Studio",
  //     ownerName: "David Thompson",
  //     expirationDate: "02/15/2026",
  //     daysRemaining: 17,
  //     planType: "Basic Plan",
  //   },
  // ];

  const chartData: ChartDataPoint[] = [
    { month: "Jul", revenue: 385000, renewals: 320000 },
    { month: "Aug", revenue: 412000, renewals: 345000 },
    { month: "Sep", revenue: 398000, renewals: 335000 },
    { month: "Oct", revenue: 445000, renewals: 378000 },
    { month: "Nov", revenue: 468000, renewals: 395000 },
    { month: "Dec", revenue: 492000, renewals: 418000 },
    { month: "Jan", revenue: 487650, renewals: 412000 },
  ];

  const metricCards = [
    {
      title: "Total Salons Onboarded",
      value: metrics.totalSalons,
      icon: "BuildingStorefrontIcon",
      //   trend: { value: 12.5, isPositive: true },
      route: "/salon-management",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      icon: "CheckCircleIcon",
      // trend: { value: 8.3, isPositive: true },
      route: "/subscription-management",
    },
    {
      title: "Expired Subscriptions",
      value: metrics.expiredSubscriptions,
      icon: "XCircleIcon",
      // trend: { value: 3.2, isPositive: false },
      route: "/subscription-management",
    },
    // {
    //   title: "Renewal Count",
    //   value: metrics.renewalCount,
    //   icon: "ArrowPathIcon",
    //   trend: { value: 15.7, isPositive: true },
    //   route: "/renewals-management",
    // },
    // {
    //   title: "Total Revenue from Renewals",
    //   value: `$${metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    //   icon: "CurrencyDollarIcon",
    //   trend: { value: 22.4, isPositive: true },
    //   route: "/revenue-analytics",
    // },
    // {
    //   title: "Total Appointments",
    //   value: metrics.totalAppointments.toLocaleString("en-US"),
    //   icon: "CalendarDaysIcon",
    //   trend: { value: 18.9, isPositive: true },
    //   route: "/dashboard-overview",
    // },
  ];

  if (!isHydrated || isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">
          Dashboard Overview
        </h1>
        <p className="font-body text-base text-text-secondary">
          Comprehensive visibility into salon network performance and
          subscription health
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricCards.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            // trend={card.trend}
            onClick={() => router.push(card.route)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentRenewalsWidget renewals={recentRenewals} />
        <ExpirationAlertsWidget alerts={expirationAlerts} />
      </div>

      {/* <RevenueTrendChart data={chartData} /> */}
    </div>
  );
};

export default DashboardInteractive;
