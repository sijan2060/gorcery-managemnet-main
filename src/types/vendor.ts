export type VendorOrderStatus =
    | "Pending"
    | "Accepted"
    | "Preparing"
    | "Ready"
    | "Completed"
    | "Cancelled";

export interface VendorProduct {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    price: number;
    discountPercent: number; // e.g. 10 for 10%
    stock: number;
    lowStockThreshold: number;
    unit: string; // e.g. "kg", "pack", "500g", "pc"
    image: string;
    isOrganic: boolean;
    isActive: boolean;
    rating: number;
    salesCount: number;
    createdAt: string;
}

export interface VendorOrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
    total: number;
}

export interface VendorOrderCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    ward: string;
}

export interface VendorOrder {
    id: string;
    orderNumber: string;
    customer: VendorOrderCustomer;
    items: VendorOrderItem[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    paymentMethod: "eSewa" | "Khalti" | "Cash on Delivery" | "Bank Card";
    paymentStatus: "Paid" | "Pending";
    status: VendorOrderStatus;
    statusHistory: {
        status: VendorOrderStatus;
        timestamp: string;
        note?: string;
    }[];
    orderDate: string;
    deliverySlot?: string;
    riderAssigned?: {
        name: string;
        phone: string;
        vehicle: string;
    };
    notes?: string;
}

export interface VendorDeal {
    id: string;
    title: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    productIds: string[];
    startDate: string;
    endDate: string;
    isWeeklyDeal: boolean;
    isActive: boolean;
    usageCount: number;
}

export interface VendorCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    avatar?: string;
}

export interface StoreHours {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

export interface StoreSettings {
    storeId: string;
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    altPhone?: string;
    address: string;
    city: string;
    ward: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    category: string;
    panVatNumber: string;
    isOpen: boolean;
    openingHours: StoreHours[];
    deliverySettings: {
        deliveryRadiusKm: number;
        freeDeliveryMinimum: number;
        standardDeliveryFee: number;
        estimatedPrepTimeMinutes: number;
        allowPickup: boolean;
    };
    payoutDetails: {
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        esewaId: string;
    };
}

export interface VendorNotification {
    id: string;
    title: string;
    message: string;
    type: "order" | "stock" | "deal" | "system";
    timestamp: string;
    read: boolean;
    link?: string;
}

export interface SalesDataPoint {
    label: string; // e.g., "Mon", "Day 1", or "Jan"
    revenue: number;
    orders: number;
}

export interface VendorAnalyticsSummary {
    totalRevenue: number;
    revenueChangePercent: number;
    todayOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    averageOrderValue: number;
    repeatCustomerRate: number;
    dailySales: SalesDataPoint[];
    weeklySales: SalesDataPoint[];
    monthlySales: SalesDataPoint[];
}
