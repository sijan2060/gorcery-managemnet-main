import { useState, useMemo } from "react";
import {
    ShoppingBag,
    Search,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Eye,
    Phone,
    MapPin,
    PackageCheck,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { StatusBadge, ConfirmModal } from "../../components/vendor/common";
import { OrderDetailsModal } from "../../components/vendor/orders/OrderDetailsModal";
import type { VendorOrder, VendorOrderStatus } from "../../types/vendor";

export const VendorOrders = () => {
    const { orders, updateOrderStatus, acceptOrder, rejectOrder } = useVendor();

    const [selectedTab, setSelectedTab] = useState<"All" | VendorOrderStatus>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [inspectOrder, setInspectOrder] = useState<VendorOrder | null>(null);
    const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null);

    // Filter logic
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesTab = selectedTab === "All" || o.status === selectedTab;
            const matchesSearch =
                o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customer.phone.includes(searchQuery);

            return matchesTab && matchesSearch;
        });
    }, [orders, selectedTab, searchQuery]);

    const getTabCount = (status: "All" | VendorOrderStatus) => {
        if (status === "All") return orders.length;
        return orders.filter((o) => o.status === status).length;
    };

    const tabs: ("All" | VendorOrderStatus)[] = [
        "All",
        "Pending",
        "Accepted",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
    ];

    return (
        <div className="space-y-6">
            {/* ── Top Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Orders & Fulfillment Pipeline
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Process incoming grocery orders from checkout to rider courier handoff
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search order #, customer, phone..."
                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
                    />
                </div>
            </div>

            {/* ── Status Tabs ────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((tab) => {
                    const count = getTabCount(tab);
                    const isActive = selectedTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                                isActive
                                    ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                                    : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50"
                            }`}
                        >
                            <span>{tab}</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : count > 0 && tab === "Pending"
                                        ? "bg-emerald-500 text-white animate-pulse"
                                        : "bg-zinc-100 text-zinc-600"
                                }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Orders List / Cards ─────────────────────────────────────── */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 shadow-xs space-y-3">
                        <ShoppingBag className="size-12 mx-auto text-zinc-300" />
                        <h3 className="text-base font-bold text-zinc-800">
                            No orders found in &quot;{selectedTab}&quot; status
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                            When customers order groceries from your store, they will appear here in real time.
                        </p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
                        >
                            {/* Card Top: Order Number, Time, Status, Payment */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-base text-zinc-900 font-mono">
                                        #{order.orderNumber}
                                    </span>
                                    <StatusBadge status={order.status} size="sm" />
                                    <span className="text-xs text-zinc-400">
                                        {new Date(order.orderDate).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-zinc-500">Payment:</span>
                                    <span className="font-semibold text-zinc-800">{order.paymentMethod}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            order.paymentStatus === "Paid"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-amber-100 text-amber-800"
                                        }`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Card Middle: Customer + Items */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                                {/* Customer preview */}
                                <div className="lg:col-span-4 space-y-1">
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                        Customer & Address
                                    </p>
                                    <p className="text-sm font-bold text-zinc-900">{order.customer.name}</p>
                                    <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                                        <Phone className="size-3 text-zinc-400" />
                                        <a href={`tel:${order.customer.phone}`} className="text-app-orange hover:underline font-mono">
                                            {order.customer.phone}
                                        </a>
                                    </p>
                                    <p className="text-xs text-zinc-500 flex items-start gap-1.5">
                                        <MapPin className="size-3 text-zinc-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">
                                            {order.customer.address}, {order.customer.city}
                                        </span>
                                    </p>
                                </div>

                                {/* Items mini-preview */}
                                <div className="lg:col-span-5 flex items-center gap-3 overflow-x-auto py-1">
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 shrink-0"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-9 rounded-lg object-cover border border-zinc-200"
                                            />
                                            <div className="text-xs">
                                                <p className="font-semibold text-zinc-800 max-w-28 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-zinc-500">
                                                    {item.quantity} {item.unit}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <span className="text-xs text-zinc-400 shrink-0 font-medium">
                                            +{order.items.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Total Value */}
                                <div className="lg:col-span-3 text-left lg:text-right">
                                    <span className="text-xs text-zinc-400 block">Total Amount</span>
                                    <span className="text-lg sm:text-xl font-bold text-app-green">
                                        Rs. {order.total.toLocaleString()}
                                    </span>
                                    <span className="block text-[11px] text-zinc-400">
                                        {order.items.length} items • Delivery: {order.deliveryFee === 0 ? "FREE" : `Rs. ${order.deliveryFee}`}
                                    </span>
                                </div>
                            </div>

                            {/* Card Bottom: Fast Actions */}
                            <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                                <button
                                    onClick={() => setInspectOrder(order)}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors inline-flex items-center gap-1.5 border border-zinc-200"
                                >
                                    <Eye className="size-3.5" />
                                    <span>View Full Order Details</span>
                                </button>

                                {/* Action Buttons depending on status */}
                                <div className="flex items-center gap-2">
                                    {order.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => setRejectTarget(order)}
                                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => acceptOrder(order.id)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-95"
                                            >
                                                Accept Order
                                            </button>
                                        </>
                                    )}

                                    {order.status === "Accepted" && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, "Preparing")}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all flex items-center gap-1.5"
                                        >
                                            <span>Start Preparing</span>
                                            <ArrowRight className="size-3.5" />
                                        </button>
                                    )}

                                    {order.status === "Preparing" && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, "Ready")}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs transition-all flex items-center gap-1.5"
                                        >
                                            <PackageCheck className="size-3.5" />
                                            <span>Mark Ready for Pickup</span>
                                        </button>
                                    )}

                                    {order.status === "Ready" && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, "Completed")}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="size-3.5" />
                                            <span>Handover to Rider (Complete)</span>
                                        </button>
                                    )}

                                    {order.status === "Completed" && (
                                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                            <CheckCircle2 className="size-4" /> Fulfilled
                                        </span>
                                    )}

                                    {order.status === "Cancelled" && (
                                        <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                                            <XCircle className="size-4" /> Cancelled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Inspect Order Details Drawer */}
            <OrderDetailsModal
                order={inspectOrder}
                isOpen={!!inspectOrder}
                onClose={() => setInspectOrder(null)}
                onStatusChange={updateOrderStatus}
            />

            {/* Reject Confirmation Dialog */}
            <ConfirmModal
                isOpen={!!rejectTarget}
                title={`Reject Order #${rejectTarget?.orderNumber}?`}
                message="Are you sure you want to reject this incoming grocery order? The customer will receive an immediate refund or cancellation notification."
                confirmText="Yes, Reject Order"
                isDanger={true}
                onConfirm={() => {
                    if (rejectTarget) rejectOrder(rejectTarget.id);
                }}
                onCancel={() => setRejectTarget(null)}
            />
        </div>
    );
};

export default VendorOrders;
