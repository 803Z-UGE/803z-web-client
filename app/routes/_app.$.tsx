import { Button } from '@/components/atoms/button';
import { Heading } from '@/components/atoms/heading';
import { Link } from 'react-router';

export default function NotFound({ children }: { children: React.ReactNode }) {
    return (
        <div className="size-full space-y-4 flex items-center justify-center flex-col">
            <Heading>404 | Cette page n'existe pas</Heading>
            <Link to="/">
                <Button>Retour à l'accueil</Button>
            </Link>
        </div>
    );
}
