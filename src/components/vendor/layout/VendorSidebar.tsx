import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    FolderTree,
    Boxes,
    ShoppingBag,
    Tag,
    Users,
    BarChart3,
    Store,
    UserCheck,
    LogOut,
    X,
    ExternalLink,
    Bike,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useVendor } from "../../../context/VendorContext";

interface VendorSidebarProps {
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export const VendorSidebar = ({ mobileOpen, onCloseMobile }: VendorSidebarProps) => {
    const location = useLocation();
    const { logout } = useAuth();
    const { store, orders, products } = useVendor();

    const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
        { label: "Products", icon: Package, path: "/vendor/products" },
        { label: "Add Product", icon: PlusCircle, path: "/vendor/products/new" },
        { label: "Categories", icon: FolderTree, path: "/vendor/categories" },
        {
            label: "Inventory",
            icon: Boxes,
            path: "/vendor/inventory",
            badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
            badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
        },
        {
            label: "Orders",
            icon: ShoppingBag,
            path: "/vendor/orders",
            badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
            badgeColor: "bg-emerald-500 text-white animate-pulse",
        },
        { label: "Deals & Offers", icon: Tag, path: "/vendor/deals" },
        { label: "Customers", icon: Users, path: "/vendor/customers" },
        { label: "Sales & Analytics", icon: BarChart3, path: "/vendor/analytics" },
        { label: "Store Settings", icon: Store, path: "/vendor/settings" },
        { label: "Profile", icon: UserCheck, path: "/vendor/profile" },
    ];

    const isPathActive = (path: string) => {
        if (path === "/vendor/products/new") {
            return location.pathname === "/vendor/products/new";
        }
        if (path === "/vendor/products") {
            return location.pathname === "/vendor/products" || location.pathname.startsWith("/vendor/products/edit");
        }
        return location.pathname === path;
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#111C15] text-zinc-100 border-r border-emerald-950/60 shadow-xl select-none">
            {/* ── Brand Header ───────────────────────────────────────────── */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <Link to="/vendor/dashboard" className="flex items-center gap-3 group" onClick={onCloseMobile}>
                    <div className="size-10 rounded-2xl bg-gradient-to-br from-app-orange to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-900/30 group-hover:scale-105 transition-transform">
                        <Bike className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-lg text-white tracking-tight">Pasalmandu</span>
                        </div>
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Merchant Portal
                        </span>
                    </div>
                </Link>

                {/* Close mobile button */}
                <button
                    onClick={onCloseMobile}
                    className="md:hidden p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                >
                    <X className="size-5" />
                </button>
            </div>

            {/* ── Navigation Links ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
                    Store Management
                </div>

                {navItems.map((item) => {
                    const active = isPathActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onCloseMobile}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${active
                                    ? "bg-emerald-600/30 text-white font-semibold border border-emerald-500/40 shadow-inner"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    className={`size-4.5 transition-colors ${active
                                            ? "text-app-orange"
                                            : "text-zinc-400 group-hover:text-emerald-400"
                                        }`}
                                />
                                <span className="truncate">{item.label}</span>
                            </div>

                            {item.badge && (
                                <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || "bg-emerald-500 text-white"
                                        }`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* ── Store Info Mini-Card ─────────────────────────────────────── */}
            <div className="p-3 border-t border-white/10 space-y-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="size-2 rounded-full shrink-0 animate-ping"
                                style={{ backgroundColor: store.isOpen ? "#10B981" : "#EF4444" }}
                            />
                            <p className="text-xs font-bold text-white truncate">{store.storeName}</p>
                        </div>
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${store.isOpen
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                                }`}
                        >
                            {store.isOpen ? "Open" : "Closed"}
                        </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate">{store.city} • {store.ward}</p>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <Link
                            to="/"
                            target="_blank"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                        >
                            <span>Customer View</span>
                            <ExternalLink className="size-3" />
                        </Link>

                        <Link
                            to="/vendor/settings"
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            Settings
                        </Link>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={() => {
                        logout();
                        window.location.href = "/vendor/login";
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                    <LogOut className="size-4" />
                    <span>Log Out of Vendor</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Fixed Sidebar */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 fixed inset-y-0 left-0 z-30">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
                    onClick={onCloseMobile}
                />
            )}

            {/* Mobile Drawer Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebarContent}
            </div>
        </>
    );
};
