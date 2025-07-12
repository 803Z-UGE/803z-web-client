import { Heading } from '@/components/atoms/heading';

export default function Index({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Heading>Bienvenue sur 803Z</Heading>
            {/* <button className="btn btn-primary" onClickCapture={() => console.log("coucou")}>Test</button> */}
        </>
    );
}
