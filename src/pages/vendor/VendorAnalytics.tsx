import {
    TrendingUp,
    Coins,
    ShoppingBag,
    Users,
    Award,
    PieChart,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { SalesChart, StatCard } from "../../components/vendor/common";
import { categoriesData } from "../../assets/assets";

export const VendorAnalytics = () => {
    const { analytics, products } = useVendor();

    const topBestsellers = [...products]
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 6);

    // Category revenue breakdown simulation
    const categoryBreakdown = categoriesData
        .map((cat) => {
            const catProducts = products.filter((p) => p.category === cat.slug);
            const totalRevenue = catProducts.reduce(
                (sum, p) => sum + p.price * p.salesCount,
                0
            );
            return {
                name: cat.name,
                slug: cat.slug,
                revenue: totalRevenue,
            };
        })
        .filter((c) => c.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);

    const totalCategoryRevenue = categoryBreakdown.reduce((sum, c) => sum + c.revenue, 1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                    Sales & Revenue Analytics
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500">
                    Store performance metrics, daily/weekly turnover trends, and bestselling grocery items
                </p>
            </div>

            {/* ── Key High-Level Performance Stats ───────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`Rs. ${analytics.totalRevenue.toLocaleString()}`}
                    change={`+${analytics.revenueChangePercent}% vs last month`}
                    isPositive={true}
                    icon={Coins}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-700"
                />

                <StatCard
                    title="Average Order Value"
                    value={`Rs. ${analytics.averageOrderValue}`}
                    change="+12% basket size"
                    isPositive={true}
                    icon={ShoppingBag}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-700"
                />

                <StatCard
                    title="Fulfillment Success"
                    value={`${Math.round(
                        (analytics.completedOrders /
                            (analytics.completedOrders + analytics.cancelledOrders || 1)) *
                            100
                    )}%`}
                    subtitle={`${analytics.cancelledOrders} cancellations`}
                    icon={TrendingUp}
                    iconBg="bg-teal-50"
                    iconColor="text-teal-700"
                />

                <StatCard
                    title="Repeat Customer Rate"
                    value={`${analytics.repeatCustomerRate}%`}
                    change="+4.8% customer loyalty"
                    isPositive={true}
                    icon={Users}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-700"
                />
            </div>

            {/* ── Interactive SVG Sales Chart (Daily/Weekly/Monthly) ─────── */}
            <SalesChart
                dailyData={analytics.dailySales}
                weeklyData={analytics.weeklySales}
                monthlyData={analytics.monthlySales}
                currency="Rs."
            />

            {/* ── Breakdown Grid: Best Sellers & Categories ──────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Best Selling Products */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Award className="size-5 text-amber-500" />
                            <h3 className="font-bold text-base sm:text-lg text-zinc-900">
                                Best-Selling Grocery Items
                            </h3>
                        </div>
                        <span className="text-xs text-zinc-400">By units sold</span>
                    </div>

                    <div className="divide-y divide-zinc-100">
                        {topBestsellers.map((product, idx) => {
                            const estRevenue = product.price * product.salesCount;
                            return (
                                <div
                                    key={product.id}
                                    className="py-3.5 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="size-6 rounded-full bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="size-11 rounded-xl object-cover border border-zinc-200 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-[11px] text-zinc-500">
                                                Rs. {product.price} / {product.unit}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-xs sm:text-sm text-emerald-800">
                                            Rs. {estRevenue.toLocaleString()}
                                        </p>
                                        <span className="text-[11px] text-zinc-500">
                                            {product.salesCount} sold
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Category Revenue Contribution */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PieChart className="size-5 text-emerald-600" />
                            <h3 className="font-bold text-base sm:text-lg text-zinc-900">
                                Category Revenue Share
                            </h3>
                        </div>
                        <span className="text-xs text-zinc-400">Top contributors</span>
                    </div>

                    <div className="space-y-4 pt-1">
                        {categoryBreakdown.map((cat, idx) => {
                            const percent = Math.round((cat.revenue / totalCategoryRevenue) * 100);
                            const colors = [
                                "bg-emerald-600",
                                "bg-app-orange",
                                "bg-amber-500",
                                "bg-blue-600",
                                "bg-purple-600",
                                "bg-teal-600",
                            ];
                            const color = colors[idx % colors.length];

                            return (
                                <div key={cat.slug} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-zinc-800">{cat.name}</span>
                                        <span className="font-bold text-zinc-900">
                                            Rs. {cat.revenue.toLocaleString()} ({percent}%)
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${color} rounded-full transition-all duration-500`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAnalytics;
