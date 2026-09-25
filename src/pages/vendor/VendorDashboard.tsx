import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Coins,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Package,
    AlertTriangle,
    ArrowRight,
    Plus,
    Tag,
    Boxes,
    Eye,
    Store,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { StatCard, StatusBadge, SalesChart } from "../../components/vendor/common";
import { OrderDetailsModal } from "../../components/vendor/orders/OrderDetailsModal";
import type { VendorOrder } from "../../types/vendor";

export const VendorDashboard = () => {
    const { store, products, orders, analytics, updateOrderStatus } = useVendor();
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);

    // Recent orders (top 5)
    const recentOrders = orders.slice(0, 5);

    // Low stock products
    const lowStockProducts = products.filter(
        (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
    );

    // Top-selling products
    const topProducts = [...products]
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);

    return (
        <div className="space-y-8">
            {/* ── 1. DASHBOARD HERO BANNER ───────────────────────────────── */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#172E20] via-[#1E3C2A] to-emerald-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                            <Store className="size-3.5" />
                            <span>{store.storeName}</span>
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            <span>{store.isOpen ? "Open for Online Deliveries" : "Temporarily Closed"}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif">
                            Store Counter Overview
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                            Real-time order queue, automated rider courier pickups, and inventory tracking for your neighborhood store.
                        </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            to="/vendor/products/new"
                            className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="size-4" />
                            <span>Add New Product</span>
                        </Link>

                        <Link
                            to="/vendor/deals"
                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 border border-white/20 transition-all"
                        >
                            <Tag className="size-4 text-amber-400" />
                            <span>Create Discount</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── 2. KEY METRICS STAT CARDS ─────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Sales"
                    value={`Rs. ${analytics.totalRevenue.toLocaleString()}`}
                    change={`+${analytics.revenueChangePercent}%`}
                    isPositive={true}
                    icon={Coins}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-700"
                />

                <StatCard
                    title="Today's Orders"
                    value={analytics.todayOrders}
                    subtitle="5 active orders"
                    icon={ShoppingBag}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-700"
                    onClick={() => navigate("/vendor/orders")}
                />

                <StatCard
                    title="Pending Orders"
                    value={analytics.pendingOrders}
                    subtitle="Needs confirmation"
                    icon={Clock}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-700"
                    alert={analytics.pendingOrders > 0}
                    onClick={() => navigate("/vendor/orders")}
                />

                <StatCard
                    title="Completed Orders"
                    value={analytics.completedOrders}
                    subtitle="Lifetime fulfilled"
                    icon={CheckCircle2}
                    iconBg="bg-teal-50"
                    iconColor="text-teal-700"
                />

                <StatCard
                    title="Total Products"
                    value={products.length}
                    subtitle="Live catalog items"
                    icon={Package}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-700"
                    onClick={() => navigate("/vendor/products")}
                />

                <StatCard
                    title="Low Stock Alert"
                    value={analytics.lowStockCount}
                    subtitle="Restock required"
                    icon={AlertTriangle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-700"
                    alert={analytics.lowStockCount > 0}
                    onClick={() => navigate("/vendor/inventory")}
                />
            </div>

            {/* ── 3. LOW STOCK WARNING BANNER (IF ANY) ──────────────────── */}
            {lowStockProducts.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-amber-900">
                                {lowStockProducts.length} product{lowStockProducts.length === 1 ? "" : "s"} running low on stock!
                            </p>
                            <p className="text-xs text-amber-700">
                                Items like <strong>{lowStockProducts[0].name}</strong> ({lowStockProducts[0].stock} {lowStockProducts[0].unit} left) may go out of stock soon.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/vendor/inventory"
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
                    >
                        Update Stock Now →
                    </Link>
                </div>
            )}

            {/* ── 4. SALES CHART & REVENUE OVERVIEW ─────────────────────── */}
            <SalesChart
                dailyData={analytics.dailySales}
                weeklyData={analytics.weeklySales}
                monthlyData={analytics.monthlySales}
                currency="Rs."
            />

            {/* ── 5. RECENT ORDERS & TOP PRODUCTS GRID ──────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Recent Orders (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-base sm:text-lg text-zinc-900">
                                Recent Store Orders
                            </h3>
                            <p className="text-xs text-zinc-500">Live stream of customer purchases</p>
                        </div>

                        <Link
                            to="/vendor/orders"
                            className="text-xs font-bold text-app-orange hover:text-app-orange-dark transition-colors inline-flex items-center gap-1"
                        >
                            <span>View All Orders</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    <th className="pb-3">Order</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Items</th>
                                    <th className="pb-3">Total</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 text-xs sm:text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                                        <td className="py-3.5 font-bold text-zinc-900">
                                            #{order.orderNumber}
                                            <span className="block text-[11px] font-normal text-zinc-400">
                                                {new Date(order.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </td>
                                        <td className="py-3.5">
                                            <p className="font-semibold text-zinc-800">{order.customer.name}</p>
                                            <p className="text-[11px] text-zinc-400">{order.customer.ward}, {order.customer.city}</p>
                                        </td>
                                        <td className="py-3.5 text-zinc-600">
                                            {order.items.length} item{order.items.length === 1 ? "" : "s"}
                                        </td>
                                        <td className="py-3.5 font-bold text-zinc-900">
                                            Rs. {order.total.toLocaleString()}
                                            <span className="block text-[10px] text-zinc-400 font-normal">{order.paymentMethod}</span>
                                        </td>
                                        <td className="py-3.5">
                                            <StatusBadge status={order.status} size="sm" />
                                        </td>
                                        <td className="py-3.5 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors inline-flex items-center gap-1"
                                            >
                                                <Eye className="size-3.5" />
                                                <span>Manage</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top-Selling Products (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-base text-zinc-900">
                                    Top Selling Products
                                </h3>
                                <p className="text-xs text-zinc-500">Highest order demand</p>
                            </div>
                            <Link
                                to="/vendor/products"
                                className="text-xs font-bold text-app-orange hover:underline"
                            >
                                Catalog →
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {topProducts.map((p, idx) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-bold text-zinc-400 w-4 text-center">
                                            0{idx + 1}
                                        </span>
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="size-10 rounded-xl object-cover border border-zinc-200 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-zinc-900 truncate">
                                                {p.name}
                                            </p>
                                            <p className="text-[11px] text-zinc-500">
                                                Rs. {p.price} / {p.unit}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-bold text-emerald-700 block">
                                            {p.salesCount} sold
                                        </span>
                                        <span
                                            className={`text-[10px] ${
                                                p.stock <= p.lowStockThreshold
                                                    ? "text-amber-600 font-bold"
                                                    : "text-zinc-400"
                                            }`}
                                        >
                                            {p.stock} in stock
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                        <Link
                            to="/vendor/inventory"
                            className="w-full py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                            <Boxes className="size-4" />
                            <span>Quick Stock Replenishment</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Order Details Drawer / Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={updateOrderStatus}
            />
        </div>
    );
};

export default VendorDashboard;
