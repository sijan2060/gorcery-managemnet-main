import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, Clock, MapPin, ShoppingBag } from "lucide-react";

interface OrderItemPreview {
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface StoredOrder {
    _id: string;
    orderNumber?: string;
    createdAt: string;
    paymentMethodName: string;
    status: string;
    deliverySlot: string;
    total: number;
    items: OrderItemPreview[];
    shippingAddress?: {
        address: string;
        city: string;
    };
}

const DEFAULT_SAMPLE_ORDERS: StoredOrder[] = [
    {
        _id: "PSM-2026-981245",
        createdAt: "Today, 11:45 AM",
        paymentMethodName: "Cash on Delivery",
        status: "Out for Delivery",
        deliverySlot: "Instant Express (30–45 Mins)",
        total: 580,
        items: [
            {
                name: "Organic Quinoa 500g",
                price: 420,
                quantity: 1,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cxrrgnf12xuhkr4dyhi2.png",
            },
            {
                name: "Brown Bread 400g",
                price: 35,
                quantity: 2,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vy1xa7zovcu22smzapzv.png",
            },
        ],
        shippingAddress: {
            address: "House #42, Madan Bhandari Path, New Baneshwor",
            city: "Kathmandu",
        },
    },
];

const MyOrders = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "Rs.";
    const [orders] = useState<StoredOrder[]>(() => {
        try {
            const raw = localStorage.getItem("pasalmandu_orders");
            const stored = raw ? JSON.parse(raw) : [];
            if (Array.isArray(stored) && stored.length > 0) {
                return stored;
            }
        } catch {
            // fallback
        }
        return DEFAULT_SAMPLE_ORDERS;
    });

    return (
        <div className="min-h-screen bg-app-cream pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 flex items-center gap-2.5">
                            <Package className="size-7 text-app-orange" /> My Orders
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">Track and manage your grocery deliveries.</p>
                    </div>

                    <Link
                        to="/products"
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-app-green hover:bg-app-green-light text-white rounded-xl transition-colors"
                    >
                        <ShoppingBag className="size-3.5" /> Order More
                    </Link>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-3xl border border-app-border p-5 sm:p-6 shadow-xs hover:shadow-sm transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="font-mono text-sm font-bold text-zinc-900">
                                            #{order._id}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-app-orange border border-orange-200/60">
                                            {order.status || "Confirmed"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                                        <Clock className="size-3 text-zinc-400" /> Placed on {order.createdAt}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-base font-bold text-app-green">
                                        {currency} {(order.total || 0).toFixed(1)}
                                    </span>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-app-green text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                                    >
                                        <Truck className="size-3.5" /> Track Live
                                    </Link>
                                </div>
                            </div>

                            {/* Item previews */}
                            <div className="py-4 flex flex-wrap items-center gap-4">
                                {order.items?.map((item: OrderItemPreview, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-xs bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-8 rounded object-contain"
                                            />
                                        )}
                                        <span className="font-medium text-zinc-800 line-clamp-1 max-w-[150px]">
                                            {item.name}
                                        </span>
                                        <span className="text-zinc-500 font-semibold">×{item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer details */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-50 gap-2">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="size-3 text-zinc-400" />
                                    <span>
                                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                    </span>
                                </div>
                                <div>
                                    Payment: <span className="font-semibold text-zinc-700">{order.paymentMethodName}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
