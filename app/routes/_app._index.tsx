import { Heading } from '@/components/atoms/heading';
import { HomeCanvas } from '@/components/canvas/home-canvas';
import { LogoCanvas } from '@/components/canvas/logo-canvas';
import { UnboxingCanvas } from '@/components/canvas/unboxing-canvas';

export default function Index({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UnboxingCanvas />
        </>
    );
}
