import { AuthLayout } from '@/components/atoms/auth-layout';
import { Outlet } from 'react-router';

export default function Auth({ children }: { children: React.ReactNode }) {
    return (
        <div className="sm:grow flex flex-col items-center justify-center sm:pb-13">
            <Outlet />
        </div>
    );
}
