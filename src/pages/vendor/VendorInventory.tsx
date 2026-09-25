import { useState } from "react";
import {
    Boxes,
    Search,
    AlertTriangle,
    Plus,
    Minus,
    Save,
    RotateCcw,
    TrendingUp,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { StatusBadge } from "../../components/vendor/common";

export const VendorInventory = () => {
    const { products, updateStock } = useVendor();

    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "healthy">("all");

    // Local edits buffer before committing or instant commit
    const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});

    const handleDraftChange = (id: string, value: number) => {
        setStockDrafts((prev) => ({
            ...prev,
            [id]: Math.max(0, value),
        }));
    };

    const handleSaveSingle = (id: string) => {
        if (stockDrafts[id] !== undefined) {
            updateStock(id, stockDrafts[id]);
            setStockDrafts((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    const handleQuickAdjust = (id: string, delta: number, currentStock: number) => {
        const currentVal = stockDrafts[id] !== undefined ? stockDrafts[id] : currentStock;
        const nextVal = Math.max(0, currentVal + delta);
        handleDraftChange(id, nextVal);
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesStock = true;
        if (stockFilter === "low") {
            matchesStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
        } else if (stockFilter === "out") {
            matchesStock = p.stock === 0;
        } else if (stockFilter === "healthy") {
            matchesStock = p.stock > p.lowStockThreshold;
        }

        return matchesSearch && matchesStock;
    });

    const lowStockTotal = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStockTotal = products.filter((p) => p.stock === 0).length;
    const healthyTotal = products.filter((p) => p.stock > p.lowStockThreshold).length;

    return (
        <div className="space-y-6">
            {/* ── Top Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Live Inventory Management
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Quickly adjust shelf quantities, replenish stock, and prevent order stockouts
                    </p>
                </div>

                {/* Status KPI pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setStockFilter("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            stockFilter === "all"
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                        }`}
                    >
                        All ({products.length})
                    </button>
                    <button
                        onClick={() => setStockFilter("low")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            stockFilter === "low"
                                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                        }`}
                    >
                        <AlertTriangle className="size-3.5" />
                        <span>Low Stock ({lowStockTotal})</span>
                    </button>
                    <button
                        onClick={() => setStockFilter("out")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            stockFilter === "out"
                                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                        }`}
                    >
                        Out of Stock ({outOfStockTotal})
                    </button>
                    <button
                        onClick={() => setStockFilter("healthy")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            stockFilter === "healthy"
                                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        }`}
                    >
                        Healthy ({healthyTotal})
                    </button>
                </div>
            </div>

            {/* ── Search Bar ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-3 border border-zinc-200/80 shadow-xs flex items-center gap-3">
                <Search className="size-4 text-zinc-400 ml-2" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Quick search products to update stock..."
                    className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-zinc-400 hover:text-zinc-700 px-2"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* ── Inventory Quick-Edit Table ─────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Product</th>
                                <th className="py-3.5 px-4">Price</th>
                                <th className="py-3.5 px-4">Sold Quantity</th>
                                <th className="py-3.5 px-4">Stock Status</th>
                                <th className="py-3.5 px-4 text-center">Quick Stock Adjustment</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 text-xs sm:text-sm">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                                        <Boxes className="size-10 mx-auto text-zinc-300 mb-2" />
                                        <p className="font-bold text-sm text-zinc-700">No inventory items matched</p>
                                        <p className="text-xs mt-1">Try resetting the filter or clear your search term.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => {
                                    const draftVal = stockDrafts[p.id];
                                    const currentDisplayStock = draftVal !== undefined ? draftVal : p.stock;
                                    const isDirty = draftVal !== undefined && draftVal !== p.stock;

                                    const isLowStock =
                                        currentDisplayStock > 0 && currentDisplayStock <= p.lowStockThreshold;
                                    const isOutOfStock = currentDisplayStock === 0;

                                    return (
                                        <tr
                                            key={p.id}
                                            className={`transition-colors ${
                                                isDirty ? "bg-amber-50/30" : "hover:bg-zinc-50/60"
                                            }`}
                                        >
                                            {/* Product */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="size-11 rounded-xl object-cover border border-zinc-200 shrink-0"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-zinc-900 leading-snug">
                                                            {p.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                                            {p.sku} • {p.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-4 font-bold text-zinc-900">
                                                Rs. {p.price}
                                                <span className="text-zinc-400 font-normal text-xs block">
                                                    /{p.unit}
                                                </span>
                                            </td>

                                            {/* Sold */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5 text-zinc-700 font-semibold">
                                                    <TrendingUp className="size-3.5 text-emerald-600" />
                                                    <span>{p.salesCount} sold</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4">
                                                {isOutOfStock ? (
                                                    <StatusBadge status="Out of Stock" size="sm" />
                                                ) : isLowStock ? (
                                                    <StatusBadge status="Low Stock" size="sm" />
                                                ) : (
                                                    <StatusBadge status="In Stock" size="sm" />
                                                )}
                                                {isLowStock && (
                                                    <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                                                        Threshold: ≤ {p.lowStockThreshold}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Quick Stock Controls */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleQuickAdjust(p.id, -5, p.stock)}
                                                        className="size-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600"
                                                        title="-5 units"
                                                    >
                                                        -5
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickAdjust(p.id, -1, p.stock)}
                                                        className="size-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600"
                                                        title="-1 unit"
                                                    >
                                                        <Minus className="size-3.5" />
                                                    </button>

                                                    {/* Direct editable input */}
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={currentDisplayStock}
                                                        onChange={(e) =>
                                                            handleDraftChange(p.id, Number(e.target.value))
                                                        }
                                                        className={`w-16 text-center py-1 text-xs font-bold rounded-lg border transition-all ${
                                                            isDirty
                                                                ? "border-amber-400 bg-amber-50 ring-2 ring-amber-100 text-amber-900"
                                                                : "border-zinc-300 bg-white text-zinc-900"
                                                        }`}
                                                    />

                                                    <button
                                                        onClick={() => handleQuickAdjust(p.id, 1, p.stock)}
                                                        className="size-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600"
                                                        title="+1 unit"
                                                    >
                                                        <Plus className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickAdjust(p.id, 10, p.stock)}
                                                        className="size-7 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600"
                                                        title="+10 units"
                                                    >
                                                        +10
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                {isDirty ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleSaveSingle(p.id)}
                                                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95"
                                                        >
                                                            <Save className="size-3.5" />
                                                            <span>Save</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setStockDrafts((prev) => {
                                                                    const next = { ...prev };
                                                                    delete next[p.id];
                                                                    return next;
                                                                });
                                                            }}
                                                            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                                                            title="Discard changes"
                                                        >
                                                            <RotateCcw className="size-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 font-medium">
                                                        Synced
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorInventory;
