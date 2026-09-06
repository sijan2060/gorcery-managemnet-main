import { useState } from "react";
import type { Product } from "../../types";
import { dummyProducts } from "../../assets/assets";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";

const PopularProduct = () => {
    const [products] = useState<Product[]>(() => dummyProducts.slice(0, 20));

    return (
        <section className="pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold">Popular Products</h2>
                        <p className="text-sm text-app-text-light">Discover our most popular products</p>
                    </div>

                    <Link
                        to="/products"
                        className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
                    >
                        Show All <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularProduct;
