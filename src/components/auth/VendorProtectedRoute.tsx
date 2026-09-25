import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const VendorProtectedRoute = () => {
    const { isAuthenticated, isVendor } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || !isVendor) {
        return <Navigate to="/vendor/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default VendorProtectedRoute;
