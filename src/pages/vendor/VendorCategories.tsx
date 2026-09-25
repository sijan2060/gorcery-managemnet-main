import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { categoriesData } from "../../assets/assets";
import { useVendor } from "../../context/VendorContext";

export const VendorCategories = () => {
    const { products } = useVendor();

    // Calculate category distribution stats
    const categoriesWithStats = categoriesData.map((cat) => {
        const catProducts = products.filter((p) => p.category === cat.slug);
        const totalItems = catProducts.length;
        const totalStock = catProducts.reduce((sum, p) => sum + p.stock, 0);
        const totalSold = catProducts.reduce((sum, p) => sum + p.salesCount, 0);
        const totalInventoryValue = catProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

        return {
            ...cat,
            totalItems,
            totalStock,
            totalSold,
            totalInventoryValue,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                        Store Categories ({categoriesData.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Product catalog distribution and inventory volume across grocery categories
                    </p>
                </div>

                <Link
                    to="/vendor/products/new"
                    className="px-4 py-2.5 bg-app-orange hover:bg-app-orange-dark text-white font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
                >
                    <Package className="size-4" />
                    <span>Add Item to Category</span>
                </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categoriesWithStats.map((cat) => (
                    <div
                        key={cat.slug}
                        className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="size-14 rounded-2xl object-cover border border-zinc-100 group-hover:scale-105 transition-transform"
                                />
                                <span
                                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                        cat.totalItems > 0
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                                    }`}
                                >
                                    {cat.totalItems} listed
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-base text-zinc-900 group-hover:text-app-green transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Slug: <code className="text-zinc-600 font-mono">{cat.slug}</code>
                                </p>
                            </div>

                            {/* Mini stats */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-xs">
                                <div>
                                    <span className="text-zinc-400 block text-[11px]">Units in Stock</span>
                                    <span className="font-bold text-zinc-800">{cat.totalStock} units</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block text-[11px]">Total Sold</span>
                                    <span className="font-bold text-emerald-700">{cat.totalSold} sold</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-800">
                                Rs. {cat.totalInventoryValue.toLocaleString()}
                            </span>

                            <Link
                                to={`/vendor/products?category=${cat.slug}`}
                                className="text-xs font-semibold text-app-orange hover:text-app-orange-dark inline-flex items-center gap-1 transition-colors"
                            >
                                <span>Browse Items</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorCategories;
