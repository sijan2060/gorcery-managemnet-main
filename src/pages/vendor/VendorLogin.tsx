import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Store,
    Bike,
    ArrowRight,
    Sparkles,
    Lock,
    Mail,
    CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const VendorLogin = () => {
    const { loginAsVendor } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("ramesh.organic@pasalmandu.com");
    const [password, setPassword] = useState("••••••••");
    const [loading, setLoading] = useState(false);

    // Redirect path after login
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || "/vendor/dashboard";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            loginAsVendor(email, "Kathmandu Valley Organic Mart");
            setLoading(false);
            toast.success("Welcome back to your Vendor Dashboard!", { icon: "🏪" });
            navigate(fromPath, { replace: true });
        }, 500);
    };

    const handleDemoLogin = () => {
        setLoading(true);
        setTimeout(() => {
            loginAsVendor("ramesh.organic@pasalmandu.com", "Kathmandu Valley Organic Mart");
            setLoading(false);
            toast.success("Logged in as Demo Merchant: Kathmandu Valley Organic Mart", {
                icon: "🚀",
            });
            navigate(fromPath, { replace: true });
        }, 400);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#0E1712] text-zinc-100 selection:bg-app-orange selection:text-white">
            {/* ── Left Side: Merchant Brand Showcase ─────────────────────────── */}
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#111F17] via-[#16291E] to-[#0A120D] border-b lg:border-b-0 lg:border-r border-emerald-900/40">
                {/* Glow orbs */}
                <div className="absolute -top-32 -left-32 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="size-11 rounded-2xl bg-gradient-to-br from-app-orange to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-900/40 group-hover:scale-105 transition-transform">
                            <Bike className="size-6" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold tracking-tight text-white">Pasalmandu</span>
                            <span className="block text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                Merchant Operating System
                            </span>
                        </div>
                    </Link>

                    <div className="mt-14 sm:mt-20 max-w-lg space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 shadow-xs">
                            <Store className="size-3.5" />
                            <span>Dedicated Shop Owner Portal</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
                            Manage inventory, orders & sales in <span className="text-amber-400">Real Time</span>
                        </h1>

                        <p className="text-sm sm:text-base text-zinc-300/80 leading-relaxed">
                            A dedicated counter dashboard designed for local Kirana shops, vegetable markets, organic farms, and bakeries across Kathmandu Valley.
                        </p>

                        {/* Feature Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-zinc-300">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>1-Tap Order Acceptance</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>Live Stock & Low-Alerts</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>15-30 Min Rider Dispatch</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                                <span>Weekly Direct Bank Payouts</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 lg:mt-0 relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <span>© 2026 Pasalmandu Merchant Network</span>
                    <Link to="/" className="hover:text-emerald-400 transition-colors">
                        ← Customer Grocery App
                    </Link>
                </div>
            </div>

            {/* ── Right Side: Dedicated Login Form ──────────────────────────── */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#0D1510]">
                <div className="w-full max-w-md space-y-8 bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                    <div className="space-y-2 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Store Merchant Login
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                            Enter your registered credentials to access your store portal
                        </p>
                    </div>

                    {/* Quick Demo Login Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-emerald-900/60 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                <Sparkles className="size-3.5 text-amber-400" /> Demo Merchant Account
                            </span>
                            <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                                1-Click
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                            Explore full capabilities as <strong>Kathmandu Valley Organic Mart</strong> with sample inventory, incoming orders & analytics.
                        </p>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
                        >
                            <span>Launch Demo Merchant Portal</span>
                            <ArrowRight className="size-3.5" />
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-white/10 w-full" />
                        <span className="bg-[#15231B] px-3 text-[11px] text-zinc-400 uppercase tracking-wider">
                            Or sign in with email
                        </span>
                        <div className="border-t border-white/10 w-full" />
                    </div>

                    {/* Standard Credentials Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Merchant Email or Store ID
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vendor@pasalmandu.com"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border border-white/15 rounded-xl text-white focus:bg-black/60 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Password
                                </label>
                                <a
                                    href="#forgot"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast("For demo access, click 'Launch Demo Merchant Portal' above!");
                                    }}
                                    className="text-xs text-app-orange hover:underline"
                                >
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-black/40 border border-white/15 rounded-xl text-white focus:bg-black/60 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded border-zinc-700 bg-black/40 text-app-orange focus:ring-app-orange"
                                />
                                <span>Remember this merchant device</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-app-orange hover:bg-app-orange-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Access Store Counter</span>
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="pt-4 border-t border-white/10 text-center space-y-3 text-xs">
                        <p className="text-zinc-400">
                            Want to sell groceries with us?{" "}
                            <Link
                                to="/become-seller"
                                className="text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-400/50 ml-1"
                            >
                                Register Your Shop Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
