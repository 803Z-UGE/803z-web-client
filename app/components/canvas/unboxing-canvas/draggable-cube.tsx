import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CuboidCollider, type RapierRigidBody } from "@react-three/rapier";
import { Box, Outlines } from '@react-three/drei';

export function DraggableCube({ position, spawnImpulse }: { position: [number, number, number], spawnImpulse: {x: number, y: number, z: number} }) {
    const body = useRef<RapierRigidBody>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // We use this to track where the mouse intersects a virtual "floor" plane
    const { camera, raycaster } = useThree();
    
    // Reusable vectors to prevent garbage collection
    const direction = new THREE.Vector3();
    const targetPos = new THREE.Vector3();

    useFrame((state) => {
        if (!body.current) return;

        if (isDragging) {
            // 1. CAST RAY FROM CAMERA TO MOUSE
            raycaster.setFromCamera(state.pointer, camera);

            // 2. CALCULATE INTERSECTION WITH A PLANE AT THE CUBE'S HEIGHT
            // We want the cube to hover at its current y, or a fixed drag height (e.g., 1.5)
            const dragHeight = 2; 
            
            // Math: Calculate distance from camera to the plane y = dragHeight
            // formula: distance = (planeY - rayOriginY) / rayDirectionY
            const distance = (dragHeight - raycaster.ray.origin.y) / raycaster.ray.direction.y;
            
            // Get the point in 3D space
            targetPos.copy(raycaster.ray.origin).add(raycaster.ray.direction.multiplyScalar(distance));

            // 3. MOVE BODY TOWARDS TARGET
            // Get current position
            const currentPos = body.current.translation();

            // Calculate vector from Cube -> Mouse
            direction.subVectors(targetPos, currentPos);

            // Apply velocity based on distance (act like a spring)
            const multiplier = 10; // Strength of the pull
            body.current.setLinvel(
                { 
                    x: direction.x * multiplier, 
                    y: direction.y * multiplier, 
                    z: direction.z * multiplier 
                }, 
                true
            );
            
            // Optional: Reset rotation so it doesn't spin wildly while dragging
            body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            body.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        }
    });

    useEffect(() => {
        if(!body.current) return;
        body.current.applyImpulse(spawnImpulse, true);
        // Initialize userData for conveyor belt logic
    }, []);

    // Helper to handle start/end drag
    const startDrag = (e: any) => {
        // Stop the camera controls (OrbitControls) from rotating while we drag
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        setIsDragging(true);
        
        // Flag for conveyor belt to ignore this object
        if(body.current) body.current.userData.isBeingDragged = true;
    };

    const endDrag = (e: any) => {
        e.target.releasePointerCapture(e.pointerId);
        setIsDragging(false);
        if(body.current) body.current.userData.isBeingDragged = false;
    };

    const [isHovering, setIsHovering] = useState(false);
    const startHover = (e: any) => {
        e.stopPropagation();
        setIsHovering(true);
    }
    const stopHover = (e: any) => {
        e.stopPropagation();
        setIsHovering(false);
    }

    return (
        <RigidBody 
            ref={body} 
            position={position} 
            colliders={false} // We use a custom collider to capture pointer events cleanly
            canSleep={false} // Keep awake so it responds instantly
            mass={2}
            angularDamping={0}
        >
             {/* Visual */}
            <Box args={[1, 1, 1]} castShadow receiveShadow 
                onPointerDown={startDrag} 
                onPointerUp={endDrag}
                onPointerEnter={startHover}
                onPointerOut={stopHover}
            >
                <meshStandardMaterial emissiveIntensity={isHovering ? isDragging ? 1 : .2 : 0} color={"orange"} emissive={"orange"} />
                
                {isDragging && <Outlines color={"white"} thickness={3} />}
            </Box>

            {/* Interaction Collider */}
            <CuboidCollider 
                args={[0.5, 0.5, 0.5]} 
            />

        </RigidBody>
    );
}