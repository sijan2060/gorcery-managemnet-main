import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    Bell,
    Plus,
    Store,
    User,
    LogOut,
    ChevronDown,
    ExternalLink,
    Clock,
    AlertCircle,
    Package,
} from "lucide-react";
import { useVendor } from "../../../context/VendorContext";
import { useAuth } from "../../../context/AuthContext";

interface VendorHeaderProps {
    onOpenMobileSidebar: () => void;
}

export const VendorHeader = ({ onOpenMobileSidebar }: VendorHeaderProps) => {
    const { store, toggleStoreStatus, notifications, unreadNotificationsCount, markNotificationRead, clearAllNotifications } =
        useVendor();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
            if (userRef.current && !userRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/vendor/login");
    };

    return (
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all">
            {/* Left: Mobile hamburger & Store Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMobileSidebar}
                    className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu className="size-5" />
                </button>

                <div className="hidden sm:block">
                    <h1 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                        <span>{store.storeName}</span>
                    </h1>
                    <p className="text-xs text-zinc-500">Merchant Dashboard • Kathmandu</p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
                {/* Store Open / Closed Status Toggle Button */}
                <button
                    onClick={toggleStoreStatus}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border ${store.isOpen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                        }`}
                    title={store.isOpen ? "Click to set store as Closed" : "Click to set store as Open"}
                >
                    <span
                        className={`size-2 rounded-full ${store.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`}
                    />
                    <span className="hidden sm:inline">Store:</span>
                    <span>{store.isOpen ? "Open for Orders" : "Closed"}</span>
                </button>

                {/* Quick Add Product CTA */}
                <Link
                    to="/vendor/products/new"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-app-orange hover:bg-app-orange-dark text-white text-xs font-bold rounded-full shadow-xs transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="size-3.5" />
                    <span>Add Product</span>
                </Link>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="size-5" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-app-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 py-3 z-50 animate-fade-in">
                            <div className="px-4 pb-2.5 border-b border-zinc-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-zinc-900">Store Notifications</h3>
                                    <p className="text-[11px] text-zinc-500">
                                        {unreadNotificationsCount} unread update{unreadNotificationsCount === 1 ? "" : "s"}
                                    </p>
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAllNotifications}
                                        className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto divide-y divide-zinc-50">
                                {notifications.length === 0 ? (
                                    <div className="py-8 text-center text-zinc-400 text-xs">
                                        No recent notifications.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                markNotificationRead(notif.id);
                                                if (notif.link) {
                                                    navigate(notif.link);
                                                    setNotifOpen(false);
                                                }
                                            }}
                                            className={`p-3 sm:px-4 flex items-start gap-3 cursor-pointer transition-colors ${notif.read ? "bg-white hover:bg-zinc-50" : "bg-emerald-50/40 hover:bg-emerald-50"
                                                }`}
                                        >
                                            <div className="size-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 text-zinc-700">
                                                {notif.type === "order" && <Package className="size-4 text-emerald-600" />}
                                                {notif.type === "stock" && <AlertCircle className="size-4 text-amber-600" />}
                                                {notif.type === "deal" && <Clock className="size-4 text-app-orange" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-zinc-900 leading-tight">
                                                    {notif.title}
                                                </p>
                                                <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[10px] text-zinc-400 mt-1 block">
                                                    {notif.timestamp}
                                                </span>
                                            </div>
                                            {!notif.read && (
                                                <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="px-4 pt-2.5 border-t border-zinc-100 text-center">
                                <Link
                                    to="/vendor/orders"
                                    onClick={() => setNotifOpen(false)}
                                    className="text-xs font-semibold text-app-orange hover:text-app-orange-dark transition-colors"
                                >
                                    View Live Order Queue →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile & Store Switcher Avatar */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
                    >
                        <img
                            src={store.logoUrl}
                            alt={store.storeName}
                            className="size-8 rounded-full object-cover ring-2 ring-emerald-600/20"
                        />
                        <span className="hidden md:inline-block text-xs font-semibold text-zinc-800 max-w-28 truncate">
                            {user?.name || store.ownerName}
                        </span>
                        <ChevronDown className="size-3.5 text-zinc-400" />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-200 py-2 z-50 animate-fade-in text-xs">
                            <div className="px-4 py-2 border-b border-zinc-100">
                                <p className="font-bold text-zinc-900">{store.ownerName}</p>
                                <p className="text-zinc-500 truncate">{store.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                    Verified Shop Owner
                                </span>
                            </div>

                            <Link
                                to="/vendor/profile"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <User className="size-4 text-zinc-400" />
                                <span>Owner Profile & Payout</span>
                            </Link>

                            <Link
                                to="/vendor/settings"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <Store className="size-4 text-zinc-400" />
                                <span>Store Information</span>
                            </Link>

                            <div className="border-t border-zinc-100 my-1" />

                            <Link
                                to="/"
                                target="_blank"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="flex items-center gap-2.5">
                                    <ExternalLink className="size-4 text-zinc-400" />
                                    <span>Switch to Customer App</span>
                                </span>
                            </Link>

                            <div className="border-t border-zinc-100 my-1" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-left"
                            >
                                <LogOut className="size-4" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
