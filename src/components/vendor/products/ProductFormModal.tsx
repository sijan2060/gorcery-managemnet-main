import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import type { VendorProduct } from "../../../types/vendor";
import { categoriesData } from "../../../assets/assets";

interface ProductFormModalProps {
    isOpen: boolean;
    product?: VendorProduct | null;
    onClose: () => void;
    onSave: (productData: Omit<VendorProduct, "id" | "createdAt" | "salesCount" | "rating">) => void;
}

// Preset grocery demo images for quick selection
const sampleProductImages = [
    {
        label: "Green Spinach",
        url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Red Potatoes",
        url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Fresh Paneer",
        url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Sourdough Bread",
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Raw Honey",
        url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Mustard Oil",
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Organic Apples",
        url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",
    },
    {
        label: "Country Eggs",
        url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80",
    },
];

export const ProductFormModal = ({ isOpen, product, onClose, onSave }: ProductFormModalProps) => {
    const isEdit = !!product;

    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [category, setCategory] = useState("fruits-vegetables");
    const [price, setPrice] = useState<number | "">("");
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [stock, setStock] = useState<number | "">("");
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
    const [unit, setUnit] = useState("kg");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isOrganic, setIsOrganic] = useState(true);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setSku(product.sku);
            setCategory(product.category);
            setPrice(product.price);
            setDiscountPercent(product.discountPercent || 0);
            setStock(product.stock);
            setLowStockThreshold(product.lowStockThreshold || 10);
            setUnit(product.unit);
            setDescription(product.description);
            setImage(product.image);
            setIsOrganic(product.isOrganic);
            setIsActive(product.isActive);
        } else {
            setName("");
            setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
            setCategory("fruits-vegetables");
            setPrice("");
            setDiscountPercent(0);
            setStock("");
            setLowStockThreshold(10);
            setUnit("kg");
            setDescription("");
            setImage(sampleProductImages[0].url);
            setIsOrganic(true);
            setIsActive(true);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const numPrice = Number(price) || 0;
    const finalPrice = Math.round(numPrice * (1 - discountPercent / 100));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
            category,
            price: numPrice,
            discountPercent: Number(discountPercent) || 0,
            stock: Number(stock) || 0,
            lowStockThreshold: Number(lowStockThreshold) || 10,
            unit,
            description: description.trim(),
            image: image || sampleProductImages[0].url,
            isOrganic,
            isActive,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-slide-in-up my-auto">
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">
                            {isEdit ? "Edit Store Product" : "Add New Store Product"}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {isEdit
                                ? `Update details and inventory for SKU ${product?.sku}`
                                : "Fill in product information to list it on your store counter"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Local Organic Cauliflower (Gobi)"
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    SKU / Barcode
                                </label>
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="e.g. VEG-GOB-01"
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        {/* Category & Unit */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Category *
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    {categoriesData.map((c) => (
                                        <option key={c.slug} value={c.slug}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Measurement Unit *
                                </label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="kg">kg (Kilogram)</option>
                                    <option value="500g">500 grams</option>
                                    <option value="250g">250 grams</option>
                                    <option value="bundle">bundle (Muthha)</option>
                                    <option value="piece">piece (Gota)</option>
                                    <option value="loaf">loaf (Bread)</option>
                                    <option value="1L">1 Liter</option>
                                    <option value="500ml">500 ml</option>
                                    <option value="pack">packet</option>
                                    <option value="crate (12 pcs)">crate (12 eggs)</option>
                                </select>
                            </div>
                        </div>

                        {/* Pricing & Discounts */}
                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                                        Retail Price (Rs.) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="120"
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-zinc-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-emerald-800 mb-1">
                                        Final Customer Price
                                    </label>
                                    <div className="px-4 py-2.5 text-sm bg-emerald-100/80 border border-emerald-200 rounded-xl font-bold text-emerald-950">
                                        Rs. {finalPrice.toLocaleString()} / {unit}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Quantities */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Stock Quantity in Shop *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="e.g. 25"
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                    Low-Stock Alert Level
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={lowStockThreshold}
                                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                                    placeholder="10"
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Product Description
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the origin, freshness, taste or packaging..."
                                className="w-full px-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        {/* Image URL & Quick Picker */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                                Product Image URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-4 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                                {image && (
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="size-10 rounded-xl object-cover border border-zinc-200"
                                    />
                                )}
                            </div>

                            {/* Preset Pickers */}
                            <div>
                                <p className="text-[11px] text-zinc-500 mb-1">
                                    Or pick from standard grocery library:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sampleProductImages.map((sample, idx) => (
                                        <button
                                            type="button"
                                            key={idx}
                                            onClick={() => setImage(sample.url)}
                                            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                                                image === sample.url
                                                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                                                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                            }`}
                                        >
                                            {image === sample.url && <Check className="size-3" />}
                                            <span>{sample.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Flags */}
                        <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={isOrganic}
                                    onChange={(e) => setIsOrganic(e.target.checked)}
                                    className="rounded text-emerald-600 focus:ring-emerald-500 size-4"
                                />
                                <span>Certified Organic Produce</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="rounded text-app-orange focus:ring-app-orange size-4"
                                />
                                <span>Visible & Active for Customers</span>
                            </label>
                        </div>
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
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-app-green hover:bg-emerald-900 shadow-md transition-all active:scale-95"
                        >
                            {isEdit ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
