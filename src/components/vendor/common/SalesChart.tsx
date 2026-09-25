import { useState } from "react";
import type { SalesDataPoint } from "../../../types/vendor";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
    dailyData: SalesDataPoint[];
    weeklyData: SalesDataPoint[];
    monthlyData: SalesDataPoint[];
    currency?: string;
}

export const SalesChart = ({
    dailyData,
    weeklyData,
    monthlyData,
    currency = "Rs.",
}: SalesChartProps) => {
    const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const currentData =
        timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData;

    const maxRevenue = Math.max(...currentData.map((d) => d.revenue), 1000);
    const totalRevenuePeriod = currentData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrdersPeriod = currentData.reduce((sum, d) => sum + d.orders, 0);

    // SVG plotting dimensions
    const width = 600;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;

    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = currentData.map((d, i) => {
        const x = paddingX + (i / (currentData.length - 1 || 1)) * chartWidth;
        const y = height - paddingY - (d.revenue / maxRevenue) * chartHeight;
        return { x, y, ...d };
    });

    // Generate smooth line path
    const pathD = points.reduce((acc, point, i) => {
        return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
    }, "");

    // Closed path for SVG area gradient fill
    const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${
        height - paddingY
    } L ${points[0]?.x || 0} ${height - paddingY} Z`;

    const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-5">
            {/* Header: Title + Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                            <TrendingUp className="size-4" />
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-zinc-900">
                            Sales & Revenue Overview
                        </h3>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Track live earnings and order volume trends
                    </p>
                </div>

                {/* Timeframe pill buttons */}
                <div className="inline-flex p-1 bg-zinc-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
                    <button
                        onClick={() => {
                            setTimeframe("daily");
                            setHoveredIndex(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                            timeframe === "daily"
                                ? "bg-white text-zinc-900 shadow-xs font-bold"
                                : "text-zinc-500 hover:text-zinc-800"
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => {
                            setTimeframe("weekly");
                            setHoveredIndex(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                            timeframe === "weekly"
                                ? "bg-white text-zinc-900 shadow-xs font-bold"
                                : "text-zinc-500 hover:text-zinc-800"
                        }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => {
                            setTimeframe("monthly");
                            setHoveredIndex(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                            timeframe === "monthly"
                                ? "bg-white text-zinc-900 shadow-xs font-bold"
                                : "text-zinc-500 hover:text-zinc-800"
                        }`}
                    >
                        Months (2026)
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 sm:p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Period Revenue
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-app-green mt-0.5">
                        {currency} {totalRevenuePeriod.toLocaleString()}
                    </p>
                </div>
                <div>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Total Orders
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-app-orange mt-0.5">
                        {totalOrdersPeriod} Orders
                    </p>
                </div>
                <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-zinc-200/60 pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Avg / Interval
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-zinc-700 mt-0.5">
                        {currency}{" "}
                        {Math.round(totalRevenuePeriod / (currentData.length || 1)).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div className="relative w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-48 sm:h-64 overflow-visible"
                >
                    <defs>
                        <linearGradient id="vendorSalesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = height - paddingY - ratio * chartHeight;
                        return (
                            <line
                                key={idx}
                                x1={paddingX}
                                y1={y}
                                x2={width - paddingX}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeDasharray="4 4"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Gradient Area */}
                    <path d={areaD} fill="url(#vendorSalesGrad)" />

                    {/* Trend Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Interactive Data Points */}
                    {points.map((pt, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <g
                                key={i}
                                className="cursor-pointer transition-transform"
                                onMouseEnter={() => setHoveredIndex(i)}
                            >
                                {/* Invisible larger target for easy touch/mouse */}
                                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                                {/* Visible circle */}
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? "6" : "4"}
                                    fill={isHovered ? "#F97316" : "#059669"}
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    className="transition-all duration-150"
                                />

                                {/* X-axis label */}
                                <text
                                    x={pt.x}
                                    y={height - 8}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill={isHovered ? "#0F172A" : "#64748B"}
                                    fontWeight={isHovered ? "bold" : "normal"}
                                >
                                    {pt.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Hover Details Card (Float above) */}
                {activePoint && (
                    <div className="absolute top-2 right-2 bg-zinc-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg flex items-center gap-3 pointer-events-none animate-fade-in border border-zinc-700">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-400" />
                            <span className="text-zinc-300">{activePoint.label}:</span>
                            <span className="font-bold text-amber-300">
                                {currency} {activePoint.revenue.toLocaleString()}
                            </span>
                        </div>
                        <span className="text-zinc-400 border-l border-zinc-700 pl-2">
                            {activePoint.orders} orders
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
