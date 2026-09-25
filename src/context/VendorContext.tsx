import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import type {
    VendorProduct,
    VendorOrder,
    VendorDeal,
    VendorCustomer,
    StoreSettings,
    VendorNotification,
    VendorAnalyticsSummary,
    VendorOrderStatus,
} from "../types/vendor";
import { vendorService } from "../services/vendorService";

interface VendorContextType {
    store: StoreSettings;
    products: VendorProduct[];
    orders: VendorOrder[];
    deals: VendorDeal[];
    customers: VendorCustomer[];
    notifications: VendorNotification[];
    analytics: VendorAnalyticsSummary;
    unreadNotificationsCount: number;

    // Actions
    updateStoreSettings: (settings: StoreSettings) => void;
    toggleStoreStatus: () => void;

    addProduct: (product: Omit<VendorProduct, "id" | "createdAt" | "salesCount" | "rating">) => VendorProduct;
    updateProduct: (id: string, updates: Partial<VendorProduct>) => void;
    deleteProduct: (id: string) => void;
    toggleProductStatus: (id: string) => void;
    updateStock: (productId: string, newStock: number) => void;

    updateOrderStatus: (orderId: string, status: VendorOrderStatus, note?: string) => void;
    acceptOrder: (orderId: string) => void;
    rejectOrder: (orderId: string, reason?: string) => void;

    addDeal: (deal: Omit<VendorDeal, "id" | "usageCount">) => void;
    toggleDealStatus: (id: string) => void;
    deleteDeal: (id: string) => void;

    markNotificationRead: (id: string) => void;
    clearAllNotifications: () => void;
    refreshData: () => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
    const [store, setStore] = useState<StoreSettings>(() => vendorService.getStoreSettings());
    const [products, setProducts] = useState<VendorProduct[]>(() => vendorService.getProducts());
    const [orders, setOrders] = useState<VendorOrder[]>(() => vendorService.getOrders());
    const [deals, setDeals] = useState<VendorDeal[]>(() => vendorService.getDeals());
    const [customers] = useState<VendorCustomer[]>(() => vendorService.getCustomers());
    const [notifications, setNotifications] = useState<VendorNotification[]>(() => vendorService.getNotifications());
    const [analytics, setAnalytics] = useState<VendorAnalyticsSummary>(() => vendorService.getAnalyticsSummary());

    const refreshData = useCallback(() => {
        setStore(vendorService.getStoreSettings());
        setProducts(vendorService.getProducts());
        setOrders(vendorService.getOrders());
        setDeals(vendorService.getDeals());
        setNotifications(vendorService.getNotifications());
        setAnalytics(vendorService.getAnalyticsSummary());
    }, []);

    // ─── Store Settings Actions ───────────────────────────────────────────────
    const updateStoreSettings = (newSettings: StoreSettings) => {
        const saved = vendorService.saveStoreSettings(newSettings);
        setStore(saved);
        toast.success("Store settings updated successfully!", { icon: "🏪" });
    };

    const toggleStoreStatus = () => {
        const nextStatus = !store.isOpen;
        const updated = vendorService.toggleStoreStatus(nextStatus);
        setStore(updated);
        if (nextStatus) {
            toast.success("Store is now OPEN for incoming orders!", { icon: "🟢" });
        } else {
            toast.error("Store is currently CLOSED to customers.", { icon: "🔴" });
        }
    };

    // ─── Product Actions ──────────────────────────────────────────────────────
    const addProduct = (productData: Omit<VendorProduct, "id" | "createdAt" | "salesCount" | "rating">) => {
        const newProduct = vendorService.addProduct(productData);
        setProducts(vendorService.getProducts());
        setAnalytics(vendorService.getAnalyticsSummary());
        toast.success(`Product "${newProduct.name}" added!`, { icon: "✅" });
        return newProduct;
    };

    const updateProduct = (id: string, updates: Partial<VendorProduct>) => {
        const updated = vendorService.updateProduct(id, updates);
        if (updated) {
            setProducts(vendorService.getProducts());
            setAnalytics(vendorService.getAnalyticsSummary());
            toast.success("Product updated successfully!", { icon: "✏️" });
        }
    };

    const deleteProduct = (id: string) => {
        vendorService.deleteProduct(id);
        setProducts(vendorService.getProducts());
        setAnalytics(vendorService.getAnalyticsSummary());
        toast.success("Product removed from catalog.", { icon: "🗑️" });
    };

    const toggleProductStatus = (id: string) => {
        const target = products.find((p) => p.id === id);
        if (!target) return;
        const nextState = !target.isActive;
        updateProduct(id, { isActive: nextState });
        toast.success(`Product marked as ${nextState ? "Active" : "Disabled"}.`);
    };

    const updateStock = (productId: string, newStock: number) => {
        const updated = vendorService.updateStock(productId, newStock);
        if (updated) {
            setProducts(vendorService.getProducts());
            setAnalytics(vendorService.getAnalyticsSummary());
            toast.success(`Stock updated to ${newStock} ${updated.unit}`, { icon: "📦" });
        }
    };

    // ─── Order Actions ────────────────────────────────────────────────────────
    const updateOrderStatus = (orderId: string, status: VendorOrderStatus, note?: string) => {
        const updated = vendorService.updateOrderStatus(orderId, status, note);
        if (updated) {
            setOrders(vendorService.getOrders());
            setAnalytics(vendorService.getAnalyticsSummary());
            toast.success(`Order #${updated.orderNumber} status updated to ${status}!`, { icon: "📦" });
        }
    };

    const acceptOrder = (orderId: string) => {
        updateOrderStatus(orderId, "Accepted", "Order accepted by shop merchant. Preparation started.");
    };

    const rejectOrder = (orderId: string, reason?: string) => {
        updateOrderStatus(orderId, "Cancelled", reason || "Order rejected by vendor due to stock or timing constraints.");
        toast.error("Order cancelled / rejected.", { icon: "❌" });
    };

    // ─── Deals Actions ────────────────────────────────────────────────────────
    const addDeal = (dealData: Omit<VendorDeal, "id" | "usageCount">) => {
        vendorService.addDeal(dealData);
        setDeals(vendorService.getDeals());
        toast.success(`Deal "${dealData.title}" created successfully!`, { icon: "🏷️" });
    };

    const toggleDealStatus = (id: string) => {
        vendorService.toggleDealStatus(id);
        setDeals(vendorService.getDeals());
        toast.success("Deal status updated.");
    };

    const deleteDeal = (id: string) => {
        vendorService.deleteDeal(id);
        setDeals(vendorService.getDeals());
        toast.success("Deal removed.");
    };

    // ─── Notification Actions ─────────────────────────────────────────────────
    const markNotificationRead = (id: string) => {
        vendorService.markNotificationRead(id);
        setNotifications(vendorService.getNotifications());
    };

    const clearAllNotifications = () => {
        vendorService.clearAllNotifications();
        setNotifications([]);
    };

    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    return (
        <VendorContext.Provider
            value={{
                store,
                products,
                orders,
                deals,
                customers,
                notifications,
                analytics,
                unreadNotificationsCount,

                updateStoreSettings,
                toggleStoreStatus,

                addProduct,
                updateProduct,
                deleteProduct,
                toggleProductStatus,
                updateStock,

                updateOrderStatus,
                acceptOrder,
                rejectOrder,

                addDeal,
                toggleDealStatus,
                deleteDeal,

                markNotificationRead,
                clearAllNotifications,
                refreshData,
            }}
        >
            {children}
        </VendorContext.Provider>
    );
};

export const useVendor = () => {
    const context = useContext(VendorContext);
    if (!context) {
        throw new Error("useVendor must be used within a VendorProvider");
    }
    return context;
};
