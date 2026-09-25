import { useState, useMemo } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    AlertTriangle,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { ConfirmModal } from "../../components/vendor/common";
import { ProductFormModal } from "../../components/vendor/products/ProductFormModal";
import { categoriesData } from "../../assets/assets";
import type { VendorProduct } from "../../types/vendor";

export const VendorProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus } = useVendor();

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "low-stock" | "out-of-stock">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

    // Modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<VendorProduct | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Search query
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());

            // Category
            const matchesCategory =
                categoryFilter === "all" || product.category === categoryFilter;

            // Stock filter
            let matchesStock = true;
            if (stockFilter === "low-stock") {
                matchesStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
            } else if (stockFilter === "in-stock") {
                matchesStock = product.stock > product.lowStockThreshold;
            } else if (stockFilter === "out-of-stock") {
                matchesStock = product.stock === 0;
            }

            // Status filter
            let matchesStatus = true;
            if (statusFilter === "active") matchesStatus = product.isActive;
            if (statusFilter === "disabled") matchesStatus = !product.isActive;

            return matchesSearch && matchesCategory && matchesStock && matchesStatus;
        });
    }, [products, searchQuery, categoryFilter, stockFilter, statusFilter]);

    // Pagination slice
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenEdit = (p: VendorProduct) => {
        setEditingProduct(p);
        setIsFormModalOpen(true);
    };

    const handleSaveProduct = (productData: Omit<VendorProduct, "id" | "createdAt" | "salesCount" | "rating">) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        setIsFormModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            {/* ── Top Header Bar ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Product Catalog ({products.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Manage grocery items, stock prices, discounts, and customer visibility
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setIsFormModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="size-4" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* ── Filters & Search ───────────────────────────────────────── */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by name or SKU..."
                            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-zinc-700"
                        >
                            <option value="all">All Categories</option>
                            {categoriesData.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stock Status */}
                    <div>
                        <select
                            value={stockFilter}
                            onChange={(e) => {
                                setStockFilter(e.target.value as any);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-zinc-700"
                        >
                            <option value="all">All Stock Statuses</option>
                            <option value="in-stock">In Stock (Healthy)</option>
                            <option value="low-stock">Low Stock (Alert)</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                    </div>

                    {/* Active/Disabled */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as any);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-zinc-700"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active (Visible)</option>
                            <option value="disabled">Disabled (Hidden)</option>
                        </select>
                    </div>
                </div>

                {/* Filter summary */}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
                    <span>
                        Showing {paginatedProducts.length} of {filteredProducts.length} matching products
                    </span>
                    {(searchQuery || categoryFilter !== "all" || stockFilter !== "all" || statusFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setCategoryFilter("all");
                                setStockFilter("all");
                                setStatusFilter("all");
                                setCurrentPage(1);
                            }}
                            className="text-app-orange hover:underline font-semibold"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* ── Products Table ─────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Product & Details</th>
                                <th className="py-3.5 px-4">Category</th>
                                <th className="py-3.5 px-4">Price & Discount</th>
                                <th className="py-3.5 px-4">Inventory Stock</th>
                                <th className="py-3.5 px-4">Customer Visibility</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 text-xs sm:text-sm">
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                                        <Package className="size-10 mx-auto text-zinc-300 mb-2" />
                                        <p className="font-bold text-sm text-zinc-700">No products found</p>
                                        <p className="text-xs mt-1">Try adjusting your filters or add a new product.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((p) => {
                                    const finalPrice = Math.round(p.price * (1 - (p.discountPercent || 0) / 100));
                                    const isLowStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
                                    const isOutOfStock = p.stock === 0;

                                    return (
                                        <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                                            {/* Product info */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="size-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-zinc-900 leading-snug">
                                                                {p.name}
                                                            </p>
                                                            {p.isOrganic && (
                                                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                                                                    Organic
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                                            SKU: {p.sku} • {p.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-4">
                                                <span className="capitalize text-zinc-600 font-medium">
                                                    {p.category.replace("-", " ")}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-4">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-zinc-900">
                                                        Rs. {finalPrice.toLocaleString()}
                                                    </p>
                                                    {p.discountPercent > 0 && (
                                                        <div className="flex items-center gap-1.5 text-[11px]">
                                                            <span className="line-through text-zinc-400">
                                                                Rs. {p.price}
                                                            </span>
                                                            <span className="font-bold text-app-orange">
                                                                {p.discountPercent}% OFF
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`font-bold ${
                                                            isOutOfStock
                                                                ? "text-rose-600"
                                                                : isLowStock
                                                                ? "text-amber-600"
                                                                : "text-zinc-800"
                                                        }`}
                                                    >
                                                        {p.stock} {p.unit}
                                                    </span>

                                                    {isOutOfStock ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full">
                                                            Out of Stock
                                                        </span>
                                                    ) : isLowStock ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                                                            <AlertTriangle className="size-3" />
                                                            Low
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>

                                            {/* Visibility Toggle */}
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => toggleProductStatus(p.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                                                        p.isActive
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                            : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200"
                                                    }`}
                                                >
                                                    {p.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                                                    <span>{p.isActive ? "Active" : "Disabled"}</span>
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEdit(p)}
                                                        className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleteTarget(p)}
                                                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Add/Edit Modal */}
            <ProductFormModal
                isOpen={isFormModalOpen}
                product={editingProduct}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingProduct(null);
                }}
                onSave={handleSaveProduct}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Product from Store?"
                message={`Are you sure you want to remove "${deleteTarget?.name}" from your catalog? This will delete its listing and inventory records.`}
                confirmText="Yes, Delete Product"
                isDanger={true}
                onConfirm={() => {
                    if (deleteTarget) deleteProduct(deleteTarget.id);
                }}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default VendorProducts;
