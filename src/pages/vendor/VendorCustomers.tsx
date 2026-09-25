import { useState } from "react";
import { Search, Phone, MapPin, ShoppingBag } from "lucide-react";
import { useVendor } from "../../context/VendorContext";

export const VendorCustomers = () => {
    const { customers } = useVendor();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRepeat = customers.filter((c) => c.totalOrders > 1).length;
    const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Store Customers ({customers.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Neighborhood households and repeat grocery buyers in your delivery zone
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by customer name or phone..."
                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Total Buyers
                    </p>
                    <p className="text-2xl font-bold text-zinc-900">{customers.length} Customers</p>
                    <p className="text-[11px] text-zinc-500">In Kathmandu & Patan</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Repeat Order Rate
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                        {Math.round((totalRepeat / (customers.length || 1)) * 100)}%
                    </p>
                    <p className="text-[11px] text-zinc-500">{totalRepeat} customers ordered 2+ times</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Cumulative Spending
                    </p>
                    <p className="text-2xl font-bold text-app-orange">
                        Rs. {totalSpentAll.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-500">Across all fulfilled customer bags</p>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Customer</th>
                                <th className="py-3.5 px-4">Phone / Contact</th>
                                <th className="py-3.5 px-4">Neighborhood Location</th>
                                <th className="py-3.5 px-4">Order Frequency</th>
                                <th className="py-3.5 px-4">Total Spending</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Last Order</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100 text-xs sm:text-sm">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-zinc-400">
                                        No matching customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((c) => (
                                    <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900">{c.name}</p>
                                                    <p className="text-xs text-zinc-400">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <a
                                                href={`tel:${c.phone}`}
                                                className="text-app-orange hover:underline font-mono text-xs flex items-center gap-1.5"
                                            >
                                                <Phone className="size-3" />
                                                <span>{c.phone}</span>
                                            </a>
                                        </td>

                                        <td className="py-4 px-4 text-zinc-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3 text-zinc-400" />
                                                <span>{c.city}</span>
                                            </span>
                                        </td>

                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                <ShoppingBag className="size-3" />
                                                <span>{c.totalOrders} orders</span>
                                            </span>
                                        </td>

                                        <td className="py-4 px-4 font-bold text-zinc-900">
                                            Rs. {c.totalSpent.toLocaleString()}
                                        </td>

                                        <td className="py-4 px-4 sm:px-6 text-right text-zinc-500 font-mono text-xs">
                                            {c.lastOrderDate}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorCustomers;
