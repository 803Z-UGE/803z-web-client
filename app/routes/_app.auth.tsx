import { AuthLayout } from '@/components/atoms/auth-layout';
import { useAuth } from '@/contexts/auth';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';

export default function Auth() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('tried to leave');
            navigate('/'); // Redirect to home if already authenticated
        }
    }, [isAuthenticated]);

    return (
        <div className="sm:grow flex flex-col items-center justify-center sm:pb-13">
            <Outlet />
        </div>
    );
}
