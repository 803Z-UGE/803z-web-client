import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { useEffect } from 'react';
import { type Equipment } from '@/api';
import { equipmentList } from '@/api';

export async function clientLoader() {
    const request = await equipmentList();
    return { equipments: request.data || [] };
}

export default function Events({ loaderData }: { loaderData: { equipments: Equipment[] } }) {
    const { equipments } = loaderData;

    return (
        <>
            <Heading>Matos</Heading>
            <div>
                {equipments &&
                    equipments.map((equipment: Equipment, index: number) => (
                        <div key={index}>
                            <Text>{equipment.name}</Text>
                        </div>
                    ))}
            </div>
        </>
    );
}
