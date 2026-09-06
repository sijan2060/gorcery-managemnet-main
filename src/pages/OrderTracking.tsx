import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    MapPin,
    Phone,
    ShieldCheck,
    ArrowLeft,
    ChevronRight,
    ShoppingBag,
    Share2,
    Bike,
} from "lucide-react";
import toast from "react-hot-toast";

const TRACKING_STEPS = [
    { key: "Placed", title: "Order Placed", time: "Just now", desc: "Order verified & sent to store", completed: true },
    { key: "Confirmed", title: "Order Confirmed", time: "2 mins ago", desc: "Store accepted your grocery list", completed: true },
    { key: "Packed", title: "Freshly Packed", time: "5 mins ago", desc: "Items inspected & bagged", completed: true },
    { key: "Out for Delivery", title: "Out for Delivery", time: "On the way 🛵", desc: "Rider is heading to your address", completed: true, active: true },
    { key: "Delivered", title: "Delivered", time: "Estimated in 25m", desc: "Delivered to your doorstep", completed: false },
];

const OrderTracking = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "Rs.";

    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("pasalmandu_orders");
            const orders = raw ? JSON.parse(raw) : [];
            if (Array.isArray(orders) && orders.length > 0) {
                const found = id ? orders.find((o: any) => o._id === id || o.orderNumber === id) : orders[0];
                setOrder(found || orders[0]);
                return;
            }
        } catch {
            // fallback
        }

        // Fallback default sample order for viewing
        setOrder({
            _id: id || "PSM-2026-981245",
            createdAt: "Today, 11:45 AM",
            paymentMethodName: "Cash on Delivery",
            deliverySlot: "Instant Express (30–45 Mins)",
            total: 580,
            subtotal: 530,
            deliveryFee: 50,
            discount: 0,
            isPaid: false,
            deliveryOtp: "748921",
            shippingAddress: {
                fullName: "Aayush Shrestha",
                phone: "9841234567",
                address: "House #42, Madan Bhandari Path, New Baneshwor",
                city: "Kathmandu",
                instructions: "Ring doorbell twice, leave with security if unavailable.",
            },
            deliveryPartner: {
                name: "Bikash Tamang",
                phone: "9841882200",
                vehicleType: "Electric Scooter (Ba 89 Pa 4412)",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
            },
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
                {
                    name: "Butter Croissant 100g",
                    price: 45,
                    quantity: 1,
                    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
                },
            ],
        });
    }, [id]);

    if (!order) {
        return (
            <div className="min-h-screen bg-app-cream flex-center">
                <div className="text-center p-8">
                    <p className="text-zinc-600">Loading your delivery details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-cream pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-app-green transition-colors"
                    >
                        <ArrowLeft className="size-4" /> Back
                    </button>
                    <ChevronRight className="size-3 text-zinc-400" />
                    <Link to="/orders" className="hover:text-app-green transition-colors">
                        Orders
                    </Link>
                    <ChevronRight className="size-3 text-zinc-400" />
                    <span className="text-zinc-700 font-medium">Tracking #{order._id}</span>
                </div>

                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Live Tracking
                            </span>
                            <span className="text-xs text-zinc-500">{order.createdAt}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 mt-1">
                            Order #{order._id}
                        </h1>
                    </div>

                    {/* Delivery OTP Badge */}
                    <div className="bg-white rounded-2xl border border-app-border p-3.5 shadow-xs flex items-center gap-3 self-start sm:self-auto">
                        <div className="size-10 rounded-xl bg-orange-50 text-app-orange flex-center shrink-0">
                            <ShieldCheck className="size-5" />
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                                Share OTP with Rider on Delivery
                            </span>
                            <span className="font-mono text-xl font-bold tracking-widest text-app-green">
                                {order.deliveryOtp || "754730"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Grid: Tracking Timeline & Partner Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Tracking Status & Route Map Visual (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Live Delivery Route Card */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 shadow-xs overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                        Rider is on the way
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-app-orange bg-orange-50 px-2.5 py-1 rounded-full">
                                    Estimated: 20–30 mins
                                </span>
                            </div>

                            {/* Simulated Interactive Kathmandu Valley Map Route Canvas */}
                            <div className="relative h-56 w-full rounded-2xl bg-zinc-900 overflow-hidden flex-center border border-zinc-800">
                                {/* Styled map grid illustration */}
                                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-900/40" />

                                {/* Road route line */}
                                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M 80,170 Q 200,60 380,110 T 540,70"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="4"
                                        strokeDasharray="6 6"
                                        className="animate-pulse"
                                    />
                                </svg>

                                {/* Store Node */}
                                <div className="absolute left-16 bottom-10 flex flex-col items-center">
                                    <div className="size-8 rounded-full bg-orange-500 text-white flex-center shadow-lg border-2 border-white">
                                        <ShoppingBag className="size-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white mt-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                                        Pasalmandu Hub
                                    </span>
                                </div>

                                {/* Active Rider Node with Pulsing Ring */}
                                <div className="absolute left-1/2 top-16 -translate-x-1/2 flex flex-col items-center animate-bounce">
                                    <div className="relative">
                                        <div className="size-10 rounded-full bg-emerald-500 text-white flex-center shadow-xl border-2 border-white">
                                            <Bike className="size-5" />
                                        </div>
                                        <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-300 mt-1 bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                                        Rider Bikash
                                    </span>
                                </div>

                                {/* Customer Destination Node */}
                                <div className="absolute right-14 top-12 flex flex-col items-center">
                                    <div className="size-8 rounded-full bg-red-500 text-white flex-center shadow-lg border-2 border-white">
                                        <MapPin className="size-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white mt-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                                        Your Doorstep
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Stepper */}
                            <div className="mt-8 space-y-6">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Order Progress Timeline
                                </h3>
                                <div className="space-y-4">
                                    {TRACKING_STEPS.map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`size-7 rounded-full flex-center text-xs font-bold ${
                                                        step.active
                                                            ? "bg-app-orange text-white ring-4 ring-orange-100"
                                                            : step.completed
                                                            ? "bg-emerald-600 text-white"
                                                            : "bg-zinc-200 text-zinc-400"
                                                    }`}
                                                >
                                                    {step.completed ? <CheckCircle2 className="size-4" /> : idx + 1}
                                                </div>
                                                {idx < TRACKING_STEPS.length - 1 && (
                                                    <div
                                                        className={`w-0.5 h-10 my-1 ${
                                                            step.completed ? "bg-emerald-600" : "bg-zinc-200"
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center justify-between">
                                                    <h4
                                                        className={`text-sm font-bold ${
                                                            step.active
                                                                ? "text-app-orange"
                                                                : step.completed
                                                                ? "text-zinc-900"
                                                                : "text-zinc-400"
                                                        }`}
                                                    >
                                                        {step.title}
                                                    </h4>
                                                    <span className="text-xs font-medium text-zinc-500">
                                                        {step.time}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Rider & Order Summary (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Delivery Rider Card */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                                Assigned Delivery Partner
                            </h3>
                            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
                                <div className="size-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex-center overflow-hidden">
                                    <img
                                        src={order.deliveryPartner?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                                        alt={order.deliveryPartner?.name || "Rider"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-base font-bold text-zinc-900">
                                            {order.deliveryPartner?.name || "Bikash Tamang"}
                                        </h4>
                                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                                            ⭐ 4.9 Rating
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {order.deliveryPartner?.vehicleType || "Electric Scooter (Ba 89 Pa 4412)"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <a
                                    href={`tel:${order.deliveryPartner?.phone || "9841882200"}`}
                                    className="flex-1 py-2.5 bg-app-green hover:bg-app-green-light text-white font-semibold rounded-xl text-xs flex-center gap-2 transition-colors shadow-2xs"
                                >
                                    <Phone className="size-3.5" /> Call Rider ({order.deliveryPartner?.phone || "9841882200"})
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Tracking link copied to clipboard!");
                                    }}
                                    className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors"
                                    title="Share tracking link"
                                >
                                    <Share2 className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Delivery Location Card */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 shadow-xs">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-app-orange" /> Delivery Address
                            </h3>
                            <p className="text-sm font-bold text-zinc-900">{order.shippingAddress?.fullName}</p>
                            <p className="text-xs text-zinc-600 mt-1">{order.shippingAddress?.address}</p>
                            <p className="text-xs text-zinc-500">{order.shippingAddress?.city}, Nepal</p>
                            <p className="text-xs text-zinc-500 mt-1">📞 {order.shippingAddress?.phone}</p>
                            {order.shippingAddress?.instructions && (
                                <p className="text-xs text-app-green bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 mt-2.5">
                                    "{order.shippingAddress?.instructions}"
                                </p>
                            )}
                        </div>

                        {/* Order Items & Cost Card */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 shadow-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Order Items ({order.items?.length || 0})
                                </h3>
                                <span className="text-xs font-semibold text-zinc-800">
                                    {order.paymentMethodName || "Cash on Delivery"}
                                </span>
                            </div>

                            <div className="py-3 divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="size-9 rounded-lg object-contain bg-zinc-50 border border-zinc-100 p-1"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                                                <p className="text-[11px] text-zinc-500">
                                                    Qty: {item.quantity} × {currency} {item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-zinc-900">
                                            {currency} {(item.price * item.quantity).toFixed(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-100 pt-3 flex items-center justify-between font-bold">
                                <span className="text-xs text-zinc-700">Total Amount</span>
                                <span className="text-base text-app-green">
                                    {currency} {(order.total || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
