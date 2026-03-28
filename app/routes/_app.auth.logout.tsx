import { Navigate, useLocation } from 'react-router';

export default function Logout({ children }: { children: React.ReactNode }) {
    return <Navigate to="/" replace state={{ from: useLocation() }} />;
}
