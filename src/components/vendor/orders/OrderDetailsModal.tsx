import {
    X,
    Phone,
    MapPin,
    Clock,
    User,
    Bike,
    CheckCircle2,
    XCircle,
    ArrowRight,
    PackageCheck,
} from "lucide-react";
import type { VendorOrder, VendorOrderStatus } from "../../../types/vendor";
import { StatusBadge } from "../common/StatusBadge";

interface OrderDetailsModalProps {
    order: VendorOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (orderId: string, status: VendorOrderStatus, note?: string) => void;
}

const pipelineSteps: VendorOrderStatus[] = ["Pending", "Accepted", "Preparing", "Ready", "Completed"];

export const OrderDetailsModal = ({
    order,
    isOpen,
    onClose,
    onStatusChange,
}: OrderDetailsModalProps) => {
    if (!isOpen || !order) return null;

    const currentStepIdx = pipelineSteps.indexOf(order.status);
    const isCancelled = order.status === "Cancelled";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-slide-in-up my-auto">
                {/* ── Modal Header ────────────────────────────────────────────── */}
                <div className="p-5 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-zinc-900">
                                Order #{order.orderNumber}
                            </h2>
                            <StatusBadge status={order.status} size="sm" />
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                            <Clock className="size-3" />
                            <span>Placed at {new Date(order.orderDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* ── Order Body ──────────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {/* Visual Status Progression Stepper */}
                    {!isCancelled ? (
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                                Fulfillment Progress
                            </p>
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-zinc-200 -z-0" />
                                <div
                                    className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-300 -z-0"
                                    style={{
                                        width: `${Math.max(0, (currentStepIdx / (pipelineSteps.length - 1)) * 90)}%`,
                                    }}
                                />

                                {pipelineSteps.map((step, idx) => {
                                    const isDone = currentStepIdx > idx;
                                    const isCurrent = currentStepIdx === idx;
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                                            <div
                                                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    isDone
                                                        ? "bg-emerald-600 text-white shadow-xs"
                                                        : isCurrent
                                                        ? "bg-app-orange text-white ring-4 ring-orange-100 shadow-md"
                                                        : "bg-white text-zinc-400 border-2 border-zinc-200"
                                                }`}
                                            >
                                                {isDone ? <CheckCircle2 className="size-4" /> : idx + 1}
                                            </div>
                                            <span
                                                className={`text-[10px] font-semibold ${
                                                    isCurrent
                                                        ? "text-app-orange font-bold"
                                                        : isDone
                                                        ? "text-zinc-800"
                                                        : "text-zinc-400"
                                                }`}
                                            >
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-rose-800 flex items-center gap-3">
                            <XCircle className="size-6 text-rose-600 shrink-0" />
                            <div>
                                <p className="font-bold text-sm">This order has been cancelled.</p>
                                <p className="text-xs text-rose-600 mt-0.5">
                                    {order.statusHistory[order.statusHistory.length - 1]?.note || "Cancelled by shop or customer."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Customer & Delivery Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Customer Info */}
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Customer Details
                            </span>
                            <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                                <User className="size-4 text-zinc-400" />
                                <span>{order.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-600">
                                <Phone className="size-3.5 text-zinc-400" />
                                <a
                                    href={`tel:${order.customer.phone}`}
                                    className="text-app-orange hover:underline font-mono"
                                >
                                    {order.customer.phone}
                                </a>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-zinc-600">
                                <MapPin className="size-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                <span>
                                    {order.customer.address}, {order.customer.city} ({order.customer.ward})
                                </span>
                            </div>
                        </div>

                        {/* Payment & Logistics */}
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Payment & Rider
                            </span>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Method:</span>
                                <span className="font-bold text-zinc-800">{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Payment Status:</span>
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

                            {order.riderAssigned ? (
                                <div className="pt-2 border-t border-zinc-200 text-xs text-zinc-700">
                                    <p className="font-semibold text-emerald-800 flex items-center gap-1">
                                        <Bike className="size-3.5" /> Rider: {order.riderAssigned.name}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">{order.riderAssigned.phone} • {order.riderAssigned.vehicle}</p>
                                </div>
                            ) : (
                                <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500 flex items-center gap-1">
                                    <Bike className="size-3.5 text-zinc-400" />
                                    <span>Courier rider dispatched once bag is Ready</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                            Ordered Grocery Items ({order.items.length})
                        </span>
                        <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                                        />
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Rs. {item.price} × {item.quantity} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-zinc-900">
                                            Rs. {item.total.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bill Breakdown */}
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5 text-xs text-zinc-600">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-zinc-800">Rs. {order.subtotal.toLocaleString()}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-semibold">
                                    <span>Store Discount:</span>
                                    <span>- Rs. {order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Logistics / Delivery Fee:</span>
                                <span className="font-semibold text-zinc-800">
                                    {order.deliveryFee === 0 ? "FREE" : `Rs. ${order.deliveryFee}`}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-bold text-zinc-900">
                                <span>Total Order Value:</span>
                                <span className="text-app-green text-base">Rs. {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Notes */}
                    {order.notes && (
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                            <span className="font-bold">Customer Packaging Instructions:</span>
                            <p>{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* ── Modal Footer: Lifecycle Actions ─────────────────────────── */}
                <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-200/60 transition-colors"
                    >
                        Close
                    </button>

                    <div className="flex items-center gap-2">
                        {order.status === "Pending" && (
                            <>
                                <button
                                    onClick={() => {
                                        onStatusChange(order.id, "Cancelled", "Vendor rejected order");
                                        onClose();
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                    Reject Order
                                </button>
                                <button
                                    onClick={() => {
                                        onStatusChange(order.id, "Accepted", "Vendor accepted incoming order");
                                        onClose();
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                                >
                                    Accept Order
                                </button>
                            </>
                        )}

                        {order.status === "Accepted" && (
                            <button
                                onClick={() => {
                                    onStatusChange(order.id, "Preparing", "Packing goods in grocery bags");
                                    onClose();
                                }}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <span>Start Preparing</span>
                                <ArrowRight className="size-4" />
                            </button>
                        )}

                        {order.status === "Preparing" && (
                            <button
                                onClick={() => {
                                    onStatusChange(order.id, "Ready", "Bag sealed and ready at pickup counter");
                                    onClose();
                                }}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <PackageCheck className="size-4" />
                                <span>Mark Ready for Pickup</span>
                            </button>
                        )}

                        {order.status === "Ready" && (
                            <button
                                onClick={() => {
                                    onStatusChange(order.id, "Completed", "Rider delivered package to customer");
                                    onClose();
                                }}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all flex items-center gap-1.5"
                            >
                                <CheckCircle2 className="size-4" />
                                <span>Mark Delivered / Completed</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
