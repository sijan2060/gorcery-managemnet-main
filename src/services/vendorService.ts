import type {
    VendorProduct,
    VendorOrder,
    VendorDeal,
    VendorCustomer,
    StoreSettings,
    VendorNotification,
    VendorAnalyticsSummary,
    SalesDataPoint,
} from "../types/vendor";

// LocalStorage Keys
const STORE_KEY = "pasalmandu_vendor_store_settings_v1";
const PRODUCTS_KEY = "pasalmandu_vendor_products_v1";
const ORDERS_KEY = "pasalmandu_vendor_orders_v1";
const DEALS_KEY = "pasalmandu_vendor_deals_v1";
const NOTIFICATIONS_KEY = "pasalmandu_vendor_notifications_v1";

// ─── Initial Seed Data ────────────────────────────────────────────────────────

const initialStoreSettings: StoreSettings = {
    storeId: "VEN-KTM-001",
    storeName: "Kathmandu Valley Organic Mart",
    ownerName: "Ramesh Shrestha",
    email: "ramesh.organic@pasalmandu.com",
    phone: "+977 9841234567",
    altPhone: "+977 01-4782910",
    address: "New Baneshwor Chowk, Devkota Sadak",
    city: "Kathmandu",
    ward: "Ward 10",
    description:
        "Kathmandu's premier local store for farm-fresh organic produce, cold-pressed oils, local Himalayan dairy, freshly ground whole spices, and daily bakery goods delivered in 15-30 minutes.",
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&auto=format&fit=crop&q=80",
    category: "Organic Farm & Produce Producer",
    panVatNumber: "602918273",
    isOpen: true,
    openingHours: [
        { day: "Sunday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Monday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Tuesday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Wednesday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Thursday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Friday", open: "06:30", close: "21:30", isClosed: false },
        { day: "Saturday", open: "07:00", close: "21:00", isClosed: false },
    ],
    deliverySettings: {
        deliveryRadiusKm: 6.5,
        freeDeliveryMinimum: 1200,
        standardDeliveryFee: 65,
        estimatedPrepTimeMinutes: 15,
        allowPickup: true,
    },
    payoutDetails: {
        bankName: "Nepal Investment Mega Bank (NIMB)",
        accountNumber: "01928374650123",
        accountHolderName: "Kathmandu Valley Organic Pvt. Ltd.",
        esewaId: "9841234567",
    },
};

const initialProducts: VendorProduct[] = [
    {
        id: "prod-001",
        name: "Fresh Palungko Saag (Spinach)",
        sku: "VEG-SPN-01",
        description: "Farm-harvested organic spinach from Tokha greenhouses. Crisp, washed and packed fresh.",
        category: "fruits-vegetables",
        price: 65,
        discountPercent: 0,
        stock: 35,
        lowStockThreshold: 10,
        unit: "bundle",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.9,
        salesCount: 142,
        createdAt: "2026-03-01T08:00:00Z",
    },
    {
        id: "prod-002",
        name: "Local Red Potatoes (Mude Aloo)",
        sku: "VEG-POT-02",
        description: "Naturally sweet and firm red potatoes grown in high-altitude soil of Mude, Sindhupalchok.",
        category: "fruits-vegetables",
        price: 85,
        discountPercent: 10,
        stock: 6, // Low stock on purpose
        lowStockThreshold: 15,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.8,
        salesCount: 220,
        createdAt: "2026-03-01T08:00:00Z",
    },
    {
        id: "prod-003",
        name: "Fresh Himalayan Cow Milk Paneer",
        sku: "DAI-PAN-03",
        description: "Freshly coagulated whole milk paneer made daily without preservatives. Soft & creamy.",
        category: "dairy-eggs",
        price: 450,
        discountPercent: 0,
        stock: 14,
        lowStockThreshold: 8,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.9,
        salesCount: 89,
        createdAt: "2026-03-02T08:00:00Z",
    },
    {
        id: "prod-004",
        name: "Artisanal Multigrain Sourdough Bread",
        sku: "BAK-SOU-04",
        description: "Naturally fermented 24-hour sourdough loaf baked fresh every morning with organic whole wheat.",
        category: "bakery",
        price: 180,
        discountPercent: 15,
        stock: 4, // Low stock on purpose
        lowStockThreshold: 6,
        unit: "loaf",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
        isOrganic: false,
        isActive: true,
        rating: 4.7,
        salesCount: 65,
        createdAt: "2026-03-03T08:00:00Z",
    },
    {
        id: "prod-005",
        name: "Mustard Honey (Organic Raw)",
        sku: "PAN-HON-05",
        description: "Unpasteurized raw wild mustard flower honey from Chitwan apiaries.",
        category: "pantry-staples",
        price: 650,
        discountPercent: 0,
        stock: 22,
        lowStockThreshold: 5,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 5.0,
        salesCount: 47,
        createdAt: "2026-03-05T08:00:00Z",
    },
    {
        id: "prod-006",
        name: "Cold-Pressed Mustard Oil (Toriko Tel)",
        sku: "PAN-OIL-06",
        description: "Traditional wooden kolhu pressed mustard oil with full pungent aroma and natural vitamins.",
        category: "pantry-staples",
        price: 340,
        discountPercent: 5,
        stock: 28,
        lowStockThreshold: 10,
        unit: "1L",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.9,
        salesCount: 110,
        createdAt: "2026-03-06T08:00:00Z",
    },
    {
        id: "prod-007",
        name: "Free-Range Hill Country Eggs",
        sku: "DAI-EGG-07",
        description: "Nutritious brown eggs from pasture-raised hens fed with organic corn and grains in Kavre.",
        category: "dairy-eggs",
        price: 240,
        discountPercent: 0,
        stock: 18,
        lowStockThreshold: 8,
        unit: "crate (12 pcs)",
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.8,
        salesCount: 175,
        createdAt: "2026-03-07T08:00:00Z",
    },
    {
        id: "prod-008",
        name: "Organic Red Fuji Apples (Mustang)",
        sku: "VEG-APL-08",
        description: "Crispy, juicy sweet apples harvested from orchards of Marpha, Mustang Valley.",
        category: "fruits-vegetables",
        price: 280,
        discountPercent: 12,
        stock: 2, // Low stock alert
        lowStockThreshold: 10,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.9,
        salesCount: 94,
        createdAt: "2026-03-08T08:00:00Z",
    },
    {
        id: "prod-009",
        name: "Fresh Avocado (Dhankuta Organic)",
        sku: "VEG-AVO-09",
        description: "Creamy Hass-type avocados with high natural healthy fats. Perfectly ripe for toast & salad.",
        category: "fruits-vegetables",
        price: 360,
        discountPercent: 0,
        stock: 19,
        lowStockThreshold: 8,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.7,
        salesCount: 78,
        createdAt: "2026-03-09T08:00:00Z",
    },
    {
        id: "prod-010",
        name: "Himalayan Herbal Green Tea",
        sku: "BEV-TEA-10",
        description: "Hand-rolled orthodox whole leaf green tea with notes of lemongrass and holy basil (Tulsi).",
        category: "beverages",
        price: 320,
        discountPercent: 10,
        stock: 45,
        lowStockThreshold: 10,
        unit: "150g tin",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 4.9,
        salesCount: 52,
        createdAt: "2026-03-10T08:00:00Z",
    },
    {
        id: "prod-011",
        name: "Roasted Spiced Almonds & Cashews",
        sku: "SNK-NUT-11",
        description: "Dry roasted with Himalayan pink salt, cumin, and cracked black pepper.",
        category: "snacks",
        price: 520,
        discountPercent: 8,
        stock: 25,
        lowStockThreshold: 5,
        unit: "250g pouch",
        image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&auto=format&fit=crop&q=80",
        isOrganic: false,
        isActive: true,
        rating: 4.6,
        salesCount: 68,
        createdAt: "2026-03-11T08:00:00Z",
    },
    {
        id: "prod-012",
        name: "Fresh Ghee (Traditional Danfe Butter)",
        sku: "DAI-GHE-12",
        description: "Aromatic golden bilona churned ghee prepared using age-old Newari brass pot methods.",
        category: "dairy-eggs",
        price: 980,
        discountPercent: 0,
        stock: 12,
        lowStockThreshold: 5,
        unit: "800g jar",
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80",
        isOrganic: true,
        isActive: true,
        rating: 5.0,
        salesCount: 115,
        createdAt: "2026-03-12T08:00:00Z",
    },
];

const initialOrders: VendorOrder[] = [
    {
        id: "ord-101",
        orderNumber: "PSL-2026-8941",
        customer: {
            id: "cust-001",
            name: "Sunita Shakya",
            email: "sunita.shakya@gmail.com",
            phone: "+977 9813456789",
            address: "House 24, Shankhamul Marg",
            city: "Kathmandu",
            ward: "Ward 10",
        },
        items: [
            {
                productId: "prod-001",
                name: "Fresh Palungko Saag (Spinach)",
                image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&auto=format&fit=crop&q=80",
                price: 65,
                quantity: 2,
                unit: "bundle",
                total: 130,
            },
            {
                productId: "prod-003",
                name: "Fresh Himalayan Cow Milk Paneer",
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80",
                price: 450,
                quantity: 1,
                unit: "500g",
                total: 450,
            },
            {
                productId: "prod-007",
                name: "Free-Range Hill Country Eggs",
                image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80",
                price: 240,
                quantity: 1,
                unit: "crate (12 pcs)",
                total: 240,
            },
        ],
        subtotal: 820,
        discount: 0,
        deliveryFee: 65,
        total: 885,
        paymentMethod: "eSewa",
        paymentStatus: "Paid",
        status: "Pending",
        statusHistory: [
            {
                status: "Pending",
                timestamp: "2026-09-19T10:15:00Z",
                note: "Order placed by customer via eSewa instant checkout",
            },
        ],
        orderDate: "2026-09-19T10:15:00Z",
        deliverySlot: "Within 30 mins (Express)",
        notes: "Please select fresh and crisp spinach bundles!",
    },
    {
        id: "ord-102",
        orderNumber: "PSL-2026-8942",
        customer: {
            id: "cust-002",
            name: "Aayush Maharjan",
            email: "aayush.m@yahoo.com",
            phone: "+977 9808123456",
            address: "Pulchowk, Near Engineering Campus Gate",
            city: "Lalitpur",
            ward: "Ward 3",
        },
        items: [
            {
                productId: "prod-006",
                name: "Cold-Pressed Mustard Oil (Toriko Tel)",
                image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80",
                price: 323,
                quantity: 2,
                unit: "1L",
                total: 646,
            },
            {
                productId: "prod-005",
                name: "Mustard Honey (Organic Raw)",
                image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80",
                price: 650,
                quantity: 1,
                unit: "500g",
                total: 650,
            },
        ],
        subtotal: 1296,
        discount: 50,
        deliveryFee: 0, // Free delivery tier
        total: 1246,
        paymentMethod: "Khalti",
        paymentStatus: "Paid",
        status: "Accepted",
        statusHistory: [
            { status: "Pending", timestamp: "2026-09-19T09:40:00Z" },
            { status: "Accepted", timestamp: "2026-09-19T09:44:00Z", note: "Vendor accepted the order" },
        ],
        orderDate: "2026-09-19T09:40:00Z",
        deliverySlot: "Morning Delivery (10:00 - 11:30 AM)",
    },
    {
        id: "ord-103",
        orderNumber: "PSL-2026-8943",
        customer: {
            id: "cust-003",
            name: "Deepa Thapa",
            email: "deepa.thapa@gmail.com",
            phone: "+977 9860129384",
            address: "Minbhawan, Near Civil Hospital",
            city: "Kathmandu",
            ward: "Ward 31",
        },
        items: [
            {
                productId: "prod-004",
                name: "Artisanal Multigrain Sourdough Bread",
                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
                price: 153,
                quantity: 2,
                unit: "loaf",
                total: 306,
            },
            {
                productId: "prod-012",
                name: "Fresh Ghee (Traditional Danfe Butter)",
                image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80",
                price: 980,
                quantity: 1,
                unit: "800g jar",
                total: 980,
            },
        ],
        subtotal: 1286,
        discount: 0,
        deliveryFee: 0,
        total: 1286,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
        status: "Preparing",
        statusHistory: [
            { status: "Pending", timestamp: "2026-09-19T09:10:00Z" },
            { status: "Accepted", timestamp: "2026-09-19T09:12:00Z" },
            { status: "Preparing", timestamp: "2026-09-19T09:20:00Z", note: "Packing items in grocery tote bag" },
        ],
        orderDate: "2026-09-19T09:10:00Z",
        deliverySlot: "Express 20 mins",
    },
    {
        id: "ord-104",
        orderNumber: "PSL-2026-8944",
        customer: {
            id: "cust-004",
            name: "Bikram KC",
            email: "bikram.kc@outlook.com",
            phone: "+977 9849201948",
            address: "Koteshwor, Mahadevsthan Chowk",
            city: "Kathmandu",
            ward: "Ward 32",
        },
        items: [
            {
                productId: "prod-008",
                name: "Organic Red Fuji Apples (Mustang)",
                image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80",
                price: 246,
                quantity: 3,
                unit: "kg",
                total: 738,
            },
            {
                productId: "prod-009",
                name: "Fresh Avocado (Dhankuta Organic)",
                image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&auto=format&fit=crop&q=80",
                price: 360,
                quantity: 1,
                unit: "kg",
                total: 360,
            },
        ],
        subtotal: 1098,
        discount: 0,
        deliveryFee: 65,
        total: 1163,
        paymentMethod: "eSewa",
        paymentStatus: "Paid",
        status: "Ready",
        statusHistory: [
            { status: "Pending", timestamp: "2026-09-19T08:30:00Z" },
            { status: "Accepted", timestamp: "2026-09-19T08:32:00Z" },
            { status: "Preparing", timestamp: "2026-09-19T08:40:00Z" },
            { status: "Ready", timestamp: "2026-09-19T08:55:00Z", note: "Bag sealed. Waiting for rider pickup." },
        ],
        riderAssigned: {
            name: "Raju Shrestha",
            phone: "+977 9801239999",
            vehicle: "Hero Splendor (BA 65 PA 4821)",
        },
        orderDate: "2026-09-19T08:30:00Z",
    },
    {
        id: "ord-105",
        orderNumber: "PSL-2026-8940",
        customer: {
            id: "cust-005",
            name: "Pooja Gurung",
            email: "pooja.gurung@gmail.com",
            phone: "+977 9818293041",
            address: "Old Baneshwor, Battisputali Road",
            city: "Kathmandu",
            ward: "Ward 9",
        },
        items: [
            {
                productId: "prod-010",
                name: "Himalayan Herbal Green Tea",
                image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80",
                price: 288,
                quantity: 2,
                unit: "150g tin",
                total: 576,
            },
            {
                productId: "prod-007",
                name: "Free-Range Hill Country Eggs",
                image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80",
                price: 240,
                quantity: 2,
                unit: "crate (12 pcs)",
                total: 480,
            },
        ],
        subtotal: 1056,
        discount: 50,
        deliveryFee: 65,
        total: 1071,
        paymentMethod: "Bank Card",
        paymentStatus: "Paid",
        status: "Completed",
        statusHistory: [
            { status: "Pending", timestamp: "2026-09-19T07:15:00Z" },
            { status: "Accepted", timestamp: "2026-09-19T07:18:00Z" },
            { status: "Preparing", timestamp: "2026-09-19T07:25:00Z" },
            { status: "Ready", timestamp: "2026-09-19T07:40:00Z" },
            { status: "Completed", timestamp: "2026-09-19T08:05:00Z", note: "Delivered safely to customer doorstep" },
        ],
        orderDate: "2026-09-19T07:15:00Z",
    },
    {
        id: "ord-106",
        orderNumber: "PSL-2026-8938",
        customer: {
            id: "cust-006",
            name: "Rajendra Sharma",
            email: "r.sharma@nabilbank.com",
            phone: "+977 9851029384",
            address: "Thapathali Heights, Near Norvic",
            city: "Kathmandu",
            ward: "Ward 11",
        },
        items: [
            {
                productId: "prod-002",
                name: "Local Red Potatoes (Mude Aloo)",
                image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80",
                price: 76.5,
                quantity: 5,
                unit: "kg",
                total: 382.5,
            },
        ],
        subtotal: 382.5,
        discount: 0,
        deliveryFee: 65,
        total: 447.5,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
        status: "Cancelled",
        statusHistory: [
            { status: "Pending", timestamp: "2026-09-18T18:10:00Z" },
            { status: "Cancelled", timestamp: "2026-09-18T18:25:00Z", note: "Cancelled by customer (delivery address changed)" },
        ],
        orderDate: "2026-09-18T18:10:00Z",
    },
];

const initialDeals: VendorDeal[] = [
    {
        id: "deal-01",
        title: "Weekend Organic Veggie Blast",
        description: "12% off on fresh seasonal vegetables and fruits from local farm cooperatives.",
        discountType: "percentage",
        discountValue: 12,
        productIds: ["prod-001", "prod-002", "prod-008"],
        startDate: "2026-09-18",
        endDate: "2026-09-21",
        isWeeklyDeal: true,
        isActive: true,
        usageCount: 48,
    },
    {
        id: "deal-02",
        title: "Fresh Morning Bakery Specials",
        description: "Flat Rs. 30 off on fresh sourdough loaves and breakfast bakery staples.",
        discountType: "fixed",
        discountValue: 30,
        productIds: ["prod-004"],
        startDate: "2026-09-15",
        endDate: "2026-09-25",
        isWeeklyDeal: false,
        isActive: true,
        usageCount: 29,
    },
    {
        id: "deal-03",
        title: "Pantry Restock Essentials 10%",
        description: "Stock up your pantry with cold pressed oils and pure mustard wild honey.",
        discountType: "percentage",
        discountValue: 10,
        productIds: ["prod-005", "prod-006", "prod-010"],
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        isWeeklyDeal: true,
        isActive: true,
        usageCount: 82,
    },
];

const initialCustomers: VendorCustomer[] = [
    {
        id: "cust-001",
        name: "Sunita Shakya",
        email: "sunita.shakya@gmail.com",
        phone: "+977 9813456789",
        city: "Shankhamul, Kathmandu",
        totalOrders: 8,
        totalSpent: 6420,
        lastOrderDate: "2026-09-19",
    },
    {
        id: "cust-002",
        name: "Aayush Maharjan",
        email: "aayush.m@yahoo.com",
        phone: "+977 9808123456",
        city: "Pulchowk, Lalitpur",
        totalOrders: 5,
        totalSpent: 5210,
        lastOrderDate: "2026-09-19",
    },
    {
        id: "cust-003",
        name: "Deepa Thapa",
        email: "deepa.thapa@gmail.com",
        phone: "+977 9860129384",
        city: "Minbhawan, Kathmandu",
        totalOrders: 3,
        totalSpent: 3890,
        lastOrderDate: "2026-09-19",
    },
    {
        id: "cust-004",
        name: "Bikram KC",
        email: "bikram.kc@outlook.com",
        phone: "+977 9849201948",
        city: "Koteshwor, Kathmandu",
        totalOrders: 12,
        totalSpent: 11450,
        lastOrderDate: "2026-09-19",
    },
    {
        id: "cust-005",
        name: "Pooja Gurung",
        email: "pooja.gurung@gmail.com",
        phone: "+977 9818293041",
        city: "Old Baneshwor, Kathmandu",
        totalOrders: 7,
        totalSpent: 7320,
        lastOrderDate: "2026-09-19",
    },
    {
        id: "cust-006",
        name: "Rajendra Sharma",
        email: "r.sharma@nabilbank.com",
        phone: "+977 9851029384",
        city: "Thapathali, Kathmandu",
        totalOrders: 4,
        totalSpent: 3180,
        lastOrderDate: "2026-09-18",
    },
];

const initialNotifications: VendorNotification[] = [
    {
        id: "notif-01",
        title: "New Express Order #PSL-2026-8941",
        message: "Sunita Shakya ordered 3 items (Rs. 885). Please review and accept.",
        type: "order",
        timestamp: "10 mins ago",
        read: false,
        link: "/vendor/orders",
    },
    {
        id: "notif-02",
        title: "Low Stock Alert: Mustang Apples",
        message: "Only 2 kg remaining for 'Organic Red Fuji Apples'. Restock advised.",
        type: "stock",
        timestamp: "45 mins ago",
        read: false,
        link: "/vendor/inventory",
    },
    {
        id: "notif-03",
        title: "Weekly Deal Active",
        message: "'Weekend Organic Veggie Blast' was activated with 12% discount.",
        type: "deal",
        timestamp: "3 hours ago",
        read: true,
        link: "/vendor/deals",
    },
];

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

function loadStorage<T>(key: string, fallback: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

function saveStorage<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to save ${key} to localStorage:`, e);
    }
}

// ─── Service API ──────────────────────────────────────────────────────────────

export const vendorService = {
    // Store Settings
    getStoreSettings(): StoreSettings {
        return loadStorage(STORE_KEY, initialStoreSettings);
    },
    saveStoreSettings(settings: StoreSettings): StoreSettings {
        saveStorage(STORE_KEY, settings);
        return settings;
    },
    toggleStoreStatus(isOpen: boolean): StoreSettings {
        const current = this.getStoreSettings();
        const updated = { ...current, isOpen };
        saveStorage(STORE_KEY, updated);
        return updated;
    },

    // Products
    getProducts(): VendorProduct[] {
        return loadStorage(PRODUCTS_KEY, initialProducts);
    },
    saveProducts(products: VendorProduct[]): void {
        saveStorage(PRODUCTS_KEY, products);
    },
    addProduct(product: Omit<VendorProduct, "id" | "createdAt" | "salesCount" | "rating">): VendorProduct {
        const current = this.getProducts();
        const newProduct: VendorProduct = {
            ...product,
            id: `prod-${Date.now()}`,
            salesCount: 0,
            rating: 5.0,
            createdAt: new Date().toISOString(),
        };
        const updated = [newProduct, ...current];
        this.saveProducts(updated);
        return newProduct;
    },
    updateProduct(id: string, updates: Partial<VendorProduct>): VendorProduct | null {
        const current = this.getProducts();
        const idx = current.findIndex((p) => p.id === id);
        if (idx === -1) return null;
        current[idx] = { ...current[idx], ...updates };
        this.saveProducts(current);
        return current[idx];
    },
    deleteProduct(id: string): boolean {
        const current = this.getProducts();
        const updated = current.filter((p) => p.id !== id);
        this.saveProducts(updated);
        return true;
    },
    updateStock(productId: string, newStock: number): VendorProduct | null {
        return this.updateProduct(productId, { stock: Math.max(0, newStock) });
    },

    // Orders
    getOrders(): VendorOrder[] {
        return loadStorage(ORDERS_KEY, initialOrders);
    },
    saveOrders(orders: VendorOrder[]): void {
        saveStorage(ORDERS_KEY, orders);
    },
    updateOrderStatus(orderId: string, status: VendorOrder["status"], note?: string): VendorOrder | null {
        const current = this.getOrders();
        const idx = current.findIndex((o) => o.id === orderId);
        if (idx === -1) return null;
        const order = current[idx];
        const newHistory = [
            ...order.statusHistory,
            {
                status,
                timestamp: new Date().toISOString(),
                note: note || `Order marked as ${status}`,
            },
        ];
        current[idx] = {
            ...order,
            status,
            statusHistory: newHistory,
        };
        this.saveOrders(current);
        return current[idx];
    },

    // Deals
    getDeals(): VendorDeal[] {
        return loadStorage(DEALS_KEY, initialDeals);
    },
    saveDeals(deals: VendorDeal[]): void {
        saveStorage(DEALS_KEY, deals);
    },
    addDeal(deal: Omit<VendorDeal, "id" | "usageCount">): VendorDeal {
        const current = this.getDeals();
        const newDeal: VendorDeal = {
            ...deal,
            id: `deal-${Date.now()}`,
            usageCount: 0,
        };
        const updated = [newDeal, ...current];
        this.saveDeals(updated);
        return newDeal;
    },
    toggleDealStatus(id: string): VendorDeal | null {
        const current = this.getDeals();
        const idx = current.findIndex((d) => d.id === id);
        if (idx === -1) return null;
        current[idx].isActive = !current[idx].isActive;
        this.saveDeals(current);
        return current[idx];
    },
    deleteDeal(id: string): boolean {
        const current = this.getDeals();
        const updated = current.filter((d) => d.id !== id);
        this.saveDeals(updated);
        return true;
    },

    // Customers
    getCustomers(): VendorCustomer[] {
        return initialCustomers;
    },

    // Notifications
    getNotifications(): VendorNotification[] {
        return loadStorage(NOTIFICATIONS_KEY, initialNotifications);
    },
    markNotificationRead(id: string): void {
        const current = this.getNotifications();
        const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
        saveStorage(NOTIFICATIONS_KEY, updated);
    },
    clearAllNotifications(): void {
        saveStorage(NOTIFICATIONS_KEY, []);
    },

    // Analytics Calculation
    getAnalyticsSummary(): VendorAnalyticsSummary {
        const orders = this.getOrders();
        const products = this.getProducts();

        const completedOrders = orders.filter((o) => o.status === "Completed");
        const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Accepted");
        const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 48320); // Baseline historical + completed
        const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
        const outOfStockCount = products.filter((p) => p.stock === 0).length;

        const dailySales: SalesDataPoint[] = [
            { label: "6 AM", revenue: 1200, orders: 2 },
            { label: "8 AM", revenue: 4850, orders: 5 },
            { label: "10 AM", revenue: 8400, orders: 8 },
            { label: "12 PM", revenue: 5300, orders: 4 },
            { label: "2 PM", revenue: 3900, orders: 3 },
            { label: "4 PM", revenue: 7600, orders: 7 },
            { label: "6 PM", revenue: 9800, orders: 9 },
            { label: "8 PM", revenue: 4200, orders: 4 },
        ];

        const weeklySales: SalesDataPoint[] = [
            { label: "Sun", revenue: 38450, orders: 42 },
            { label: "Mon", revenue: 32100, orders: 36 },
            { label: "Tue", revenue: 29800, orders: 31 },
            { label: "Wed", revenue: 34500, orders: 38 },
            { label: "Thu", revenue: 41200, orders: 45 },
            { label: "Fri", revenue: 46800, orders: 52 },
            { label: "Sat", revenue: 53400, orders: 58 },
        ];

        const monthlySales: SalesDataPoint[] = [
            { label: "Baisakh", revenue: 180000, orders: 210 },
            { label: "Jestha", revenue: 220000, orders: 250 },
            { label: "Ashadh", revenue: 205000, orders: 235 },
            { label: "Shrawan", revenue: 245000, orders: 280 },
            { label: "Bhadra", revenue: 275000, orders: 310 },
            { label: "Ashwin", revenue: 310000, orders: 345 },
        ];

        return {
            totalRevenue,
            revenueChangePercent: 18.4,
            todayOrders: 5,
            pendingOrders: pendingOrders.length,
            completedOrders: completedOrders.length + 86,
            cancelledOrders: cancelledOrders.length,
            totalProducts: products.length,
            lowStockCount,
            outOfStockCount,
            averageOrderValue: 985,
            repeatCustomerRate: 64.5,
            dailySales,
            weeklySales,
            monthlySales,
        };
    },
};
