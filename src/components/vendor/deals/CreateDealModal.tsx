import { useState } from "react";
import { X, Tag, Check } from "lucide-react";
import type { VendorDeal, VendorProduct } from "../../../types/vendor";

interface CreateDealModalProps {
    isOpen: boolean;
    products: VendorProduct[];
    onClose: () => void;
    onSave: (dealData: Omit<VendorDeal, "id" | "usageCount">) => void;
}

export const CreateDealModal = ({
    isOpen,
    products,
    onClose,
    onSave,
}: CreateDealModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [discountValue, setDiscountValue] = useState<number | "">(10);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    const [isWeeklyDeal, setIsWeeklyDeal] = useState(false);
    const [isActive, setIsActive] = useState(true);

    if (!isOpen) return null;

    const toggleProductSelect = (id: string) => {
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedProductIds.length === products.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(products.map((p) => p.id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || selectedProductIds.length === 0) return;

        onSave({
            title: title.trim(),
            description: description.trim(),
            discountType,
            discountValue: Number(discountValue) || 0,
            productIds: selectedProductIds,
            startDate,
            endDate,
            isWeeklyDeal,
            isActive,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-slide-in-up my-auto">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-orange-100 text-app-orange flex items-center justify-center shrink-0">
                            <Tag className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">Create Store Discount Offer</h2>
                            <p className="text-xs text-zinc-500">
                                Attract more orders with targeted seasonal discounts
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {/* Offer Title */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                            Offer Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 15% Off Organic Himalayan Green Produce"
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                            Short Customer Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Valid for fresh seasonal greens and fruits this weekend only."
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Discount Type
                            </label>
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="percentage">Percentage Discount (%)</option>
                                <option value="fixed">Fixed Amount Discount (Rs.)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Discount Value *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={discountType === "percentage" ? 90 : 5000}
                                required
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder={discountType === "percentage" ? "15" : "50"}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                End Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                Select Applicable Products ({selectedProductIds.length} selected) *
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs text-app-orange hover:underline font-semibold"
                            >
                                {selectedProductIds.length === products.length ? "Deselect All" : "Select All Products"}
                            </button>
                        </div>

                        <div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-2xl divide-y divide-zinc-100 p-1">
                            {products.map((p) => {
                                const isSelected = selectedProductIds.includes(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => toggleProductSelect(p.id)}
                                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                                            isSelected ? "bg-orange-50/70" : "hover:bg-zinc-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`size-5 rounded-md border flex items-center justify-center transition-colors ${
                                                    isSelected
                                                        ? "bg-app-orange border-app-orange text-white"
                                                        : "border-zinc-300 bg-white"
                                                }`}
                                            >
                                                {isSelected && <Check className="size-3 stroke-[3]" />}
                                            </div>
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="size-8 rounded-lg object-cover border border-zinc-200"
                                            />
                                            <span className="text-xs font-semibold text-zinc-800 line-clamp-1">
                                                {p.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-zinc-500">
                                            Rs. {p.price}/{p.unit}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly Deal & Active Toggles */}
                    <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                            <input
                                type="checkbox"
                                checked={isWeeklyDeal}
                                onChange={(e) => setIsWeeklyDeal(e.target.checked)}
                                className="rounded text-app-orange focus:ring-app-orange size-4"
                            />
                            <span>Feature in &quot;Weekly Deals&quot; Section</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 size-4"
                            />
                            <span>Active Immediately</span>
                        </label>
                    </div>

                    {/* Footer / Submit */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={selectedProductIds.length === 0}
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-app-orange hover:bg-app-orange-dark shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            Launch Deal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
