import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
    const { user, isGuest, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user && !isGuest) {
        // Not logged in and not a guest, redirect to login
        return <Navigate to="/login" replace />;
    }

    // Authorized, render child routes
    return <Outlet />;
}
