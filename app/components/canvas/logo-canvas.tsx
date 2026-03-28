import * as THREE from 'three'
import { Fragment, Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { AccumulativeShadows, Environment, Lightformer, Loader, MeshTransmissionMaterial, RandomizedLight, Stats } from "@react-three/drei";
import { CharacterEight, CharacterZero, CharacterThree, CharacterZed } from './assets/logo';
import { Physics, RigidBody } from "@react-three/rapier";
import { easing } from 'maath'

function CoolMat(props: ThreeElements['meshPhysicalMaterial']) {
    return <meshPhysicalMaterial 
        metalness={0} 
        roughness={0.0} 
        clearcoat={1}
        clearcoatRoughness={1}
        envMapIntensity={3}
        color={'black'}
        {...props}
    />
}

function Logo(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return <mesh
        {...props}
        ref={meshRef}
        scale={3}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
    >
        <RigidBody colliders={"cuboid"} type='fixed'>
            <CharacterEight>
                <CoolMat 
                    color={'white'}
                    metalness={1}
                    roughness={.1}
                />
            </CharacterEight>
            <CharacterZero>
                <CoolMat/>
            </CharacterZero>
            <CharacterThree>
                <CoolMat
                    color={'white'}
                    metalness={0}
                    roughness={1}
                />
            </CharacterThree>
            <CharacterZed>
                <MeshTransmissionMaterial clearcoat={1} samples={3} thickness={40} chromaticAberration={0.25} anisotropy={0.4}>
                    
                </MeshTransmissionMaterial>
            </CharacterZed>
        </RigidBody>
    </mesh>
}

function PhysicsScene(props: { children?: React.ReactNode }) {
    return <Suspense>
        <Physics >
            <Logo />
            {props.children}
        </Physics>
    </Suspense>
}

function Scene() {

    const ref = useRef<THREE.Group>(null)
    useFrame((state, delta) => {
        // Animate the environment as well as the camera
        // easing.damp3(ref.current.rotation, [Math.PI / 2, 0, state.clock.elapsedTime / 5 + state.pointer.x], 0.2, delta)
        easing.damp3(state.camera.position, [Math.sin(state.pointer.x / 4) * 9, 1.25 - 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9], 0.5, delta)
        state.camera.lookAt(0, 0, 0)
    })
    
    return <>
        {/* <fog attach="fog" args={['#f0f0f0', 100, 150]} /> */}
        <color attach="background" args={['white']} />

        {/* LIGHTS */}
        <spotLight
          penumbra={1}
          angle={-10}
          castShadow
          position={[10, 60, -5]}
          intensity={8}
          shadow-mapSize={[512, 512]}
        />
        <hemisphereLight intensity={0.2} />
        <ambientLight intensity={0.5} />


        {/* SHADOWS  */}
        <AccumulativeShadows temporal frames={100} scale={12} alphaTest={0.8} position={[0, -0.85, 0]} opacity={0.4} >
            <RandomizedLight amount={8} radius={6} ambient={0.5} position={[-1, 5, 2.5]} bias={0.001} />
        </AccumulativeShadows>
        {/* <ContactShadows smooth={false} scale={100} position={[0, -5.05, 0]} blur={0.5} opacity={0.75} /> */}

        {/* ACTUAL SCENE */}
        <Suspense>
            <PhysicsScene/>
        </Suspense>

        {/* REFLECTIONS */}
        <Environment preset="warehouse">
            {/* <group rotation={[-Math.PI / 3, 0, 0]} ref={ref}>
                <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                    <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
                ))}
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
            </group> */}
        </Environment>
    </>
}

export function LogoCanvas() {

    return <Fragment>
        <Canvas
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, borderRadius: '8px' }}
            camera={{ fov: 20 }}
            shadows
        >
            <Stats className='bottom-0 flex items-end mb-1.5 ml-1.5' />
            <Scene />
        </Canvas>

        <Loader/>
    </Fragment>
}