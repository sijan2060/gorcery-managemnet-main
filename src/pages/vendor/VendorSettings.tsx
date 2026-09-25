import { useState } from "react";
import {
    Store,
    Clock,
    Truck,
    MapPin,
    Save,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import type { StoreSettings, StoreHours } from "../../types/vendor";

export const VendorSettings = () => {
    const { store, updateStoreSettings } = useVendor();

    // Local state initialized with current store settings
    const [form, setForm] = useState<StoreSettings>(store);

    const handleFieldChange = (field: keyof StoreSettings, value: any) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDeliveryChange = (field: keyof StoreSettings["deliverySettings"], value: any) => {
        setForm((prev) => ({
            ...prev,
            deliverySettings: {
                ...prev.deliverySettings,
                [field]: value,
            },
        }));
    };

    const handleHourChange = (dayIndex: number, field: keyof StoreHours, value: any) => {
        const updatedHours = [...form.openingHours];
        updatedHours[dayIndex] = {
            ...updatedHours[dayIndex],
            [field]: value,
        };
        setForm((prev) => ({
            ...prev,
            openingHours: updatedHours,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateStoreSettings(form);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                    Store Settings & Configuration
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500">
                    Control your storefront branding, delivery logistics, operational schedule, and open/closed status
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── 1. STORE STATUS & IDENTITY ─────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                                <Store className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-zinc-900">
                                    Storefront Profile & Status
                                </h3>
                                <p className="text-xs text-zinc-500">Basic merchant store information</p>
                            </div>
                        </div>

                        {/* Store Open / Closed Toggle Switch */}
                        <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-2xl border border-zinc-200/80">
                            <span className="text-xs font-bold text-zinc-700">
                                Status: {form.isOpen ? "Open" : "Closed"}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleFieldChange("isOpen", !form.isOpen)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    form.isOpen ? "bg-emerald-600" : "bg-zinc-300"
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                        form.isOpen ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Store Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.storeName}
                                onChange={(e) => handleFieldChange("storeName", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Primary Category
                            </label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) => handleFieldChange("category", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                            Store Description (Shown to Customers)
                        </label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Logo & Banner URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                                Store Logo URL
                            </label>
                            <div className="flex items-center gap-3">
                                <img
                                    src={form.logoUrl}
                                    alt="Logo preview"
                                    className="size-12 rounded-2xl object-cover border border-zinc-200 shrink-0"
                                />
                                <input
                                    type="url"
                                    value={form.logoUrl}
                                    onChange={(e) => handleFieldChange("logoUrl", e.target.value)}
                                    className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                                Store Banner Cover Image URL
                            </label>
                            <div className="flex items-center gap-3">
                                <img
                                    src={form.bannerUrl}
                                    alt="Banner preview"
                                    className="w-20 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                                />
                                <input
                                    type="url"
                                    value={form.bannerUrl}
                                    onChange={(e) => handleFieldChange("bannerUrl", e.target.value)}
                                    className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. CONTACT & ADDRESS ──────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                        <div className="size-10 rounded-2xl bg-orange-50 text-app-orange flex items-center justify-center shrink-0">
                            <MapPin className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-900">
                                Contact & Store Location
                            </h3>
                            <p className="text-xs text-zinc-500">Address where courier riders arrive for order collection</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Phone Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.phone}
                                onChange={(e) => handleFieldChange("phone", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Store Support Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => handleFieldChange("email", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Physical Street Address & Landmark *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.address}
                                onChange={(e) => handleFieldChange("address", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                City
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => handleFieldChange("city", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Ward Number
                            </label>
                            <input
                                type="text"
                                value={form.ward}
                                onChange={(e) => handleFieldChange("ward", e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ── 3. OPERATING HOURS ─────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                        <div className="size-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-900">
                                Operational Opening Hours
                            </h3>
                            <p className="text-xs text-zinc-500">Orders will only be routed to your store during active opening windows</p>
                        </div>
                    </div>

                    <div className="space-y-2 divide-y divide-zinc-100">
                        {form.openingHours.map((h, idx) => (
                            <div
                                key={h.day}
                                className="pt-2.5 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                            >
                                <span className="font-bold text-zinc-800 w-28">{h.day}</span>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600">
                                        <input
                                            type="checkbox"
                                            checked={h.isClosed}
                                            onChange={(e) =>
                                                handleHourChange(idx, "isClosed", e.target.checked)
                                            }
                                            className="rounded text-rose-600 focus:ring-rose-500"
                                        />
                                        <span>Closed all day</span>
                                    </label>

                                    {!h.isClosed && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={h.open}
                                                onChange={(e) =>
                                                    handleHourChange(idx, "open", e.target.value)
                                                }
                                                className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
                                            />
                                            <span className="text-zinc-400">to</span>
                                            <input
                                                type="time"
                                                value={h.close}
                                                onChange={(e) =>
                                                    handleHourChange(idx, "close", e.target.value)
                                                }
                                                className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 4. DELIVERY & PACKAGING SETTINGS ───────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                        <div className="size-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                            <Truck className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-900">
                                Delivery & Preparation Parameters
                            </h3>
                            <p className="text-xs text-zinc-500">Configure logistics thresholds and customer pickup options</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Delivery Radius (km)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                step="0.5"
                                value={form.deliverySettings.deliveryRadiusKm}
                                onChange={(e) =>
                                    handleDeliveryChange("deliveryRadiusKm", Number(e.target.value))
                                }
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Free Delivery Order Min (Rs.)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="50"
                                value={form.deliverySettings.freeDeliveryMinimum}
                                onChange={(e) =>
                                    handleDeliveryChange("freeDeliveryMinimum", Number(e.target.value))
                                }
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Standard Courier Fee (Rs.)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.deliverySettings.standardDeliveryFee}
                                onChange={(e) =>
                                    handleDeliveryChange("standardDeliveryFee", Number(e.target.value))
                                }
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-6 text-xs text-zinc-700">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input
                                type="checkbox"
                                checked={form.deliverySettings.allowPickup}
                                onChange={(e) =>
                                    handleDeliveryChange("allowPickup", e.target.checked)
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500 size-4"
                            />
                            <span>Allow Customers to Pick Up at Store Counter (Takeaway)</span>
                        </label>
                    </div>
                </div>

                {/* Submit Action Bar */}
                <div className="sticky bottom-4 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-zinc-200 shadow-xl flex items-center justify-between">
                    <p className="text-xs text-zinc-500 hidden sm:block">
                        Any updates will take effect immediately across customer searches.
                    </p>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-app-green hover:bg-emerald-950 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 ml-auto sm:ml-0"
                    >
                        <Save className="size-4" />
                        <span>Save Store Settings</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorSettings;
