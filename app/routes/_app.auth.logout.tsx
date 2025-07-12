import { redirect } from 'react-router';

export default function Logout({ children }: { children: React.ReactNode }) {
    redirect('/auth/login');
}
