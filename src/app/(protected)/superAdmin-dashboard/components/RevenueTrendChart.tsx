// "use client";

// import { useState, useEffect } from "react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// interface ChartDataPoint {
//   month: string;
//   revenue: number;
//   renewals: number;
// }

// interface RevenueTrendChartProps {
//   data: ChartDataPoint[];
// }

// const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [selectedRange, setSelectedRange] = useState<"3m" | "6m" | "12m">("6m");

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const filterDataByRange = (range: "3m" | "6m" | "12m") => {
//     const rangeMap = { "3m": 3, "6m": 6, "12m": 12 };
//     return data.slice(-rangeMap[range]);
//   };

//   const filteredData = filterDataByRange(selectedRange);

//   if (!isHydrated) {
//     return (
//       <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="font-heading text-lg font-semibold text-foreground">
//             Revenue Trends
//           </h3>
//           <div className="flex gap-2">
//             <div className="h-8 w-16 bg-muted rounded animate-pulse" />
//             <div className="h-8 w-16 bg-muted rounded animate-pulse" />
//             <div className="h-8 w-16 bg-muted rounded animate-pulse" />
//           </div>
//         </div>
//         <div className="h-80 bg-muted rounded animate-pulse" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="font-heading text-lg font-semibold text-foreground">
//           Revenue Trends
//         </h3>
//         <div className="flex gap-2">
//           {(["3m", "6m", "12m"] as const).map((range) => (
//             <button
//               key={range}
//               onClick={() => setSelectedRange(range)}
//               className={`px-3 py-1.5 rounded-md font-body text-sm font-medium transition-smooth ${
//                 selectedRange === range
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted text-text-secondary hover:bg-muted/80"
//               }`}
//             >
//               {range.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={filteredData}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="rgba(107, 114, 128, 0.2)"
//             />
//             <XAxis
//               dataKey="month"
//               stroke="rgba(107, 114, 128, 0.5)"
//               style={{ fontSize: "12px" }}
//             />
//             <YAxis
//               stroke="rgba(107, 114, 128, 0.5)"
//               style={{ fontSize: "12px" }}
//               tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "var(--color-card)",
//                 border: "1px solid var(--color-border)",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//               }}
//               formatter={(value: number) => [
//                 `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
//                 "",
//               ]}
//             />
//             <Legend
//               wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
//               iconType="line"
//             />
//             <Line
//               type="monotone"
//               dataKey="revenue"
//               stroke="#0F766E"
//               strokeWidth={2}
//               dot={{ fill: "#0F766E", r: 4 }}
//               activeDot={{ r: 6 }}
//               name="Revenue"
//             />
//             <Line
//               type="monotone"
//               dataKey="renewals"
//               stroke="#F59E0B"
//               strokeWidth={2}
//               dot={{ fill: "#F59E0B", r: 4 }}
//               activeDot={{ r: 6 }}
//               name="Renewals"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default RevenueTrendChart;
