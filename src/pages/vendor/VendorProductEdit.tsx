import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { categoriesData } from "../../assets/assets";

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

export const VendorProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct } = useVendor();

    const isEdit = !!id;
    const existingProduct = products.find((p) => p.id === id);

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
        if (existingProduct) {
            setName(existingProduct.name);
            setSku(existingProduct.sku);
            setCategory(existingProduct.category);
            setPrice(existingProduct.price);
            setDiscountPercent(existingProduct.discountPercent || 0);
            setStock(existingProduct.stock);
            setLowStockThreshold(existingProduct.lowStockThreshold || 10);
            setUnit(existingProduct.unit);
            setDescription(existingProduct.description);
            setImage(existingProduct.image);
            setIsOrganic(existingProduct.isOrganic);
            setIsActive(existingProduct.isActive);
        } else if (!isEdit) {
            setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
            setImage(sampleProductImages[0].url);
        }
    }, [existingProduct, isEdit]);

    const numPrice = Number(price) || 0;
    const finalPrice = Math.round(numPrice * (1 - discountPercent / 100));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const productPayload = {
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
        };

        if (isEdit && id) {
            updateProduct(id, productPayload);
        } else {
            addProduct(productPayload);
        }

        navigate("/vendor/products");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                to="/vendor/products"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
                <ArrowLeft className="size-4" />
                <span>Back to Catalog</span>
            </Link>

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                    <h1 className="text-2xl font-serif text-zinc-900">
                        {isEdit ? "Edit Store Product" : "Add New Grocery Product"}
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Configure pricing, categories, packaging, and stock levels for your store shelf.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic info */}
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
                                placeholder="e.g. Tokha Farm Fresh Spinach"
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Barcode / SKU
                            </label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="e.g. VEG-SPN-01"
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
                                <option value="pack">packet</option>
                                <option value="crate (12 pcs)">crate (12 eggs)</option>
                            </select>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 mb-1">
                                    Base Price (Rs.) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="100"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-700 mb-1">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="90"
                                    value={discountPercent}
                                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-emerald-900 mb-1">
                                    Selling Price to Shopper
                                </label>
                                <div className="px-4 py-2.5 text-sm bg-emerald-100/80 border border-emerald-200 rounded-xl font-bold text-emerald-950">
                                    Rs. {finalPrice.toLocaleString()} / {unit}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock & Low Alert */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Stock In Shop *
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={stock}
                                onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="30"
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                                Low Stock Alert Threshold
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
                            placeholder="Details about origin, farm location, freshness, or recipes..."
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                            Product Image
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="size-11 rounded-xl object-cover border border-zinc-200"
                                />
                            )}
                        </div>

                        {/* Quick pickers */}
                        <div className="flex flex-wrap gap-2 pt-1">
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

                    {/* Toggles */}
                    <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                            <input
                                type="checkbox"
                                checked={isOrganic}
                                onChange={(e) => setIsOrganic(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 size-4"
                            />
                            <span>100% Certified Organic</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="rounded text-app-orange focus:ring-app-orange size-4"
                            />
                            <span>Active / Available for Customer Ordering</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                        <Link
                            to="/vendor/products"
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-app-green hover:bg-emerald-900 shadow-md transition-all active:scale-95"
                        >
                            {isEdit ? "Update Product" : "Publish Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorProductEdit;
