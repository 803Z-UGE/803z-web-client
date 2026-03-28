import { useAuth } from '@/contexts/auth';
import { Navigate, Outlet, useLocation } from 'react-router';

// Extended PrivateRoute with roles
interface PrivateRouteProps {
    allowedRoles?: Array<'admin' | 'user'>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, isLoading, userRole } = useAuth();
    const location = useLocation();

    if (isLoading) return <div>Loading…</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If roles are provided, check them
    if (allowedRoles && !allowedRoles.includes(userRole!)) {
        // Could show a “403 Forbidden” page instead
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
