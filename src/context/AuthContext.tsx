import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type UserRole = "customer" | "vendor" | "guest";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    storeId?: string;
    storeName?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    role: UserRole;
    isAuthenticated: boolean;
    isVendor: boolean;
    isCustomer: boolean;
    loginAsVendor: (email?: string, storeName?: string, ownerName?: string, phone?: string) => void;
    loginAsCustomer: (email?: string, name?: string) => void;
    logout: () => void;
}

const AUTH_STORAGE_KEY = "pasalmandu_auth_session_v1";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Default initial auth state is guest or saved session
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const saved = localStorage.getItem(AUTH_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const loginAsVendor = (
        email = "ramesh.organic@pasalmandu.com",
        storeName = "Kathmandu Valley Organic Mart",
        ownerName = "Ramesh Shrestha",
        phone = "+977 9841234567"
    ) => {
        const vendorUser: AuthUser = {
            id: `ven-${Date.now()}`,
            name: ownerName,
            email,
            role: "vendor",
            phone,
            storeId: "VEN-KTM-001",
            storeName,
            avatar: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80",
        };
        setUser(vendorUser);
    };

    const loginAsCustomer = (email = "customer@example.com", name = "Sijan Maharjan") => {
        const customerUser: AuthUser = {
            id: "cust-user-001",
            name,
            email,
            role: "customer",
            phone: "+977 9812345678",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        };
        setUser(customerUser);
    };

    const logout = () => {
        setUser(null);
    };

    const role: UserRole = user ? user.role : "guest";
    const isAuthenticated = !!user;
    const isVendor = role === "vendor";
    const isCustomer = role === "customer";

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                isAuthenticated,
                isVendor,
                isCustomer,
                loginAsVendor,
                loginAsCustomer,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
