import { dummyProducts } from "../assets/assets";
import type { WeeklyDealSchedule } from "../types/deals";
import type { Product } from "../types";

/**
 * Curated 5-week rotating deals schedule.
 * Each week features exactly 7 distinct products.
 * No products repeat between adjacent weeks (zero overlap across all 5 weeks).
 *
 * This structured data is ready to be loaded from or replaced by a backend API / Admin Panel.
 */

// Helper to enhance a catalog product with weekly deal pricing & discount
function createWeeklyDealProduct(
    product: Product,
    dealDiscountPercent: number
): Product {
    const originalPrice = product.originalPrice || Math.round(product.price * 1.3);
    const discountedPrice = Math.round(originalPrice * (1 - dealDiscountPercent / 100));

    return {
        ...product,
        originalPrice: originalPrice,
        price: discountedPrice,
        discount: dealDiscountPercent,
    };
}

export const weeklyDealsSchedules: WeeklyDealSchedule[] = [
    {
        weekIndex: 1,
        title: "Breakfast & Morning Bakery Essentials",
        subtitle: "Kickstart your mornings with buttery croissants, wholesome breads, farm eggs, and energizing grains at up to 30% OFF.",
        badge: "Week 1 Special Selection",
        products: [
            createWeeklyDealProduct(dummyProducts[0], 25), // Butter Croissant 100g
            createWeeklyDealProduct(dummyProducts[1], 20), // Organic Quinoa 500g
            createWeeklyDealProduct(dummyProducts[2], 22), // Brown Bread 400g
            createWeeklyDealProduct(dummyProducts[3], 18), // Barley 1kg
            createWeeklyDealProduct(dummyProducts[4], 25), // Knorr Cup Soup 70g
            createWeeklyDealProduct(dummyProducts[5], 20), // Maggi Noodles 280g
            createWeeklyDealProduct(dummyProducts[6], 28), // Sprite 1.5L
        ],
    },
    {
        weekIndex: 2,
        title: "Farm Harvest & Kitchen Staples",
        subtitle: "Stock up your kitchen with aromatic basmati rice, crisp carrots, ripe bananas, farm eggs, and daily greens at huge discounts.",
        badge: "Week 2 Mega Harvest",
        products: [
            createWeeklyDealProduct(dummyProducts[7], 30), // Carrot 500g
            createWeeklyDealProduct(dummyProducts[8], 20), // Coca-Cola 1.5L
            createWeeklyDealProduct(dummyProducts[9], 22), // Brown Rice 1kg
            createWeeklyDealProduct(dummyProducts[10], 25), // Eggs 12 pcs
            createWeeklyDealProduct(dummyProducts[11], 20), // Banana 1 kg
            createWeeklyDealProduct(dummyProducts[12], 18), // Basmati Rice 5kg
            createWeeklyDealProduct(dummyProducts[13], 24), // Onion 500g
        ],
    },
    {
        weekIndex: 3,
        title: "Fresh Market Greens, Fruits & Dairy",
        subtitle: "Fresh organic spinach, sweet oranges, vineyard grapes, rich dairy paneer, and family beverages with refreshing discounts.",
        badge: "Week 3 Market Picks",
        products: [
            createWeeklyDealProduct(dummyProducts[14], 22), // 7 Up 1.5L
            createWeeklyDealProduct(dummyProducts[15], 35), // Spinach 500g
            createWeeklyDealProduct(dummyProducts[16], 25), // Orange 1 kg
            createWeeklyDealProduct(dummyProducts[17], 15), // Wheat Flour 5kg
            createWeeklyDealProduct(dummyProducts[18], 28), // Grapes 500g
            createWeeklyDealProduct(dummyProducts[19], 20), // Fanta 1.5L
            createWeeklyDealProduct(dummyProducts[20], 22), // Paneer 200g
        ],
    },
    {
        weekIndex: 4,
        title: "Protein Feast, Seafood & Crunchy Treats",
        subtitle: "Prime chicken breast, pink salmon fillet, juicy mutton curry cuts, roasted almonds, and gourmet snack bites.",
        badge: "Week 4 Protein & Treats",
        products: [
            createWeeklyDealProduct(dummyProducts[31], 25), // Fresh Chicken Breast 500g
            createWeeklyDealProduct(dummyProducts[32], 20), // Fresh Salmon Fillet 250g
            createWeeklyDealProduct(dummyProducts[33], 18), // Mutton Curry Cut 500g
            createWeeklyDealProduct(dummyProducts[34], 22), // Fresh River Rohu Fish 500g
            createWeeklyDealProduct(dummyProducts[35], 25), // Roasted California Almonds 200g
            createWeeklyDealProduct(dummyProducts[36], 30), // Crispy Masala Potato Chips 150g
            createWeeklyDealProduct(dummyProducts[37], 24), // Dark Chocolate Nut Clusters 100g
        ],
    },
    {
        weekIndex: 5,
        title: "Gourmet Frozen Delights & Botanical Care",
        subtitle: "Himalayan veg momos, crispy golden fries, tender sweet corn, soothing aloe vera, and purifying herbal skincare.",
        badge: "Week 5 Pure Delights",
        products: [
            createWeeklyDealProduct(dummyProducts[38], 22), // Multigrain Baked Crackers 200g
            createWeeklyDealProduct(dummyProducts[39], 25), // Frozen Sweet Green Peas 500g
            createWeeklyDealProduct(dummyProducts[40], 30), // Himalayan Veg Momos (12 Pcs)
            createWeeklyDealProduct(dummyProducts[41], 28), // Crispy French Fries 400g
            createWeeklyDealProduct(dummyProducts[42], 20), // Frozen Sweet Corn 500g
            createWeeklyDealProduct(dummyProducts[27], 25), // Organic Aloe Vera Gel 200ml
            createWeeklyDealProduct(dummyProducts[28], 24), // Herbal Neem Face Wash 150ml
        ],
    },
];
