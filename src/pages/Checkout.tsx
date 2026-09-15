import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ShieldCheck,
    Truck,
    Clock,
    MapPin,
    CreditCard,
    Banknote,
    CheckCircle2,
    ArrowLeft,
    ChevronRight,
    Tag,
    Info,
    Check,
    Copy,
    Lock,
    ShoppingBag,
    Plus,
    Sparkles,
    Loader2,
    Package,
    Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { dummyProducts } from "../assets/assets";
import type { CartItem } from "../context/CartContext";

// ─── Payment Methods Type & Configuration ─────────────────────────────────────
type PaymentMethodType = "cod" | "esewa" | "khalti" | "card";

interface DeliveryAddressOption {
    id: string;
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    instructions?: string;
    isDefault?: boolean;
}

interface PlacedOrderItem {
    product: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    image: string;
}

interface PlacedOrder {
    _id: string;
    orderNumber: string;
    items: PlacedOrderItem[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        instructions?: string;
        label: string;
    };
    paymentMethod: string;
    paymentMethodName: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    deliverySlot: string;
    status: string;
    isPaid: boolean;
    deliveryOtp: string;
    deliveryPartner: {
        name: string;
        phone: string;
        vehicleType: string;
        avatar: string;
    };
    createdAt: string;
}

const DEFAULT_ADDRESSES: DeliveryAddressOption[] = [
    {
        id: "addr-1",
        label: "Home",
        fullName: "Aayush Shrestha",
        phone: "9841234567",
        street: "House #42, Madan Bhandari Path, New Baneshwor",
        city: "Kathmandu",
        instructions: "Ring doorbell twice, leave with security if unavailable.",
        isDefault: true,
    },
    {
        id: "addr-2",
        label: "Office",
        fullName: "Aayush Shrestha",
        phone: "9801987654",
        street: "Tech Tower 3rd Floor, Thamel Marg",
        city: "Kathmandu",
        instructions: "Reception desk delivery during working hours.",
        isDefault: false,
    },
];

const DELIVERY_TIME_SLOTS = [
    {
        id: "express",
        title: "Instant Express",
        time: "30 – 45 Minutes",
        badge: "Fastest ⚡",
        fee: 0,
    },
    {
        id: "today_evening",
        title: "Today Evening",
        time: "5:00 PM – 8:00 PM",
        badge: "Scheduled",
        fee: 0,
    },
    {
        id: "tomorrow_morning",
        title: "Tomorrow Morning",
        time: "8:00 AM – 11:00 AM",
        badge: "Fresh Batch 🌿",
        fee: 0,
    },
];

const PROMO_CODES: Record<string, { discountPercent?: number; discountFlat?: number; description: string }> = {
    PASAL10: { discountPercent: 10, description: "10% off entire order" },
    WELCOME50: { discountFlat: 50, description: "Rs. 50 flat discount on groceries" },
    FREESHIP: { discountFlat: 50, description: "Free standard shipping" },
};

// ─── Payment Logos (Authentic SVGs) ───────────────────────────────────────────
const EsewaLogo = () => (
    <svg viewBox="0 0 120 40" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="8" fill="#60BB46" />
        <circle cx="24" cy="20" r="13" fill="white" />
        <path
            d="M27.5 17.5C27 15.5 25.2 14.2 23 14.2C20 14.2 18 16.5 18 20C18 23.5 20.2 25.8 23.4 25.8C25.8 25.8 27.2 24.5 27.8 22.8H23.2V20.8H30.5C30.6 21.2 30.7 21.8 30.7 22.5C30.7 26.8 27.5 28.5 23.2 28.5C18.2 28.5 15 24.8 15 20C15 15.2 18.5 11.5 23.5 11.5C27.2 11.5 29.8 13.8 30.5 17.5H27.5Z"
            fill="#60BB46"
        />
        <text x="44" y="26" fill="white" fontFamily="sans-serif" fontSize="18" fontWeight="bold" letterSpacing="-0.5">
            eSewa
        </text>
    </svg>
);

const KhaltiLogo = () => (
    <svg viewBox="0 0 120 40" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="8" fill="#5C2D91" />
        <circle cx="24" cy="20" r="12" fill="#F3A712" />
        <path d="M19 14L25 20L19 26M25 14V26" stroke="#5C2D91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="44" y="26" fill="white" fontFamily="sans-serif" fontSize="17" fontWeight="bold" letterSpacing="-0.3">
            khalti
        </text>
    </svg>
);

const VisaMastercardBadges = () => (
    <div className="flex items-center gap-1.5">
        <div className="h-6 px-2 bg-blue-900 rounded flex items-center justify-center font-black text-[11px] tracking-wider text-white italic">
            VISA
        </div>
        <div className="h-6 px-1.5 bg-zinc-900 rounded flex items-center justify-center">
            <div className="flex -space-x-1.5 items-center">
                <div className="size-3.5 rounded-full bg-red-500 opacity-90"></div>
                <div className="size-3.5 rounded-full bg-amber-400 opacity-90"></div>
            </div>
        </div>
        <div className="h-6 px-1.5 bg-emerald-800 text-white rounded flex items-center justify-center font-bold text-[9px]">
            SCT
        </div>
    </div>
);

// ─── Main Checkout Page Component ─────────────────────────────────────────────
const Checkout = () => {
    const { items: cartItems, cartTotal, clearCart } = useCart();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "Rs.";

    // Fallback sample items if cart is empty so page can be tested directly
    const fallbackItems = useMemo<CartItem[]>(
        () => [
            { product: dummyProducts[0], quantity: 2 },
            { product: dummyProducts[1], quantity: 1 },
        ],
        []
    );

    const activeItems = cartItems.length > 0 ? cartItems : fallbackItems;
    const itemsTotal = cartItems.length > 0
        ? cartTotal
        : activeItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

    // Delivery Fee logic
    const BASE_DELIVERY_FEE = 50;
    const FREE_SHIPPING_THRESHOLD = 500;

    // State: Delivery Addresses
    const [addresses, setAddresses] = useState<DeliveryAddressOption[]>(DEFAULT_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(DEFAULT_ADDRESSES[0].id);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: "Home",
        fullName: "",
        phone: "",
        street: "",
        city: "Kathmandu",
        instructions: "",
    });

    // State: Delivery Slot
    const [selectedSlot, setSelectedSlot] = useState<string>("express");

    // State: Payment Method
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("cod");

    // State: COD details
    const [codChangeOption, setCodChangeOption] = useState<string>("exact");

    // State: eSewa details
    const [esewaTab, setEsewaTab] = useState<"id" | "qr">("id");
    const [esewaId, setEsewaId] = useState<string>("9841000000");
    const [esewaMpin, setEsewaMpin] = useState<string>("1234");

    // State: Khalti details
    const [khaltiTab, setKhaltiTab] = useState<"id" | "qr">("id");
    const [khaltiPhone, setKhaltiPhone] = useState<string>("9801000000");
    const [khaltiMpin, setKhaltiMpin] = useState<string>("1234");

    // State: Card details
    const [cardNumber, setCardNumber] = useState<string>("4242 •••• •••• 4242");
    const [cardHolder, setCardHolder] = useState<string>("AAYUSH SHRESTHA");
    const [cardExpiry, setCardExpiry] = useState<string>("08/28");
    const [cardCvv, setCardCvv] = useState<string>("•••");
    const [saveCard, setSaveCard] = useState<boolean>(true);

    // State: Promo Code
    const [promoInput, setPromoInput] = useState<string>("");
    const [appliedPromo, setAppliedPromo] = useState<{
        code: string;
        discountAmount: number;
        description: string;
    } | null>(null);

    // State: Order note
    const [orderNotes, setOrderNotes] = useState<string>("");

    // State: Processing & Order Confirmation
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [processingStep, setProcessingStep] = useState<string>("");
    const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

    // ── Calculations ──
    const deliveryFee =
        appliedPromo?.code === "FREESHIP" || itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
    const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
    const grandTotal = Math.max(0, itemsTotal + deliveryFee - discountAmount);

    // Handle Promo code apply
    const handleApplyPromo = (codeToApply?: string) => {
        const code = (codeToApply || promoInput).trim().toUpperCase();
        if (!code) return;

        if (PROMO_CODES[code]) {
            const promo = PROMO_CODES[code];
            let discount = 0;
            if (promo.discountPercent) {
                discount = Math.round((itemsTotal * promo.discountPercent) / 100);
            } else if (promo.discountFlat) {
                discount = Math.min(itemsTotal, promo.discountFlat);
            }

            setAppliedPromo({
                code,
                discountAmount: discount,
                description: promo.description,
            });
            setPromoInput("");
            toast.success(`Coupon "${code}" applied successfully! Saved ${currency} ${discount}`, {
                icon: "🎉",
            });
        } else {
            toast.error("Invalid coupon code. Try PASAL10 or WELCOME50");
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        toast("Coupon removed", { icon: "ℹ️" });
    };

    // Handle Adding New Address
    const handleSaveNewAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.fullName || !newAddress.phone || !newAddress.street) {
            toast.error("Please fill in recipient name, phone, and street address.");
            return;
        }

        const id = `addr-${Date.now()}`;
        const created: DeliveryAddressOption = {
            id,
            label: newAddress.label,
            fullName: newAddress.fullName,
            phone: newAddress.phone,
            street: newAddress.street,
            city: newAddress.city,
            instructions: newAddress.instructions,
        };

        setAddresses((prev) => [...prev, created]);
        setSelectedAddressId(id);
        setIsAddingAddress(false);
        setNewAddress({
            label: "Home",
            fullName: "",
            phone: "",
            street: "",
            city: "Kathmandu",
            instructions: "",
        });
        toast.success("New delivery address added!");
    };

    // Format card number with auto spaces
    const handleCardNumberChange = (val: string) => {
        const raw = val.replace(/\D/g, "").slice(0, 16);
        const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
        setCardNumber(formatted);
    };

    // Format MM/YY
    const handleExpiryChange = (val: string) => {
        const clean = val.replace(/\D/g, "").slice(0, 4);
        if (clean.length >= 3) {
            setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
        } else {
            setCardExpiry(clean);
        }
    };

    // Detect card brand
    const getCardBrand = (num: string) => {
        const clean = num.replace(/\s/g, "");
        if (clean.startsWith("4")) return "visa";
        if (/^5[1-5]/.test(clean)) return "mastercard";
        return "generic";
    };

    // Selected Address Object
    const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    // Handle Order Confirmation
    const handleConfirmOrder = () => {
        if (!activeAddress) {
            toast.error("Please select or add a delivery address.");
            return;
        }

        // Validate specific payment fields
        if (paymentMethod === "esewa" && esewaTab === "id") {
            if (!esewaId || esewaId.length < 10) {
                toast.error("Please enter a valid 10-digit eSewa mobile number (98XXXXXXXX).");
                return;
            }
        } else if (paymentMethod === "khalti" && khaltiTab === "id") {
            if (!khaltiPhone || khaltiPhone.length < 10) {
                toast.error("Please enter a valid 10-digit Khalti mobile number.");
                return;
            }
        } else if (paymentMethod === "card") {
            const cleanDigits = cardNumber.replace(/\D/g, "");
            if (cleanDigits.length < 16) {
                toast.error("Please enter a complete 16-digit card number.");
                return;
            }
            if (cardExpiry.length < 5) {
                toast.error("Please enter a valid card expiry date (MM/YY).");
                return;
            }
            if (cardCvv.replace(/\D/g, "").length < 3) {
                toast.error("Please enter a 3 or 4-digit CVV security code.");
                return;
            }
        }

        setIsSubmitting(true);
        setProcessingStep("Verifying delivery slot & inventory...");

        setTimeout(() => {
            const stepMessage =
                paymentMethod === "cod"
                    ? "Confirming Cash on Delivery booking with rider network..."
                    : paymentMethod === "esewa"
                    ? "Connecting to eSewa payment gateway..."
                    : paymentMethod === "khalti"
                    ? "Securing Khalti digital wallet authorization..."
                    : "Authorizing 256-bit encrypted card payment...";
            setProcessingStep(stepMessage);
        }, 800);

        setTimeout(() => {
            setProcessingStep("Finalizing your Pasalmandu grocery order...");
        }, 1800);

        setTimeout(() => {
            const orderId = `PSM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            const orderDate = new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
            });
            const deliveryOtp = `${Math.floor(100000 + Math.random() * 900000)}`;

            const newOrder = {
                _id: orderId,
                orderNumber: orderId,
                items: activeItems.map((it) => ({
                    product: it.product._id,
                    name: it.product.name,
                    price: it.product.price,
                    unit: it.product.unit,
                    quantity: it.quantity,
                    image: it.product.image,
                })),
                shippingAddress: {
                    fullName: activeAddress.fullName,
                    phone: activeAddress.phone,
                    address: activeAddress.street,
                    city: activeAddress.city,
                    instructions: activeAddress.instructions || orderNotes,
                    label: activeAddress.label,
                },
                paymentMethod,
                paymentMethodName:
                    paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : paymentMethod === "esewa"
                        ? "eSewa Mobile Wallet"
                        : paymentMethod === "khalti"
                        ? "Khalti Digital Wallet"
                        : `Debit/Credit Card (•••• ${cardNumber.replace(/\D/g, "").slice(-4) || "4242"})`,
                subtotal: itemsTotal,
                deliveryFee,
                discount: discountAmount,
                total: grandTotal,
                deliverySlot: DELIVERY_TIME_SLOTS.find((s) => s.id === selectedSlot)?.title || "Instant Express",
                status: "Confirmed",
                isPaid: paymentMethod !== "cod",
                deliveryOtp,
                deliveryPartner: {
                    name: "Bikash Tamang",
                    phone: "9841882200",
                    vehicleType: "Electric Scooter (Ba 89 Pa 4412)",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                },
                createdAt: orderDate,
            };

            // Save to localStorage
            try {
                const existingOrders = JSON.parse(localStorage.getItem("pasalmandu_orders") || "[]");
                localStorage.setItem("pasalmandu_orders", JSON.stringify([newOrder, ...existingOrders]));
            } catch (err) {
                console.error("Failed to persist order", err);
            }

            // Clear Cart Context
            clearCart();

            setIsSubmitting(false);
            setPlacedOrder(newOrder);
            toast.success("Order Placed Successfully!", { duration: 4000 });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 2600);
    };

    // ── Render Order Placed Success Confirmation State ────────────────────────
    if (placedOrder) {
        return (
            <div className="min-h-screen bg-app-cream py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                    {/* Success Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-app-border overflow-hidden">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-app-green via-app-green-light to-emerald-900 text-white p-6 sm:p-10 text-center relative">
                            <div className="size-20 bg-emerald-500/20 ring-8 ring-emerald-500/30 rounded-full flex-center mx-auto mb-4 animate-pulse-soft">
                                <div className="size-12 bg-emerald-500 rounded-full flex-center text-white shadow-lg">
                                    <Check className="size-7 stroke-[3]" />
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2">
                                <Sparkles className="size-3.5" /> Order Confirmed
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                                Thank You for Your Order!
                            </h1>
                            <p className="text-emerald-100/80 text-sm max-w-md mx-auto">
                                We’ve received your order and our team at Pasalmandu is carefully picking the freshest items for you.
                            </p>

                            {/* Order Ref & OTP Pills */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
                                    <span className="text-emerald-200 text-xs">Order ID:</span>
                                    <span className="font-mono font-bold tracking-wide">{placedOrder._id}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(placedOrder._id);
                                            toast.success("Order ID copied!");
                                        }}
                                        className="text-white/70 hover:text-white transition-colors"
                                        title="Copy Order ID"
                                    >
                                        <Copy className="size-3.5" />
                                    </button>
                                </div>

                                <div className="bg-emerald-400/20 backdrop-blur-sm border border-emerald-300/30 rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
                                    <span className="text-emerald-200 text-xs">Delivery OTP:</span>
                                    <span className="font-mono font-bold tracking-widest text-emerald-300">
                                        {placedOrder.deliveryOtp}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Snapshot & Details */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Live Delivery Status Bar */}
                            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-xl bg-emerald-600 text-white flex-center shrink-0">
                                        <Truck className="size-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                                Estimated Delivery
                                            </span>
                                            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                                        </div>
                                        <p className="text-base font-bold text-zinc-900">
                                            Within 35 – 45 Minutes (Today)
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-100">
                                    <span className="text-xs text-zinc-500 block">Assigned Rider</span>
                                    <span className="text-sm font-semibold text-zinc-900">
                                        {placedOrder.deliveryPartner.name} • 📞 {placedOrder.deliveryPartner.phone}
                                    </span>
                                </div>
                            </div>

                            {/* Two-column summary details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Delivery Address Card */}
                                <div className="bg-zinc-50/80 rounded-2xl p-4 border border-app-border">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                        <MapPin className="size-4 text-app-orange" /> Delivery Location
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900">{placedOrder.shippingAddress.fullName}</p>
                                    <p className="text-xs text-zinc-600 mt-1">{placedOrder.shippingAddress.address}</p>
                                    <p className="text-xs text-zinc-600">{placedOrder.shippingAddress.city}, Nepal</p>
                                    <p className="text-xs text-zinc-500 mt-1">Phone: {placedOrder.shippingAddress.phone}</p>
                                    {placedOrder.shippingAddress.instructions && (
                                        <p className="text-xs text-app-green font-medium mt-2 bg-white p-2 rounded-lg border border-zinc-200">
                                            Note: "{placedOrder.shippingAddress.instructions}"
                                        </p>
                                    )}
                                </div>

                                {/* Payment Details Card */}
                                <div className="bg-zinc-50/80 rounded-2xl p-4 border border-app-border">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                        <CreditCard className="size-4 text-app-green" /> Payment Breakdown
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-600">Method</span>
                                        <span className="font-semibold text-zinc-900">{placedOrder.paymentMethodName}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-zinc-600">Status</span>
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                                placedOrder.isPaid
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-amber-100 text-amber-800"
                                            }`}
                                        >
                                            {placedOrder.isPaid ? "Paid & Verified" : "Pay upon Arrival"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-zinc-600">Delivery Slot</span>
                                        <span className="font-medium text-zinc-800">{placedOrder.deliverySlot}</span>
                                    </div>
                                    <div className="border-t border-zinc-200 mt-3 pt-2 flex items-center justify-between font-bold">
                                        <span className="text-zinc-900">Total Amount</span>
                                        <span className="text-base text-app-green">
                                            {currency} {placedOrder.total.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered Items List */}
                            <div className="border border-app-border rounded-2xl p-4">
                                <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Package className="size-4 text-app-orange" /> Items Purchased ({placedOrder.items.length})
                                    </span>
                                    <span className="text-xs text-zinc-500 font-normal">
                                        Freshness Inspected & Packed
                                    </span>
                                </h3>
                                <div className="divide-y divide-zinc-100 max-h-56 overflow-y-auto pr-1">
                                    {placedOrder.items.map((item: PlacedOrderItem, idx: number) => (
                                        <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="size-11 rounded-lg object-contain bg-zinc-50 border border-zinc-100 p-1"
                                                />
                                                <div>
                                                    <p className="font-medium text-zinc-900 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        Qty: {item.quantity} × {currency} {item.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-zinc-800">
                                                {currency} {(item.price * item.quantity).toFixed(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Actions */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                                <Link
                                    to={`/orders/${placedOrder._id}`}
                                    className="w-full sm:flex-1 py-3.5 bg-app-green hover:bg-app-green-light text-white font-semibold rounded-2xl flex-center gap-2 text-sm shadow-xs transition-colors"
                                >
                                    <Truck className="size-4" /> Track Live Delivery
                                </Link>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full sm:w-auto px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-2xl flex-center gap-2 text-sm transition-colors"
                                >
                                    <Printer className="size-4" /> Print Receipt
                                </button>

                                <Link
                                    to="/products"
                                    className="w-full sm:w-auto px-6 py-3.5 border border-app-border hover:border-zinc-400 text-zinc-700 font-semibold rounded-2xl flex-center gap-2 text-sm transition-colors"
                                >
                                    <ShoppingBag className="size-4" /> Shop More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main Payment & Checkout Layout ────────────────────────────────────────
    return (
        <div className="min-h-screen bg-app-cream pb-24">
            {/* Progress Stepper Bar */}
            <div className="bg-white border-b border-app-border sticky top-16 z-30 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                            <Link to="/cart" className="hover:text-app-green flex items-center gap-1 transition-colors">
                                <ArrowLeft className="size-3.5" /> Back to Cart
                            </Link>
                            <ChevronRight className="size-3 text-zinc-400" />
                            <span className="font-semibold text-zinc-900">Payment & Delivery</span>
                        </div>

                        {/* Stepper Progress */}
                        <div className="hidden sm:flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-zinc-400">
                                <CheckCircle2 className="size-4 text-emerald-600" /> Cart Review
                            </span>
                            <ChevronRight className="size-3 text-zinc-300" />
                            <span className="flex items-center gap-1.5 text-app-green font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                                <CreditCard className="size-4 text-app-green" /> Payment & Address
                            </span>
                            <ChevronRight className="size-3 text-zinc-300" />
                            <span className="flex items-center gap-1.5 text-zinc-400">
                                <Check className="size-3.5 text-zinc-300" /> Order Placed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title & Trust Notice */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 flex items-center gap-3">
                            <CreditCard className="size-8 text-app-orange" />
                            Payment & Delivery Details
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Complete your delivery address and choose your preferred payment method to finalize your order.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 rounded-full self-start md:self-auto">
                        <ShieldCheck className="size-4 text-emerald-600" /> 100% Secure 256-Bit SSL Encrypted Checkout
                    </div>
                </div>

                {/* Main Grid: Left Details & Right Order Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ── Left Column: Address & Payment Methods (7 cols) ── */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        {/* ─────────────────────────────────────────────────────────────
                            SECTION 1: DELIVERY ADDRESS
                        ────────────────────────────────────────────────────────────── */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 sm:p-7 shadow-xs">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-2xl bg-orange-50 text-app-orange flex-center">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900">1. Delivery Address</h2>
                                        <p className="text-xs text-zinc-500">Where should we deliver your groceries?</p>
                                    </div>
                                </div>

                                {!isAddingAddress && (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="text-xs font-semibold text-app-green hover:text-app-orange flex items-center gap-1 py-1.5 px-3 rounded-xl hover:bg-emerald-50 transition-colors"
                                    >
                                        <Plus className="size-3.5" /> Add New Address
                                    </button>
                                )}
                            </div>

                            {/* Saved Address Cards */}
                            {!isAddingAddress ? (
                                <div className="space-y-3">
                                    {addresses.map((addr) => {
                                        const isSelected = addr.id === selectedAddressId;
                                        return (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex items-start gap-4 ${
                                                    isSelected
                                                        ? "border-app-green bg-emerald-50/40 ring-1 ring-app-green shadow-xs"
                                                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                                                }`}
                                            >
                                                {/* Radio indicator */}
                                                <div className="pt-0.5">
                                                    <div
                                                        className={`size-5 rounded-full flex-center border transition-all ${
                                                            isSelected
                                                                ? "border-app-green bg-app-green text-white"
                                                                : "border-zinc-300 bg-white"
                                                        }`}
                                                    >
                                                        {isSelected && <div className="size-2 rounded-full bg-white" />}
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                                                            {addr.label}
                                                        </span>
                                                        <span className="text-sm font-bold text-zinc-900">
                                                            {addr.fullName}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">📞 {addr.phone}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-600 mt-1">{addr.street}</p>
                                                    <p className="text-xs text-zinc-500">{addr.city}, Nepal</p>
                                                    {addr.instructions && (
                                                        <p className="text-[11px] text-zinc-500 mt-1 italic">
                                                            Note: {addr.instructions}
                                                        </p>
                                                    )}
                                                </div>

                                                {isSelected && (
                                                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full shrink-0">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Add New Address Inline Form */
                                <form
                                    onSubmit={handleSaveNewAddress}
                                    className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-4 animate-fade-in"
                                >
                                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                                        <h3 className="text-sm font-bold text-zinc-900">Add New Delivery Location</h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="text-xs text-zinc-500 hover:text-zinc-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                Address Label
                                            </label>
                                            <div className="flex gap-2">
                                                {["Home", "Office", "Other"].map((lbl) => (
                                                    <button
                                                        type="button"
                                                        key={lbl}
                                                        onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                                            newAddress.label === lbl
                                                                ? "bg-app-green text-white border-app-green"
                                                                : "bg-white text-zinc-700 border-zinc-300"
                                                        }`}
                                                    >
                                                        {lbl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                Recipient Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Suman Shakya"
                                                value={newAddress.fullName}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, fullName: e.target.value })
                                                }
                                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                Nepali Mobile Number (10 digits) *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="98XXXXXXXX"
                                                value={newAddress.phone}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, phone: e.target.value })
                                                }
                                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                City / Area *
                                            </label>
                                            <select
                                                value={newAddress.city}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, city: e.target.value })
                                                }
                                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                            >
                                                <option value="Kathmandu">Kathmandu</option>
                                                <option value="Lalitpur">Lalitpur</option>
                                                <option value="Bhaktapur">Bhaktapur</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                            Street Address, House/Apt #, Landmark *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. House 15, Maitighar Height, Near St. Xavier's"
                                            value={newAddress.street}
                                            onChange={(e) =>
                                                setNewAddress({ ...newAddress, street: e.target.value })
                                            }
                                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                            Delivery Rider Instructions (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Leave with guard / Red gate / Call on arrival"
                                            value={newAddress.instructions}
                                            onChange={(e) =>
                                                setNewAddress({ ...newAddress, instructions: e.target.value })
                                            }
                                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingAddress(false)}
                                            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-xs font-semibold bg-app-green text-white rounded-xl hover:bg-app-green-light"
                                        >
                                            Save & Use Address
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delivery Speed / Slot Selector */}
                            <div className="mt-6 pt-6 border-t border-zinc-100">
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Clock className="size-3.5 text-app-orange" /> Choose Delivery Slot
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {DELIVERY_TIME_SLOTS.map((slot) => {
                                        const isSelected = selectedSlot === slot.id;
                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot.id)}
                                                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? "border-app-green bg-emerald-50/50 ring-1 ring-app-green"
                                                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-zinc-900">{slot.title}</span>
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                                        {slot.badge}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500">{slot.time}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            SECTION 2: PAYMENT METHOD SELECTION & DETAILS
                        ────────────────────────────────────────────────────────────── */}
                        <div className="bg-white rounded-3xl border border-app-border p-6 sm:p-7 shadow-xs">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-2xl bg-emerald-50 text-app-green flex-center">
                                    <CreditCard className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900">2. Payment Method</h2>
                                    <p className="text-xs text-zinc-500">
                                        Select your preferred payment method for this order.
                                    </p>
                                </div>
                            </div>

                            {/* 4 Payment Methods Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                                {/* Option 1: Cash on Delivery */}
                                <div
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                        paymentMethod === "cod"
                                            ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600 shadow-xs"
                                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 flex-center mb-2">
                                            <Banknote className="size-6" />
                                        </div>
                                        <div
                                            className={`size-5 rounded-full flex-center border ${
                                                paymentMethod === "cod"
                                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                                    : "border-zinc-300"
                                            }`}
                                        >
                                            {paymentMethod === "cod" && <div className="size-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-zinc-900">Cash on Delivery</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Pay in cash or scan QR at doorstep</p>
                                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                        Zero Extra Fee
                                    </span>
                                </div>

                                {/* Option 2: eSewa */}
                                <div
                                    onClick={() => setPaymentMethod("esewa")}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                        paymentMethod === "esewa"
                                            ? "border-[#60BB46] bg-green-50/50 ring-2 ring-[#60BB46] shadow-xs"
                                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <EsewaLogo />
                                        <div
                                            className={`size-5 rounded-full flex-center border ${
                                                paymentMethod === "esewa"
                                                    ? "border-[#60BB46] bg-[#60BB46] text-white"
                                                    : "border-zinc-300"
                                            }`}
                                        >
                                            {paymentMethod === "esewa" && <div className="size-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-zinc-900 mt-2">eSewa Mobile Wallet</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Instant online payment or Fonepay QR</p>
                                    <span className="inline-block mt-2 text-[10px] font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-md">
                                        Instant Verification
                                    </span>
                                </div>

                                {/* Option 3: Khalti */}
                                <div
                                    onClick={() => setPaymentMethod("khalti")}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                        paymentMethod === "khalti"
                                            ? "border-[#5C2D91] bg-purple-50/50 ring-2 ring-[#5C2D91] shadow-xs"
                                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <KhaltiLogo />
                                        <div
                                            className={`size-5 rounded-full flex-center border ${
                                                paymentMethod === "khalti"
                                                    ? "border-[#5C2D91] bg-[#5C2D91] text-white"
                                                    : "border-zinc-300"
                                            }`}
                                        >
                                            {paymentMethod === "khalti" && <div className="size-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-zinc-900 mt-2">Khalti Digital Wallet</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Pay via Khalti balance or QR scan</p>
                                    <span className="inline-block mt-2 text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                                        Instant Cashback Available
                                    </span>
                                </div>

                                {/* Option 4: Debit / Credit Card */}
                                <div
                                    onClick={() => setPaymentMethod("card")}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                        paymentMethod === "card"
                                            ? "border-app-green bg-emerald-50/40 ring-2 ring-app-green shadow-xs"
                                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <VisaMastercardBadges />
                                        <div
                                            className={`size-5 rounded-full flex-center border ${
                                                paymentMethod === "card"
                                                    ? "border-app-green bg-app-green text-white"
                                                    : "border-zinc-300"
                                            }`}
                                        >
                                            {paymentMethod === "card" && <div className="size-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-zinc-900 mt-2">Debit / Credit Card</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Visa, Mastercard, SCT cards</p>
                                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                        All Banks Supported
                                    </span>
                                </div>
                            </div>

                            {/* ── Sub-Form Details for Selected Payment Method ── */}
                            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 animate-fade-in">
                                {/* 1. CASH ON DELIVERY SUB-DETAILS */}
                                {paymentMethod === "cod" && (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-zinc-200">
                                            <Info className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                                            <div className="text-xs text-zinc-600">
                                                <p className="font-semibold text-zinc-900">Doorstep Payment Guarantee</p>
                                                <p className="mt-0.5">
                                                    You only pay when your groceries arrive at your doorstep. Our rider
                                                    carries exact change and a digital Fonepay/eSewa QR code standee.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-700 mb-2">
                                                Will you need change from the rider?
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                                {[
                                                    { id: "exact", label: "I have exact change" },
                                                    { id: "1000", label: "Need change for Rs. 1,000" },
                                                    { id: "custom", label: "Need change for Rs. 2,000" },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setCodChangeOption(opt.id)}
                                                        className={`p-2.5 rounded-xl border text-center transition-all ${
                                                            codChangeOption === opt.id
                                                                ? "bg-emerald-800 text-white font-semibold border-emerald-800"
                                                                : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 2. ESEWA SUB-DETAILS */}
                                {paymentMethod === "esewa" && (
                                    <div className="space-y-4">
                                        {/* Toggle Tabs */}
                                        <div className="flex bg-white rounded-xl p-1 border border-zinc-200 max-w-xs">
                                            <button
                                                type="button"
                                                onClick={() => setEsewaTab("id")}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                    esewaTab === "id"
                                                        ? "bg-[#60BB46] text-white shadow-2xs"
                                                        : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            >
                                                eSewa ID / Phone
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEsewaTab("qr")}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                    esewaTab === "qr"
                                                        ? "bg-[#60BB46] text-white shadow-2xs"
                                                        : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            >
                                                Scan eSewa QR
                                            </button>
                                        </div>

                                        {esewaTab === "id" ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                        eSewa ID / Registered Mobile
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={esewaId}
                                                        onChange={(e) => setEsewaId(e.target.value)}
                                                        placeholder="98XXXXXXXX"
                                                        className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-[#60BB46]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                        eSewa MPIN / Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        maxLength={6}
                                                        value={esewaMpin}
                                                        onChange={(e) => setEsewaMpin(e.target.value)}
                                                        placeholder="••••"
                                                        className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-[#60BB46]"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            /* eSewa QR code view */
                                            <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-center flex flex-col items-center">
                                                <div className="p-3 bg-white rounded-xl border-2 border-dashed border-[#60BB46] mb-2">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=esewa://pay?merchant=pasalmandu&amt=${grandTotal}`}
                                                        alt="eSewa QR"
                                                        className="size-36 object-contain"
                                                    />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-900">
                                                    Scan with eSewa App to pay {currency} {grandTotal.toFixed(1)}
                                                </p>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                                    Merchant: Pasalmandu Grocery Pvt. Ltd.
                                                </p>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                                            <Lock className="size-3 text-zinc-400" /> Redirects to eSewa secure payment tunnel with instant token confirmation.
                                        </p>
                                    </div>
                                )}

                                {/* 3. KHALTI SUB-DETAILS */}
                                {paymentMethod === "khalti" && (
                                    <div className="space-y-4">
                                        {/* Toggle Tabs */}
                                        <div className="flex bg-white rounded-xl p-1 border border-zinc-200 max-w-xs">
                                            <button
                                                type="button"
                                                onClick={() => setKhaltiTab("id")}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                    khaltiTab === "id"
                                                        ? "bg-[#5C2D91] text-white shadow-2xs"
                                                        : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            >
                                                Khalti Mobile & MPIN
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setKhaltiTab("qr")}
                                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                    khaltiTab === "qr"
                                                        ? "bg-[#5C2D91] text-white shadow-2xs"
                                                        : "text-zinc-600 hover:text-zinc-900"
                                                }`}
                                            >
                                                Khalti QR Code
                                            </button>
                                        </div>

                                        {khaltiTab === "id" ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                        Khalti Registered Mobile
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={khaltiPhone}
                                                        onChange={(e) => setKhaltiPhone(e.target.value)}
                                                        placeholder="98XXXXXXXX"
                                                        className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-[#5C2D91]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                                        Khalti MPIN or OTP
                                                    </label>
                                                    <input
                                                        type="password"
                                                        maxLength={6}
                                                        value={khaltiMpin}
                                                        onChange={(e) => setKhaltiMpin(e.target.value)}
                                                        placeholder="••••"
                                                        className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-[#5C2D91]"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Khalti QR view */
                                            <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-center flex flex-col items-center">
                                                <div className="p-3 bg-white rounded-xl border-2 border-dashed border-[#5C2D91] mb-2">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=khalti://pay?merchant=pasalmandu&amt=${grandTotal}`}
                                                        alt="Khalti QR"
                                                        className="size-36 object-contain"
                                                    />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-900">
                                                    Scan with Khalti App to pay {currency} {grandTotal.toFixed(1)}
                                                </p>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                                    Merchant ID: PSM_KHLT_2026
                                                </p>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                                            <Lock className="size-3 text-zinc-400" /> Authorized partner with Nepal Rastra Bank digital payment guidelines.
                                        </p>
                                    </div>
                                )}

                                {/* 4. DEBIT/CREDIT CARD SUB-DETAILS */}
                                {paymentMethod === "card" && (
                                    <div className="space-y-5">
                                        {/* Realistic Virtual Card Preview */}
                                        <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl p-5 text-white shadow-lg overflow-hidden bg-gradient-to-tr from-slate-900 via-emerald-950 to-zinc-900 border border-white/10">
                                            {/* Background decorative circles */}
                                            <div className="absolute -right-8 -top-8 size-36 rounded-full bg-emerald-500/10 blur-xl" />
                                            <div className="absolute -left-8 -bottom-8 size-36 rounded-full bg-orange-500/10 blur-xl" />

                                            <div className="relative z-10 flex flex-col justify-between h-full">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-6 rounded-md bg-amber-400/80 flex items-center justify-center">
                                                            <div className="w-5 h-4 border border-amber-600/60 rounded-xs" />
                                                        </div>
                                                        <span className="text-[11px] font-mono tracking-widest text-emerald-200">
                                                            Pasalmandu Pay
                                                        </span>
                                                    </div>
                                                    <span className="font-bold italic text-sm tracking-wider">
                                                        {getCardBrand(cardNumber) === "visa"
                                                            ? "VISA"
                                                            : getCardBrand(cardNumber) === "mastercard"
                                                            ? "Mastercard"
                                                            : "CARD"}
                                                    </span>
                                                </div>

                                                <div className="font-mono text-base tracking-widest text-zinc-100 font-semibold my-1">
                                                    {cardNumber || "•••• •••• •••• ••••"}
                                                </div>

                                                <div className="flex items-center justify-between text-xs font-mono">
                                                    <div>
                                                        <span className="text-[9px] text-zinc-400 block">CARD HOLDER</span>
                                                        <span className="font-bold tracking-wider text-zinc-200 uppercase">
                                                            {cardHolder || "YOUR NAME"}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] text-zinc-400 block">EXPIRES</span>
                                                        <span className="font-bold text-zinc-200">
                                                            {cardExpiry || "MM/YY"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Input Fields */}
                                        <div className="space-y-3 text-xs">
                                            <div>
                                                <label className="block font-semibold text-zinc-700 mb-1">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardHolder}
                                                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                                    placeholder="AAYUSH SHRESTHA"
                                                    className="w-full px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-semibold text-zinc-700 mb-1">
                                                    Card Number (16 Digits)
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={19}
                                                    value={cardNumber}
                                                    onChange={(e) => handleCardNumberChange(e.target.value)}
                                                    placeholder="4242 4242 4242 4242"
                                                    className="w-full font-mono px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block font-semibold text-zinc-700 mb-1">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={5}
                                                        value={cardExpiry}
                                                        onChange={(e) => handleExpiryChange(e.target.value)}
                                                        placeholder="MM/YY"
                                                        className="w-full font-mono px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block font-semibold text-zinc-700 mb-1">
                                                        CVV / CVC
                                                    </label>
                                                    <input
                                                        type="password"
                                                        maxLength={4}
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        placeholder="123"
                                                        className="w-full font-mono px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:ring-1 focus:ring-app-green"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Card Checkbox */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="checkbox"
                                                    id="saveCard"
                                                    checked={saveCard}
                                                    onChange={(e) => setSaveCard(e.target.checked)}
                                                    className="rounded border-zinc-300 text-app-green focus:ring-app-green size-4"
                                                />
                                                <label htmlFor="saveCard" className="text-zinc-600 cursor-pointer select-none">
                                                    Save this card securely for 1-click faster checkout next time
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Instructions / Order Note */}
                            <div className="mt-6 pt-6 border-t border-zinc-100">
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Special Delivery Note / Landmark Instructions
                                </label>
                                <input
                                    type="text"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder="e.g. Near Big Mart lane, please call 5 mins prior to arriving"
                                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-app-green"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Sticky Order Summary & Pay CTA (5 cols) ── */}
                    <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-4">
                        <div className="bg-white rounded-3xl border border-app-border p-5 sm:p-6 shadow-xs">
                            <h2 className="text-base font-bold text-zinc-900 flex items-center justify-between pb-4 border-b border-zinc-100">
                                <span className="flex items-center gap-2">
                                    <Tag className="size-4 text-app-orange" /> Order Summary
                                </span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-app-orange border border-orange-200/60">
                                    {activeItems.reduce((acc, it) => acc + it.quantity, 0)} Items
                                </span>
                            </h2>

                            {/* Item mini list preview */}
                            <div className="py-4 divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-1">
                                {activeItems.map((item) => (
                                    <div key={item.product._id} className="py-2 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="size-10 rounded-lg object-contain bg-zinc-50 border border-zinc-100 p-1 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-zinc-900 truncate">{item.product.name}</p>
                                                <p className="text-[11px] text-zinc-500">
                                                    {item.quantity} × {currency} {item.product.price}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-zinc-900 shrink-0">
                                            {currency} {(item.product.price * item.quantity).toFixed(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Input */}
                            <div className="pt-2 pb-4 border-t border-zinc-100">
                                {!appliedPromo ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Promo Code"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                                className="flex-1 text-xs px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-200 focus:ring-1 focus:ring-app-green uppercase"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleApplyPromo()}
                                                className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>

                                        {/* Preset coupon badges */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            <span className="text-[11px] text-zinc-400 self-center">Try:</span>
                                            <button
                                                type="button"
                                                onClick={() => handleApplyPromo("PASAL10")}
                                                className="text-[10px] font-mono font-bold text-app-orange bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded border border-orange-200 transition-colors"
                                            >
                                                PASAL10 (10% OFF)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleApplyPromo("WELCOME50")}
                                                className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
                                            >
                                                WELCOME50 (Rs. 50 OFF)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-emerald-900">
                                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                            <div>
                                                <span className="font-bold font-mono">{appliedPromo.code}</span>
                                                <span className="text-[11px] text-emerald-700 block">
                                                    {appliedPromo.description}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemovePromo}
                                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2.5 text-xs border-t border-zinc-100 pt-4">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Items Subtotal</span>
                                    <span className="font-semibold text-zinc-900">
                                        {currency} {itemsTotal.toFixed(1)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-zinc-600">
                                    <span className="flex items-center gap-1">
                                        <Truck className="size-3 text-zinc-400" /> Delivery Charges
                                    </span>
                                    {deliveryFee === 0 ? (
                                        <span className="font-bold text-emerald-600">FREE</span>
                                    ) : (
                                        <span className="font-semibold text-zinc-900">
                                            {currency} {deliveryFee.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {appliedPromo && (
                                    <div className="flex justify-between text-emerald-700 font-semibold">
                                        <span>Promo Discount</span>
                                        <span>
                                            - {currency} {discountAmount.toFixed(1)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-zinc-500 text-[11px]">
                                    <span>Applicable Taxes & VAT</span>
                                    <span>Included</span>
                                </div>

                                <div className="border-t border-zinc-200 pt-3 flex justify-between items-center text-sm">
                                    <span className="font-bold text-zinc-900">Grand Total</span>
                                    <span className="text-xl font-bold text-app-green">
                                        {currency} {grandTotal.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Primary Confirm & Pay CTA Button */}
                            <div className="mt-5">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleConfirmOrder}
                                    className="w-full py-4 bg-app-green hover:bg-app-green-light disabled:opacity-75 text-white font-bold rounded-2xl flex-center gap-2 text-sm shadow-md transition-all active:scale-[0.99]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            <span>Processing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="size-4" />
                                            <span>
                                                {paymentMethod === "cod"
                                                    ? `Confirm Order (${currency} ${grandTotal.toFixed(1)})`
                                                    : `Pay ${currency} ${grandTotal.toFixed(1)} via ${
                                                          paymentMethod === "esewa"
                                                              ? "eSewa"
                                                              : paymentMethod === "khalti"
                                                              ? "Khalti"
                                                              : "Card"
                                                      }`}
                                            </span>
                                            <ChevronRight className="size-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
                                <span>🔒 100% Buyer Protection</span>
                                <span>•</span>
                                <span>⚡ 45-Min Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Submission Modal Loading Backdrop ──────────────────────────── */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fade-in">
                        <div className="size-16 rounded-full bg-emerald-50 text-app-green flex-center mx-auto">
                            <Loader2 className="size-8 animate-spin text-app-green" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">Securing Your Order</h3>
                        <p className="text-xs text-zinc-500 font-medium min-h-[32px]">{processingStep}</p>
                        <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-app-green h-full w-3/4 animate-pulse rounded-full" />
                        </div>
                        <p className="text-[11px] text-zinc-400">Please do not refresh or close this window.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
