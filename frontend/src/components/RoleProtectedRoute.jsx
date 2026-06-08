// RoleProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleProtectedRoute = ({
    children,
    allowedRole,
}) => {
    const { isAuthenticated, user, isLoading } = useSelector(
        (state) => state.auth
    );

    console.log({
        isAuthenticated,
        user,
        allowedRole,
        isLoading
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }


    else if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    else if (user?.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleProtectedRoute;