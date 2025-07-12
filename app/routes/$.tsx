import { Heading } from '@/components/atoms/heading';

export default function NotFound({ children }: { children: React.ReactNode }) {
    return (
        <div className="size-full flex items-center justify-center">
            <Heading>404 | Cette page n'existe pas</Heading>
        </div>
    );
}
