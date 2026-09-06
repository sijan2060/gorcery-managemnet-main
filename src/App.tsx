import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { ChatbotWidget } from "./components/common";
import { ProtectedRoute } from "./components/auth";
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
} from "./pages";

const App = () => {
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
                {/* Auth pages - No Navbar/Footer */}
                <Route path="/login" element={<Login />} />

                {/* Main pages - With Navbar/Footer Layout */}
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:id" element={<ProductPage />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="deals" element={<FlashDeals />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="become-seller" element={<BecomeSeller />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="payment" element={<Checkout />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="orders/:id" element={<OrderTracking />} />
                        <Route path="addresses" element={<Addresses />} />
                    </Route>
                </Route>
            </Routes>

            <ChatbotWidget />
        </>
    );
};

export default App;
