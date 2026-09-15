import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    HelpCircle,
    Package,
    CreditCard,
    Bike,
    ShieldCheck,
    PhoneCall,
    Mail,
    MessageSquare,
    MapPin,
    ChevronDown,
    ChevronUp,
    Send,
    ThumbsUp,
    ThumbsDown,
    CheckCircle2,
    Clock,
    Sparkles,
    ArrowRight,
    RefreshCcw,
    ExternalLink,
    Paperclip,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

interface FAQItem {
    id: string;
    category: "orders" | "payments" | "delivery" | "returns" | "account";
    question: string;
    answer: string;
    popular?: boolean;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: "faq-track-order",
        category: "orders",
        popular: true,
        question: "How do I track my live grocery delivery?",
        answer: "Once your order is confirmed, you can track it live under the 'My Orders' section in the top menu. You will see real-time status updates: Placed, Confirmed, Freshly Packed, and Out for Delivery with rider details and direct contact option.",
    },
    {
        id: "faq-cancel-order",
        category: "orders",
        popular: true,
        question: "Can I modify or cancel my order after placing it?",
        answer: "You can cancel or modify your order for free within 5 minutes of placing it directly from the Order Details page. After our partner store starts packing fresh items, please call our emergency hotline at +977-1-4567890 immediately so our support team can assist you before the rider departs.",
    },
    {
        id: "faq-missing-item",
        category: "returns",
        popular: true,
        question: "What if an item is damaged, expired, or missing from my grocery bag?",
        answer: "We uphold a strict 100% Freshness Guarantee. If any fruit, vegetable, dairy, or grocery product arrives damaged or missing, report it within 24 hours through our contact form below or WhatsApp us with a quick photo. We will immediately issue a replacement delivery or initiate an instant wallet refund.",
    },
    {
        id: "faq-payment-methods",
        category: "payments",
        popular: true,
        question: "What payment methods do you accept in Nepal?",
        answer: "We accept eSewa, Khalti, Fonepay QR (all Nepalese bank mobile apps), Cash on Delivery (COD), and major Visa/Mastercard debit and credit cards. For contactless deliveries, digital wallet payments or pre-paid QR scans are recommended.",
    },
    {
        id: "faq-failed-payment",
        category: "payments",
        question: "My payment was deducted from eSewa/Khalti/Bank, but the order failed?",
        answer: "Don't worry! This usually happens due to temporary banking network time-outs. Such transactions automatically reverse within 2 to 4 hours. If your amount isn't credited back within that window, submit a ticket below with your transaction code or call our payment desk, and we will verify it with the payment gateway right away.",
    },
    {
        id: "faq-refund-time",
        category: "payments",
        popular: true,
        question: "How long does a refund take to reflect in my account?",
        answer: "Refunds to digital wallets (eSewa & Khalti) are processed within 30 minutes to 2 hours of approval. For bank transfers or debit/credit card reversals, standard IPS / banking clearance usually takes 1 to 3 working business days.",
    },
    {
        id: "faq-delivery-time",
        category: "delivery",
        popular: true,
        question: "How fast is delivery and what are the delivery slots?",
        answer: "We offer Instant Express Delivery (30–45 minutes) for urgent groceries across Kathmandu and Lalitpur. You can also pick scheduled time slots: Morning Slot (7:00 AM – 10:00 AM) or Evening Slot (5:00 PM – 8:00 PM) during checkout.",
    },
    {
        id: "faq-delivery-areas",
        category: "delivery",
        question: "Where does Pasalmandu deliver in Kathmandu Valley?",
        answer: "We deliver across all major localities in Kathmandu (Baneshwor, Kapan, Baluwatar, Thamel, Kalanki, Maharajgunj, etc.), Lalitpur (Patan, Jhamsikhel, Jawalakhel, Satdobato), and Bhaktapur (Suryabinayak, Lokanthali, Thimi, Radhe Radhe).",
    },
    {
        id: "faq-free-delivery",
        category: "delivery",
        question: "What is the minimum order for free delivery?",
        answer: "Orders above Rs. 1,000 qualify for FREE standard delivery anywhere inside Ring Road. For orders under Rs. 1,000, a nominal delivery fee of Rs. 50 is charged to compensate our delivery riders.",
    },
    {
        id: "faq-account-change",
        category: "account",
        question: "How do I update my delivery address or phone number?",
        answer: "You can manage multiple delivery addresses (Home, Office, Parents) from your account under 'My Addresses'. Make sure your contact phone number is always active so our delivery rider can call upon arrival.",
    },
    {
        id: "faq-seller-support",
        category: "account",
        question: "I am a local grocery store owner. How do I become a seller?",
        answer: "You can click 'Become a Seller' in the navigation bar to sign up your kirana store, organic farm, or dairy shop. Onboarding takes less than 24 hours with 0% platform commission for the first 30 days.",
    },
];

const QUICK_TAGS = [
    "Track Order",
    "Refund Timeline",
    "Cancel Order",
    "eSewa / Khalti",
    "Damaged Produce",
    "Delivery Charges",
    "Kathmandu Coverage",
];

const HelpSupport = () => {
    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-track-order");
    const [faqFeedback, setFaqFeedback] = useState<Record<string, "yes" | "no">>({});

    // Contact Form State
    const contactFormRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        category: "Order Support",
        orderId: "",
        urgency: "Normal",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<{ id: string; category: string } | null>(null);
    const [recentOrders] = useState<Array<{ _id: string; orderNumber?: string }>>(() => {
        try {
            const raw = localStorage.getItem("pasalmandu_orders");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.slice(0, 5);
                }
            }
        } catch {
            // ignore
        }
        return [];
    });
    const [attachmentName, setAttachmentName] = useState<string | null>(null);

    // Filter FAQs based on search query and category
    const filteredFaqs = useMemo(() => {
        return FAQ_DATA.filter((faq) => {
            const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesCategory;

            const matchesSearch =
                faq.question.toLowerCase().includes(q) ||
                faq.answer.toLowerCase().includes(q) ||
                faq.category.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const handleFaqToggle = (id: string) => {
        setExpandedFaq((prev) => (prev === id ? null : id));
    };

    const handleFeedback = (faqId: string, type: "yes" | "no") => {
        if (faqFeedback[faqId]) return;
        setFaqFeedback((prev) => ({ ...prev, [faqId]: type }));
        if (type === "yes") {
            toast.success("Thank you for your feedback!", { icon: "✨" });
        } else {
            toast("Thanks! We'll improve this answer.", { icon: "📝" });
        }
    };

    const scrollToFormWithCategory = (category: string) => {
        setFormData((prev) => ({ ...prev, category }));
        contactFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleQuickTagClick = (tag: string) => {
        setSearchQuery(tag);
        setSelectedCategory("all");
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (!formData.email.trim() || !formData.email.includes("@")) {
            toast.error("Please provide a valid email address");
            return;
        }
        if (!formData.phone.trim() || formData.phone.length < 9) {
            toast.error("Please provide a valid 10-digit mobile number");
            return;
        }
        if (!formData.subject.trim()) {
            toast.error("Please provide a brief subject");
            return;
        }
        if (!formData.message.trim() || formData.message.length < 15) {
            toast.error("Please write a message of at least 15 characters");
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
            setSubmittedTicket({ id: ticketId, category: formData.category });
            toast.success(`Support Ticket #${ticketId} created successfully!`);

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                category: "Order Support",
                orderId: "",
                urgency: "Normal",
                subject: "",
                message: "",
            });
            setAttachmentName(null);
        }, 1200);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentName(e.target.files[0].name);
            toast.success(`Attached ${e.target.files[0].name}`, { icon: "📎" });
        }
    };

    return (
        <div className="min-h-screen bg-app-cream/60 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* 1. HERO & SEARCH SECTION */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1b3022] via-[#23422e] to-[#122218] text-white p-8 md:p-14 shadow-2xl border border-emerald-800/40">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            Support Desk Online • Avg Response: &lt; 5 mins
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-white leading-tight">
                            How can we help you with your{" "}
                            <span className="text-app-orange underline decoration-app-orange/40 decoration-wavy">
                                groceries
                            </span>{" "}
                            today?
                        </h1>

                        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
                            Search our instant solutions for Kathmandu valley orders, eSewa/Khalti payments, delivery
                            timings, or get in touch with our live support agents.
                        </p>

                        {/* Search Input Box */}
                        <div className="relative max-w-2xl mx-auto pt-2">
                            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-black/20 p-1.5 focus-within:ring-4 focus-within:ring-app-orange/30 transition-all">
                                <div className="pl-4 text-zinc-400">
                                    <Search className="size-5 text-zinc-500" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by issue (e.g. 'refund', 'eSewa failed', 'cancel order', 'track')..."
                                    className="w-full px-3 py-3 text-zinc-800 placeholder-zinc-400 text-sm sm:text-base bg-transparent border-0 focus:outline-hidden"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
                                        title="Clear search"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-5 py-3 bg-app-orange hover:bg-app-orange-dark text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                                >
                                    <span>Search</span>
                                </button>
                            </div>

                            {/* Popular search tags */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
                                <span className="text-zinc-400 font-medium">Common searches:</span>
                                {QUICK_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleQuickTagClick(tag)}
                                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. THREE SUPPORT PILLARS & FRESHNESS GUARANTEE */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-app-green tracking-tight font-serif">
                            Browse by Support Category
                        </h2>
                        <p className="text-sm text-app-text-light">
                            Select a dedicated support department to get immediate guidance or report a problem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1: Order Support */}
                        <div className="group bg-white rounded-2xl p-6 border border-app-border hover:border-emerald-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
                            <div className="space-y-4 relative z-10">
                                <div className="size-12 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shadow-xs">
                                    <Package className="size-6 text-emerald-700" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-app-green group-hover:text-emerald-800 transition-colors">
                                        Order Support
                                    </h3>
                                    <p className="text-xs text-app-text-light mt-1 leading-relaxed">
                                        Live tracking status, item modification, cancellation requests, or missing
                                        items from your grocery bag.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-2 text-xs text-zinc-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                        <span>Instant live order status & GPS tracking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                        <span>Cancel or add items within 5 mins</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                        <span>Missing item immediate replacement</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                                <Link
                                    to="/orders"
                                    className="text-xs font-semibold text-app-green hover:text-emerald-700 inline-flex items-center gap-1"
                                >
                                    View Orders <ArrowRight className="size-3.5" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithCategory("Order Support")}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                                >
                                    Report Issue
                                </button>
                            </div>
                        </div>

                        {/* Pillar 2: Payment Support */}
                        <div className="group bg-white rounded-2xl p-6 border border-app-border hover:border-app-orange/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
                            <div className="space-y-4 relative z-10">
                                <div className="size-12 rounded-xl bg-orange-100/70 text-app-orange flex items-center justify-center shadow-xs">
                                    <CreditCard className="size-6 text-app-orange" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-app-green group-hover:text-app-orange transition-colors">
                                        Payment & Refund Support
                                    </h3>
                                    <p className="text-xs text-app-text-light mt-1 leading-relaxed">
                                        eSewa, Khalti, Fonepay QR troubleshooting, Cash on Delivery change, failed
                                        debits, and refund reconciliation.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-2 text-xs text-zinc-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-app-orange shrink-0" />
                                        <span>eSewa & Khalti 2-hour fast refunds</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-app-orange shrink-0" />
                                        <span>Failed payment auto-reversal resolution</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-app-orange shrink-0" />
                                        <span>Download official VAT bills & invoices</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory("payments");
                                        setExpandedFaq("faq-refund-time");
                                    }}
                                    className="text-xs font-semibold text-app-orange hover:text-app-orange-dark inline-flex items-center gap-1 cursor-pointer"
                                >
                                    Refund Policies <ArrowRight className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithCategory("Payment / Wallet Issue")}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-app-orange-dark transition-colors"
                                >
                                    Payment Help
                                </button>
                            </div>
                        </div>

                        {/* Pillar 3: Delivery Support */}
                        <div className="group bg-white rounded-2xl p-6 border border-app-border hover:border-blue-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
                            <div className="space-y-4 relative z-10">
                                <div className="size-12 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center shadow-xs">
                                    <Bike className="size-6 text-blue-700" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-app-green group-hover:text-blue-700 transition-colors">
                                        Delivery Support
                                    </h3>
                                    <p className="text-xs text-app-text-light mt-1 leading-relaxed">
                                        Kathmandu valley coverage, rider arrival ETA, rain/monsoon delays, address pin
                                        corrections, and gate instructions.
                                    </p>
                                </div>

                                <ul className="space-y-2 pt-2 text-xs text-zinc-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                        <span>30–45 minute express door-to-door slot</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                        <span>Direct call contact with assigned rider</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                        <span>Delivery coverage across KTM, Lalitpur & Bhaktapur</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory("delivery");
                                        setExpandedFaq("faq-delivery-time");
                                    }}
                                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                                >
                                    Coverage & Timings <ArrowRight className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollToFormWithCategory("Delivery Delay / Issue")}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors"
                                >
                                    Delivery Help
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Freshness & Quality Guarantee Banner */}
                    <div className="mt-6 bg-linear-to-r from-emerald-900 to-[#1B3022] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-700/50 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-white/10 flex-center shrink-0 border border-white/15">
                                <ShieldCheck className="size-7 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                    100% Pasalmandu Freshness Guarantee
                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-400 text-green-950 px-2 py-0.5 rounded-full">
                                        No Questions Asked
                                    </span>
                                </h4>
                                <p className="text-xs text-zinc-300 mt-0.5">
                                    Not satisfied with the freshness of vegetables, fruits, dairy, or bakery items?
                                    Report within 24 hours for an instant hassle-free replacement or wallet credit.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => scrollToFormWithCategory("Damaged / Freshness Quality")}
                            className="shrink-0 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-green-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                        >
                            Claim Freshness Guarantee
                        </button>
                    </div>
                </div>

                {/* 3. INTERACTIVE FAQS SECTION */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-app-border shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-app-orange uppercase tracking-wider mb-2">
                                <HelpCircle className="size-4" />
                                Frequently Asked Questions
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-app-green font-serif">
                                Quick Answers for Shoppers
                            </h2>
                        </div>

                        {/* Category filter tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-app-cream p-1 rounded-xl border border-app-border/70">
                            {[
                                { id: "all", label: "All FAQs" },
                                { id: "orders", label: "Orders" },
                                { id: "payments", label: "Payments & Refunds" },
                                { id: "delivery", label: "Delivery" },
                                { id: "returns", label: "Quality & Returns" },
                                { id: "account", label: "Account" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        selectedCategory === tab.id
                                            ? "bg-white text-app-green shadow-xs border border-app-border/40 font-bold"
                                            : "text-zinc-600 hover:text-zinc-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items Accordion */}
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
                            <HelpCircle className="size-10 text-zinc-300 mx-auto mb-3" />
                            <p className="text-base font-semibold text-zinc-700">No matching questions found</p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                                We couldn't find an answer matching &ldquo;{searchQuery}&rdquo;. Try different keywords or
                                submit a support ticket below.
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                    }}
                                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                                >
                                    Reset Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={() => contactFormRef.current?.scrollIntoView({ behavior: "smooth" })}
                                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-app-green text-white hover:bg-green-900"
                                >
                                    Ask Our Team
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredFaqs.map((faq) => {
                                const isOpen = expandedFaq === faq.id;
                                const feedback = faqFeedback[faq.id];

                                return (
                                    <div
                                        key={faq.id}
                                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                            isOpen
                                                ? "border-emerald-600/40 bg-emerald-50/20 shadow-xs"
                                                : "border-app-border hover:border-zinc-300 bg-white"
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleFaqToggle(faq.id)}
                                            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`size-2 rounded-full shrink-0 ${
                                                        isOpen ? "bg-app-orange" : "bg-zinc-300"
                                                    }`}
                                                />
                                                <span className="text-sm sm:text-base font-semibold text-app-green">
                                                    {faq.question}
                                                </span>
                                            </div>
                                            <div className="shrink-0 text-zinc-400">
                                                {isOpen ? (
                                                    <ChevronUp className="size-5 text-emerald-700" />
                                                ) : (
                                                    <ChevronDown className="size-5" />
                                                )}
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-emerald-900/5 animate-fade-in space-y-4">
                                                <p>{faq.answer}</p>

                                                {/* Helpful voting widget */}
                                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                                                    <span>Was this helpful?</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={!!feedback}
                                                            onClick={() => handleFeedback(faq.id, "yes")}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                                                                feedback === "yes"
                                                                    ? "bg-emerald-100 text-emerald-800 font-bold"
                                                                    : "hover:bg-zinc-100 text-zinc-600"
                                                            }`}
                                                        >
                                                            <ThumbsUp className="size-3.5" />
                                                            <span>Yes</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={!!feedback}
                                                            onClick={() => handleFeedback(faq.id, "no")}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                                                                feedback === "no"
                                                                    ? "bg-red-100 text-red-800 font-bold"
                                                                    : "hover:bg-zinc-100 text-zinc-600"
                                                            }`}
                                                        >
                                                            <ThumbsDown className="size-3.5" />
                                                            <span>No</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 4. CONTACT US & CHANNELS GRID */}
                <div>
                    <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-app-orange uppercase tracking-wider">
                            <PhoneCall className="size-4" />
                            Direct Contact Channels
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-app-green font-serif">
                            Reach Our Kathmandu Team
                        </h2>
                        <p className="text-sm text-app-text-light">
                            Available 7 days a week for quick order resolution, delivery assistance, and customer support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* 1. Phone Helpline */}
                        <div className="bg-white rounded-2xl p-5 border border-app-border hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="size-11 rounded-xl bg-emerald-50 text-emerald-700 flex-center">
                                    <PhoneCall className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-app-green">Phone Support</h3>
                                    <p className="text-xs text-app-text-light mt-0.5">7:00 AM – 10:00 PM Daily</p>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <a
                                        href="tel:+97714567890"
                                        className="block font-semibold text-zinc-800 hover:text-emerald-700 transition-colors"
                                    >
                                        +977-1-4567890 (Toll Free)
                                    </a>
                                    <a
                                        href="tel:+9779801234567"
                                        className="block text-zinc-600 hover:text-emerald-700 transition-colors"
                                    >
                                        +977-9801234567 (Mobile)
                                    </a>
                                </div>
                            </div>
                            <div className="pt-4 mt-3 border-t border-zinc-100">
                                <a
                                    href="tel:+97714567890"
                                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                                >
                                    Call Helpline Now <ArrowRight className="size-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* 2. WhatsApp Instant Chat */}
                        <div className="bg-white rounded-2xl p-5 border border-app-border hover:border-green-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="size-11 rounded-xl bg-green-50 text-green-700 flex-center">
                                    <MessageSquare className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-app-green">WhatsApp Chat</h3>
                                    <p className="text-xs text-app-text-light mt-0.5">Send photos of damaged items</p>
                                </div>
                                <p className="text-xs text-zinc-600 leading-relaxed">
                                    Chat directly with a support specialist. Quickest way to verify damaged produce or
                                    live rider locations.
                                </p>
                            </div>
                            <div className="pt-4 mt-3 border-t border-zinc-100">
                                <a
                                    href="https://wa.me/9779801234567?text=Hello%20Pasalmandu%20Support,%20I%20need%20assistance%20with%20my%20order"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1"
                                >
                                    Open WhatsApp Chat <ExternalLink className="size-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* 3. Email Inquiries */}
                        <div className="bg-white rounded-2xl p-5 border border-app-border hover:border-amber-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="size-11 rounded-xl bg-amber-50 text-amber-700 flex-center">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-app-green">Email Support</h3>
                                    <p className="text-xs text-app-text-light mt-0.5">Invoices, billing & partnerships</p>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <a
                                        href="mailto:support@pasalmandu.com"
                                        className="block font-semibold text-zinc-800 hover:text-amber-700 transition-colors"
                                    >
                                        support@pasalmandu.com
                                    </a>
                                    <p className="text-zinc-500">Average response time: &lt; 2 hours</p>
                                </div>
                            </div>
                            <div className="pt-4 mt-3 border-t border-zinc-100">
                                <a
                                    href="mailto:support@pasalmandu.com?subject=Pasalmandu%20Support%20Request"
                                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                                >
                                    Send Email <ArrowRight className="size-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* 4. Central Fulfillment Hub */}
                        <div className="bg-white rounded-2xl p-5 border border-app-border hover:border-purple-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="size-11 rounded-xl bg-purple-50 text-purple-700 flex-center">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-app-green">Fulfillment Center</h3>
                                    <p className="text-xs text-app-text-light mt-0.5">Central Grocery Hub</p>
                                </div>
                                <p className="text-xs text-zinc-600 leading-relaxed">
                                    Madan Bhandari Path, Tinkune / New Baneshwor, Kathmandu 44600, Nepal.
                                </p>
                            </div>
                            <div className="pt-4 mt-3 border-t border-zinc-100">
                                <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                                    Pickup & Hub Support
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. "NEED MORE HELP?" INTERACTIVE CONTACT FORM */}
                <div
                    ref={contactFormRef}
                    className="bg-white rounded-3xl p-6 sm:p-10 border border-app-border shadow-md scroll-mt-24"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form Intro & Help Info */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-app-orange text-xs font-bold uppercase tracking-wider">
                                    <Sparkles className="size-3.5" />
                                    Submit Ticket
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-app-green font-serif">
                                    Need More Help?
                                </h3>
                                <p className="text-xs sm:text-sm text-app-text-light leading-relaxed">
                                    Can't find what you are looking for? Send us a ticket and our Kathmandu support team
                                    will investigate and contact you via phone or email.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-app-cream p-5 border border-app-border space-y-3">
                                <h4 className="text-xs font-bold text-app-green uppercase tracking-wide flex items-center gap-2">
                                    <Clock className="size-4 text-app-orange" />
                                    Expected Resolution Time
                                </h4>
                                <ul className="space-y-2 text-xs text-zinc-600">
                                    <li className="flex items-start gap-2">
                                        <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                        <span>
                                            <strong>Active Orders:</strong> Priority dispatch within 5–15 mins
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="size-1.5 rounded-full bg-app-orange mt-1.5 shrink-0" />
                                        <span>
                                            <strong>Wallet Refunds:</strong> Reviewed & processed in &lt; 2 hrs
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="size-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                        <span>
                                            <strong>General Queries:</strong> Addressed same day
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {submittedTicket && (
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-800 space-y-2 animate-fade-in">
                                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                                        <CheckCircle2 className="size-4 text-emerald-600" />
                                        Ticket Created: {submittedTicket.id}
                                    </div>
                                    <p>
                                        We have received your report regarding <strong>{submittedTicket.category}</strong>.
                                        Check your email inbox or phone for confirmation.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmittedTicket(null)}
                                        className="text-emerald-700 underline font-semibold cursor-pointer"
                                    >
                                        Dismiss notification
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* The Actual Form */}
                        <form onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Sujan Shrestha"
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g. sujan@example.com"
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="e.g. 9841XXXXXX"
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Support Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    >
                                        <option value="Order Support">Order Support & Tracking</option>
                                        <option value="Payment / Wallet Issue">Payment / Wallet (eSewa/Khalti)</option>
                                        <option value="Delivery Delay / Issue">Delivery Delay or Rider Help</option>
                                        <option value="Damaged / Freshness Quality">Damaged or Freshness Issue</option>
                                        <option value="Missing Item">Missing Item in Delivery</option>
                                        <option value="Account & Address">Account, Login & Addresses</option>
                                        <option value="General Inquiry">General Question / Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Order ID <span className="text-zinc-400 font-normal">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.orderId}
                                            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                            placeholder="e.g. PSM-2026-981245"
                                            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all font-mono text-xs"
                                        />
                                        {recentOrders.length > 0 && !formData.orderId && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        orderId: recentOrders[0].orderNumber || recentOrders[0]._id,
                                                    })
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded cursor-pointer"
                                                title="Autofill last order"
                                            >
                                                Last Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Brief summary of your inquiry..."
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                        Urgency Level
                                    </label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all"
                                    >
                                        <option value="Normal">Normal (Standard)</option>
                                        <option value="High">High (Needs same day reply)</option>
                                        <option value="Urgent - Order in Progress">Urgent - Order in Progress</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                    Detailed Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Please describe your problem or question in detail. If this is about a damaged or missing item, specify the product name..."
                                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-app-border rounded-xl focus:bg-white focus:ring-2 focus:ring-app-orange/30 focus:border-app-orange transition-all resize-y"
                                />
                            </div>

                            {/* Photo Proof / File Attachment */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-50 border border-dashed border-zinc-300">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-8 rounded-lg bg-white border border-zinc-200 flex-center text-zinc-500">
                                        <Paperclip className="size-4" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-semibold text-zinc-700">
                                            {attachmentName ? attachmentName : "Attach Photo Proof (Optional)"}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                            Recommended for damaged vegetables, dairy, or receipt screenshots (PNG, JPG)
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="cursor-pointer text-xs font-semibold px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-lg transition-colors inline-block">
                                        <span>Browse File</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between gap-4">
                                <p className="text-[11px] text-zinc-400">
                                    By submitting, you agree to our fair support & return policies.
                                </p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-app-green hover:bg-[#254431] text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-950/20 transition-all duration-200 active:scale-95 disabled:opacity-70 cursor-pointer shrink-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCcw className="size-4 animate-spin text-white" />
                                            <span>Submitting Ticket...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-4" />
                                            <span>Submit Support Request</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 6. BOTTOM TRUST & SELF SERVICE FOOTER CALLOUT */}
                <div className="text-center py-6 border-t border-app-border/70 space-y-2">
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Looking for store partnerships or want to list your local mart? Visit our{" "}
                        <Link to="/become-seller" className="text-app-orange font-semibold hover:underline">
                            Merchant Onboarding Hub
                        </Link>{" "}
                        or check out today's{" "}
                        <Link to="/deals" className="text-app-green font-semibold hover:underline">
                            Daily Flash Deals
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
