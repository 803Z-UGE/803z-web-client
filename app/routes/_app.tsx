import NavbarLayout from '@/components/navbar-layout';
import { Outlet } from 'react-router';

export default function App({ children }: { children: React.ReactNode }) {
    return (
        <NavbarLayout>
            <Outlet />
        </NavbarLayout>
    );
}
