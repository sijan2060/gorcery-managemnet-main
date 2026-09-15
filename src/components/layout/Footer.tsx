import { Link } from "react-router-dom";
import {
    Bike,
    Phone,
    Mail,
    MapPin,
    ShieldCheck,
    Clock,
    HelpCircle,
    Package,
    Store,
    Heart,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#142319] text-zinc-300 pt-14 pb-8 border-t border-emerald-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5 text-2xl font-serif text-white tracking-wide">
                            <div className="size-9 rounded-xl bg-app-orange flex-center text-white shadow-md">
                                <Bike size={20} />
                            </div>
                            <span>Pasalmandu</span>
                        </Link>
                        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
                            Kathmandu Valley's favorite grocery service. Fresh produce, farm eggs, organic dairy, and daily essentials delivered to your doorstep in 30–45 minutes.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
                                <ShieldCheck size={14} /> 100% Freshness Guarantee
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
                                <Clock size={14} /> 7:00 AM – 10:00 PM
                            </span>
                        </div>
                    </div>

                    {/* Quick Shop Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                            Explore
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <Link to="/" className="hover:text-app-orange transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-app-orange transition-colors">
                                    All Groceries
                                </Link>
                            </li>
                            <li>
                                <Link to="/deals" className="hover:text-app-orange transition-colors">
                                    Flash Deals & Offers
                                </Link>
                            </li>
                            <li>
                                <Link to="/become-seller" className="hover:text-app-orange transition-colors flex items-center gap-1.5">
                                    <Store size={14} /> Become a Seller
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help & Support Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                            Help & Support
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <Link to="/help" className="hover:text-app-orange transition-colors flex items-center gap-1.5 font-medium text-emerald-300">
                                    <HelpCircle size={14} /> Help Center & FAQs
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="hover:text-app-orange transition-colors flex items-center gap-1.5">
                                    <Package size={14} /> Track My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="hover:text-app-orange transition-colors">
                                    Payment & Refund Help
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="hover:text-app-orange transition-colors">
                                    Delivery Timings & Areas
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="hover:text-app-orange transition-colors">
                                    Contact Support Team
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Kathmandu Hub */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                            Contact Us
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <Phone size={15} className="text-app-orange shrink-0 mt-0.5" />
                                <div>
                                    <a href="tel:+97714567890" className="hover:text-white block font-semibold text-zinc-200">
                                        +977-1-4567890
                                    </a>
                                    <span className="text-[11px] text-zinc-500">Helpline (7 AM – 10 PM)</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail size={15} className="text-app-orange shrink-0 mt-0.5" />
                                <div>
                                    <a href="mailto:support@pasalmandu.com" className="hover:text-white block text-zinc-200">
                                        support@pasalmandu.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={15} className="text-app-orange shrink-0 mt-0.5" />
                                <span className="text-xs">
                                    Tinkune / New Baneshwor, Kathmandu, Nepal
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods & Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-zinc-500">Supported Payments:</span>
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[11px]">
                            eSewa
                        </span>
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[11px]">
                            Khalti
                        </span>
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[11px]">
                            Fonepay QR
                        </span>
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[11px]">
                            Cash on Delivery
                        </span>
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold text-[11px]">
                            Visa / Cards
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                        <span>&copy; 2026 Pasalmandu. Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500" />
                        <span>for Kathmandu shoppers.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
