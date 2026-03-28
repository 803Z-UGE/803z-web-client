import * as THREE from 'three'
import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Model as Belt } from '../assets/belt';
import { CuboidCollider, RigidBody, type CollisionEnterPayload, type CollisionExitPayload, type IntersectionEnterPayload, type IntersectionExitPayload } from "@react-three/rapier";
import { Cylinder } from '@react-three/drei';

export enum ConveyorOrientation {
    ZPOS,
    XPOS,
    ZNEG,
    XNEG
}

type UserData = {
    conveyorOwner: string | null;
    lastBeltTouched: string | null;
}

export function ConveyorBelt({ position, orientation, length }: { orientation: ConveyorOrientation, length: number, position: { x: number, y: number, z: number } }) {
    // 1. Generate a unique ID for this specific conveyor instance
    const beltId = useMemo(() => Math.random().toString(36).slice(2), []);

    let angle = (Math.PI / 2);
    let xForce = 0;
    let zForce = 0;

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

    const speed = 2;
    const colliders = useRef<any[]>([]);

    const [isCarrying, setIsCarrying] = useState(false);

    useFrame(() => {
        // Filter out invalid bodies (in case objects were deleted from scene)
        colliders.current = colliders.current.filter(c => c && c.isValid());

        setIsCarrying(false);

        colliders.current.forEach((collider) => {
            // 2. FRAME CHECK: Only apply force if THIS belt owns the object
            const currentOwner = collider.userData?.conveyorOwner;

            if (collider.userData?.isBeingDragged) return;

            if(!currentOwner) {
                collider.userData['conveyorOwner'] = beltId;
            };

            if (currentOwner === beltId) {
                collider.setLinvel({ x: xForce * speed, y: 0, z: zForce * speed }, true);
                setIsCarrying(true);
                collider.wakeUp(); // Ensure body doesn't fall asleep while moving
            }
        });
    });

    function applyConveyorBeltPhysics({ other }: IntersectionEnterPayload) {
        if (other.rigidBody) {
            // 3. ENTER: Claim ownership immediately
            // This overwrites the ID of the previous belt, ensuring smooth transfer

            other.rigidBody.userData = { 
                ...other.rigidBody.userData, 
                lastBeltTouched: beltId,
            };

            if(other.rigidBody && !other.rigidBody.userData['conveyorOwner']) {
                other.rigidBody.userData['conveyorOwner'] = beltId;
            }

            if (!colliders.current.includes(other.rigidBody)) {
                colliders.current.push(other.rigidBody);
            }
        }
    }

    function removeConveyorBeltPhysics({ other }: IntersectionExitPayload) {
        if (other.rigidBody) {
            // Remove from our local tracking array
            colliders.current = colliders.current.filter((collider) => collider !== other.rigidBody);

            // 4. EXIT: Release ownership safely
            // Only set to null if WE are still the owner. 
            // If the object has already entered the next belt, the owner will be "Belt-ID-2",
            // so we must NOT overwrite it with null.
            if (other.rigidBody.userData?.conveyorOwner === beltId) {
                other.rigidBody.userData.conveyorOwner = null;
            }
        }
    }

    return (
        <group position={[position.x, position.y, position.z]} rotation={[0, angle, 0]}>
            <RigidBody type="fixed" friction={0}>
                <CuboidCollider
                    // Note: Rapier args are half-extents (total size / 2)
                    args={[.8, .25, length + .25]} 
                    position={[0, .25, length - 1]}
                />
                <CuboidCollider
                    // Note: Rapier args are half-extents (total size / 2)
                    args={[.6, .25, length + .27]} 
                    position={[0, .30, length - 1]}
                    onIntersectionEnter={applyConveyorBeltPhysics}
                    onIntersectionExit={removeConveyorBeltPhysics}
                    sensor={true}
                />
            </RigidBody>
            {Array(length).fill(null).map((_, i) => (
                <Belt key={"group" + i} position={[0, -.25, i * 2]} animate={isCarrying}/>
            ))}
            <Cylinder args={[0.05, 0.05, 1.55, 10]} position={[0, .25, -1]} rotation={[Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
                <meshStandardMaterial color={"#555555"} emissive={isCarrying ? "white" : "#000000"}/>
            </Cylinder>
        </group>
    );
}