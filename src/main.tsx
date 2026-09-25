import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { VendorProvider } from "./context/VendorContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AuthProvider>
            <VendorProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </VendorProvider>
        </AuthProvider>
    </BrowserRouter>
);
