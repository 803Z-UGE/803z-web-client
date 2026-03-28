import { ConveyorOrientation } from "./conveyor-belt";
import { Model as Closet } from '../assets/storage';
import { Model as Door } from '../assets/door';
import { RigidBody } from "@react-three/rapier";
import { useInterval, useTimeout } from "usehooks-ts"; // Ensure you have useTimeout
import { DraggableCube } from "./draggable-cube";
import { useState, useCallback, type ReactNode } from "react";

export function Storage({ position, orientation, offset, interval, children }: { orientation: ConveyorOrientation, position: { x: number, y: number, z: number }, offset: number, interval: number, children?: ReactNode }) {
    let angle = (Math.PI / 2);
    let xForce = 0;
    let zForce = 0;

    // ... (Your existing switch statement for orientation) ...
    switch (orientation) {
        case ConveyorOrientation.ZPOS:
            angle *= 0; zForce = 1; break;
        case ConveyorOrientation.XPOS:
            angle *= 1; xForce = 1; break;
        case ConveyorOrientation.ZNEG:
            angle *= 2; zForce = -1; break;
        case ConveyorOrientation.XNEG:
            angle *= 3; xForce = -1; break;
    }

    const [items, setItems] = useState<{ id: string; position: [number, number, number] }[]>([])
    const [isOpen, setIsOpen] = useState(false);

    // 1. State to control when the interval actually starts running
    // If offset is 0, start immediately, otherwise wait (null)
    const [currentInterval, setCurrentInterval] = useState<number | null>(offset === 0 ? interval : null);

    // 2. Define the logic in a function so we can reuse it if needed
    const spawnCycle = useCallback(() => {
        setIsOpen(true);

        setTimeout(() => {
            const newItem = {
                id: crypto.randomUUID(),
                position: [position.x + (xForce / 10), position.y + 1, position.z + (zForce / 10)] as [number, number, number]
            }
            
            // CRITICAL FIX: Use the functional update form (prev => ...)
            // Otherwise 'items' will always be empty inside the interval closure
            setItems((prev) => [...prev, newItem]) 
        }, 500);

        setTimeout(() => {
            setIsOpen(false);
        }, 1000);
    }, [position, xForce, zForce]); // Add dependencies

    // 3. The Offset Timer
    // Waits for 'offset' ms, then turns on the interval
    useTimeout(() => {
        if (offset > 0) {
            // Optional: Run the cycle immediately when offset finishes? 
            // If yes, uncomment the next line:
            spawnCycle(); 
            
            setCurrentInterval(interval);
        }
    }, offset);

    // 4. The Main Interval
    // This will not run until 'currentInterval' is set to a number
    useInterval(spawnCycle, currentInterval);

    return <>
        <group position={[position.x, position.y, position.z]} rotation={[0, angle, 0]}>
            <RigidBody type="fixed" colliders="cuboid" friction={1}>
                <Closet>
                    {children}
                </Closet>
            </RigidBody>
            <Door position={[.45, 0, .05]} mirror={true} isOpen={isOpen}>
                {/* {children} */}
            </Door>
            <Door position={[-.45, 0, .05]} isOpen={isOpen}>
                {/* {children} */}
            </Door>
        </group>
        {items.map((item) => (
            <DraggableCube 
                key={item.id} 
                position={item.position}
                spawnImpulse={{x: xForce * 2, y: 0, z: zForce * 2}}
            />
        ))}
    </>;
}