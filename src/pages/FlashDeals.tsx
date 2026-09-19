import { Link } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import { useWeeklyDeals } from "../hooks/useWeeklyDeals";
import {
    ChevronRight,
    HomeIcon,
    Flame,
    Clock,
    Calendar,
    Sparkles,
    ShieldCheck,
    Truck,
    BadgePercent,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";

const FlashDeals = () => {
    const {
        liveWeekNumber,
        selectedWeek,
        activeSchedule,
        deals,
        countdown,
        isLiveWeek,
        allSchedules,
        selectWeek,
        resetToLiveWeek,
    } = useWeeklyDeals();

    return (
        <div className="min-h-screen bg-[#FAF7F2] pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb Navigation */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-6"
                >
                    <Link
                        to="/"
                        className="hover:text-app-green flex items-center gap-1 transition-colors"
                    >
                        <HomeIcon className="size-3.5" />
                        <span>Home</span>
                    </Link>
                    <ChevronRight className="size-3 text-zinc-400" />
                    <span className="text-zinc-500">Pasalmandu Deals</span>
                    <ChevronRight className="size-3 text-zinc-400" />
                    <span className="text-zinc-800 font-semibold">Deals of the Week</span>
                </nav>

                {/* Main Hero Banner with Deals of the Week Heading & Countdown */}
                <section
                    aria-label="Deals of the Week Announcement"
                    className="relative overflow-hidden mb-8 bg-linear-to-br from-[#1B3022] via-[#1f3c2b] to-[#122217] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-900/50"
                >
                    {/* Background Decorative Rings */}
                    <div className="absolute -right-16 -top-16 size-72 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute -left-12 -bottom-12 size-60 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* Left Info Column */}
                        <div className="max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2.5 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-full tracking-wide">
                                    <Flame className="size-3.5 fill-amber-300 animate-pulse" />
                                    {activeSchedule.badge || "Weekly Rotating Specials"}
                                </span>

                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white/90 text-xs font-medium rounded-full backdrop-blur-xs">
                                    <Sparkles className="size-3 text-emerald-300" />
                                    7 Unique Deals Every Week
                                </span>
                            </div>

                            {/* Required Deals of the Week Heading */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-white font-bold leading-tight">
                                Deals of the Week
                            </h1>

                            <p className="text-base sm:text-lg font-medium text-amber-200/95 mt-2">
                                {activeSchedule.title}
                            </p>

                            <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed max-w-xl">
                                {activeSchedule.subtitle}
                            </p>

                            {/* Rotating Guarantee Note */}
                            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200/90 font-medium">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>
                                    Automatically rotates 7 brand-new products every Monday. Never repeats from previous week!
                                </span>
                            </div>
                        </div>

                        {/* Right Countdown Column - Shows When Current Deals Will Change */}
                        <div className="lg:shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 text-center max-w-md w-full shadow-lg">
                            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/15">
                                <div className="flex items-center gap-2 text-xs font-semibold text-white/90 uppercase tracking-wider">
                                    <Clock className="size-4 text-amber-300 animate-spin-slow" />
                                    <span>Current Deals Rotate In</span>
                                </div>
                                <span
                                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                                        isLiveWeek
                                            ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/30"
                                            : "bg-amber-500/30 text-amber-200 border border-amber-400/30"
                                    }`}
                                >
                                    {isLiveWeek ? "Live Week" : `Preview Week ${selectedWeek}`}
                                </span>
                            </div>

                            {/* Countdown Digit Blocks */}
                            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 my-3">
                                <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                                    <span className="block text-2xl sm:text-3xl font-bold font-mono text-white">
                                        {countdown.days.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
                                        Days
                                    </span>
                                </div>

                                <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                                    <span className="block text-2xl sm:text-3xl font-bold font-mono text-white">
                                        {countdown.hours.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
                                        Hours
                                    </span>
                                </div>

                                <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                                    <span className="block text-2xl sm:text-3xl font-bold font-mono text-white">
                                        {countdown.minutes.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
                                        Mins
                                    </span>
                                </div>

                                <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                                    <span className="block text-2xl sm:text-3xl font-bold font-mono text-amber-300">
                                        {countdown.seconds.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">
                                        Secs
                                    </span>
                                </div>
                            </div>

                            {/* Rotation Schedule Details */}
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-white/75">
                                <Calendar className="size-3.5 text-amber-300 shrink-0" />
                                <span>
                                    Next reset:{" "}
                                    <strong className="text-white font-semibold">
                                        {countdown.formattedDate}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Multi-Week Switcher & Demonstration Toolbar */}
                <div className="mb-8 bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                <BadgePercent className="size-4 text-app-orange" />
                                <span>Weekly Rotation Demonstration & Curation</span>
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Every week delivers 7 non-repeating products. Switch weeks to inspect upcoming sets:
                            </p>
                        </div>

                        {!isLiveWeek && (
                            <button
                                onClick={resetToLiveWeek}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                            >
                                <RotateCcw className="size-3.5" />
                                Return to Live Deals
                            </button>
                        )}
                    </div>

                    {/* Week Buttons */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                            onClick={() => selectWeek(liveWeekNumber)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                                isLiveWeek
                                    ? "bg-app-green text-white shadow-xs"
                                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                            }`}
                        >
                            <span className="size-2 rounded-full bg-emerald-300 animate-ping inline-block" />
                            Current Week (Live)
                        </button>

                        {allSchedules.map((schedule) => {
                            const isSelected = selectedWeek === schedule.weekIndex;
                            return (
                                <button
                                    key={schedule.weekIndex}
                                    onClick={() => selectWeek(schedule.weekIndex)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected && !isLiveWeek
                                            ? "bg-app-orange text-white shadow-xs font-semibold"
                                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                                    }`}
                                >
                                    Week {schedule.weekIndex}
                                </button>
                            );
                        })}
                    </div>

                    {!isLiveWeek && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 flex items-center justify-between gap-2">
                            <span>
                                <strong>Preview Mode:</strong> Displaying Week {selectedWeek} Deals (7 distinct products).
                            </span>
                            <button
                                onClick={resetToLiveWeek}
                                className="underline font-semibold hover:text-amber-900 shrink-0 cursor-pointer"
                            >
                                View Current Live Week
                            </button>
                        </div>
                    )}
                </div>

                {/* Section Header: 7 Deal Products */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-2 border-b border-zinc-200">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-serif text-zinc-900 font-bold flex items-center gap-2">
                            <span>Featured 7 Deals for Week {activeSchedule.weekIndex}</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                            Handpicked quality items at special weekly promotional pricing with full cart integration.
                        </p>
                    </div>

                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                        Showing 7 of 7 Special Deals
                    </div>
                </div>

                {/* The 7 Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {deals.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>

                {/* Trust & Policy Highlights */}
                <section
                    aria-label="Deals Benefits"
                    className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-xs"
                >
                    <div className="flex items-start gap-3.5 p-2">
                        <div className="size-10 rounded-xl bg-emerald-50 flex-center text-app-green shrink-0">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900">Guaranteed 7 Days Active</h3>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                Prices remain locked for the entire week across all refreshes. No sudden price hikes!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-2">
                        <div className="size-10 rounded-xl bg-amber-50 flex-center text-app-orange shrink-0">
                            <ShieldCheck className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900">100% Non-Repeating Variety</h3>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                Consecutive weeks never share products, ensuring fresh choices every single rotation.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-2">
                        <div className="size-10 rounded-xl bg-emerald-50 flex-center text-app-green shrink-0">
                            <Truck className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900">Express Delivery</h3>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                Same-day doorstep delivery on all weekly deals, straight from local farms and trusted partners.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FlashDeals;
