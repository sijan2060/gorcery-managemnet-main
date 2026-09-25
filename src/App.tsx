import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { ChatbotWidget } from "./components/common";
import { ProtectedRoute, VendorProtectedRoute } from "./components/auth";
import { VendorLayout } from "./components/vendor/layout";
import {
    Home,
    Products,
    ProductPage,
    SearchResults,
    FlashDeals,
    Cart,
    Checkout,
    Login,
    MyOrders,
    OrderTracking,
    Addresses,
    BecomeSeller,
    HelpSupport,
} from "./pages";
import {
    VendorLogin,
    VendorDashboard,
    VendorProducts,
    VendorProductEdit,
    VendorCategories,
    VendorInventory,
    VendorOrders,
    VendorDeals,
    VendorCustomers,
    VendorAnalytics,
    VendorSettings,
    VendorProfile,
} from "./pages/vendor";

const App = () => {
    const location = useLocation();
    const isVendorRoute = location.pathname.startsWith("/vendor");

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#1B3022",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "14px",
                    },
                }}
            />

            <Routes>
                {/* ─── CUSTOMER AUTH PAGES ─────────────────────────────────────── */}
                <Route path="/login" element={<Login />} />

                {/* ─── VENDOR AUTH PAGES ───────────────────────────────────────── */}
                <Route path="/vendor/login" element={<VendorLogin />} />

                {/* ─── VENDOR PORTAL PROTECTED ROUTES ──────────────────────────── */}
                <Route element={<VendorProtectedRoute />}>
                    <Route path="/vendor" element={<VendorLayout />}>
                        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
                        <Route path="dashboard" element={<VendorDashboard />} />
                        <Route path="products" element={<VendorProducts />} />
                        <Route path="products/new" element={<VendorProductEdit />} />
                        <Route path="products/edit/:id" element={<VendorProductEdit />} />
                        <Route path="categories" element={<VendorCategories />} />
                        <Route path="inventory" element={<VendorInventory />} />
                        <Route path="orders" element={<VendorOrders />} />
                        <Route path="deals" element={<VendorDeals />} />
                        <Route path="customers" element={<VendorCustomers />} />
                        <Route path="analytics" element={<VendorAnalytics />} />
                        <Route path="settings" element={<VendorSettings />} />
                        <Route path="profile" element={<VendorProfile />} />
                    </Route>
                </Route>

                {/* ─── CUSTOMER PORTAL PAGES ───────────────────────────────────── */}
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:id" element={<ProductPage />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="deals" element={<FlashDeals />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="become-seller" element={<BecomeSeller />} />
                    <Route path="help" element={<HelpSupport />} />
                    <Route path="support" element={<HelpSupport />} />

                    {/* Protected Customer Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="payment" element={<Checkout />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="orders/:id" element={<OrderTracking />} />
                        <Route path="addresses" element={<Addresses />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Chatbot only for customer store, hidden on vendor dashboard */}
            {!isVendorRoute && <ChatbotWidget />}
        </>
    );
};

export default App;
