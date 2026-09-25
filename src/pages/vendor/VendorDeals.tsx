import { useState } from "react";
import {
    Plus,
    Calendar,
    Trash2,
    EyeOff,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { CreateDealModal } from "../../components/vendor/deals/CreateDealModal";
import { ConfirmModal } from "../../components/vendor/common";
import type { VendorDeal } from "../../types/vendor";

export const VendorDeals = () => {
    const { deals, products, addDeal, toggleDealStatus, deleteDeal } = useVendor();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [dealToDelete, setDealToDelete] = useState<VendorDeal | null>(null);

    const activeDeals = deals.filter((d) => d.isActive);
    const upcomingOrInactive = deals.filter((d) => !d.isActive);

    return (
        <div className="space-y-8">
            {/* ── Top Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Deals, Discounts & Offers ({deals.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Launch targeted flash sales and weekly deals to boost shop turnover
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
                >
                    <Plus className="size-4" />
                    <span>Create New Offer</span>
                </button>
            </div>

            {/* ── Mini Summary Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Active Campaigns
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">{activeDeals.length} Deals Live</p>
                    <p className="text-[11px] text-zinc-500">Visible to local shoppers</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Total Deal Redemptions
                    </p>
                    <p className="text-2xl font-bold text-app-orange">
                        {deals.reduce((sum, d) => sum + d.usageCount, 0)} orders
                    </p>
                    <p className="text-[11px] text-zinc-500">Brought via promotional tags</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Weekly Featured Deals
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                        {deals.filter((d) => d.isWeeklyDeal).length} Specials
                    </p>
                    <p className="text-[11px] text-zinc-500">Highlighted on customer homepage</p>
                </div>
            </div>

            {/* ── Active Deals Grid ──────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active Offers Live on Pasalmandu</span>
                    </h2>
                    <span className="text-xs text-zinc-500">{activeDeals.length} active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeDeals.length === 0 ? (
                        <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-zinc-200/80 text-zinc-400">
                            No active deals currently running. Click &quot;Create New Offer&quot; above!
                        </div>
                    ) : (
                        activeDeals.map((deal) => {
                            const dealProducts = products.filter((p) =>
                                deal.productIds.includes(p.id)
                            );

                            return (
                                <div
                                    key={deal.id}
                                    className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-app-orange border border-orange-200">
                                                        {deal.discountType === "percentage"
                                                            ? `${deal.discountValue}% OFF`
                                                            : `Rs. ${deal.discountValue} OFF`}
                                                    </span>
                                                    {deal.isWeeklyDeal && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                                            Weekly Deal
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-base text-zinc-900 leading-snug">
                                                    {deal.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-xs text-zinc-600 leading-relaxed">
                                            {deal.description}
                                        </p>

                                        {/* Date range */}
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                            <Calendar className="size-3.5 text-zinc-400" />
                                            <span>
                                                {deal.startDate} → {deal.endDate}
                                            </span>
                                        </div>

                                        {/* Products covered */}
                                        <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                                Included Products ({dealProducts.length})
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {dealProducts.slice(0, 3).map((p) => (
                                                    <span
                                                        key={p.id}
                                                        className="text-[11px] px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-lg truncate max-w-36 font-medium"
                                                    >
                                                        {p.name}
                                                    </span>
                                                ))}
                                                {dealProducts.length > 3 && (
                                                    <span className="text-[11px] text-zinc-400 px-1.5 self-center">
                                                        +{dealProducts.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action footer */}
                                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                                        <span className="text-xs text-emerald-700 font-bold">
                                            {deal.usageCount} orders redeemed
                                        </span>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => toggleDealStatus(deal.id)}
                                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                                                title="Pause / Disable Deal"
                                            >
                                                <EyeOff className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => setDealToDelete(deal)}
                                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                title="Delete Deal"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Inactive / Scheduled Deals ─────────────────────────────── */}
            {upcomingOrInactive.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <h2 className="text-base font-bold text-zinc-700">
                        Inactive / Paused Deals ({upcomingOrInactive.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {upcomingOrInactive.map((deal) => (
                            <div
                                key={deal.id}
                                className="bg-zinc-50 rounded-3xl p-5 border border-zinc-200 space-y-3 opacity-80 hover:opacity-100 transition-opacity"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-200 text-zinc-600">
                                            Paused
                                        </span>
                                        <h4 className="font-bold text-sm text-zinc-800 mt-1">{deal.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleDealStatus(deal.id)}
                                            className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                        >
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => setDealToDelete(deal)}
                                            className="p-1 text-rose-500 hover:text-rose-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500">{deal.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Deal Modal */}
            <CreateDealModal
                isOpen={isCreateOpen}
                products={products}
                onClose={() => setIsCreateOpen(false)}
                onSave={addDeal}
            />

            {/* Delete Deal Modal */}
            <ConfirmModal
                isOpen={!!dealToDelete}
                title="Delete Promotional Deal?"
                message={`Are you sure you want to remove the deal "${dealToDelete?.title}"? Any active discounts on participating products will end immediately.`}
                confirmText="Yes, Delete Deal"
                isDanger={true}
                onConfirm={() => {
                    if (dealToDelete) deleteDeal(dealToDelete.id);
                }}
                onCancel={() => setDealToDelete(null)}
            />
        </div>
    );
};

export default VendorDeals;
