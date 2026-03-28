import * as THREE from 'three'
import { Fragment, Suspense, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { AccumulativeShadows, Box, ContactShadows, Cylinder, Environment, Lightformer, Loader, OrbitControls, RandomizedLight, Stats, useCursor } from "@react-three/drei";
import { useLoader } from '@react-three/fiber'
import {Model as Belt} from './assets/belt';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { LogoModel } from './assets/logo-model';
import { Physics, RigidBody, type InstancedRigidBodyProps, InstancedRigidBodies, RapierRigidBody } from "@react-three/rapier";
import { useInterval } from 'usehooks-ts';
import { Bloom, ChromaticAberration, DepthOfField, DotScreen, EffectComposer, Glitch, HueSaturation, Noise, TiltShift2, Vignette } from '@react-three/postprocessing';
import { easing } from 'maath'

function Logo(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const texture = useLoader(THREE.TextureLoader, '/assets/textures/normal.jpg');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return <mesh
        {...props}
        ref={meshRef}
        scale={3}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
    >
        <RigidBody colliders={"cuboid"} type='fixed'>
            <LogoModel>
                <meshPhysicalMaterial 
                    metalness={0} 
                    roughness={0.0} 
                    transmission={active ? 1 : 0} 
                    thickness={active ? 1 : 0} 
                    normalMap={texture} 
                    clearcoatNormalMap={texture} 
                    clearcoatRoughness={0}
                    envMapIntensity={3}
                    color={active ? 'grey' : 'black'}
                />
            </LogoModel>
            </RigidBody>
    </mesh>
}
const COUNT = 10;

const LogoRain = () => {
    const rigidBodies = useRef<RapierRigidBody[]>(null);

    
    // We can set the initial positions, and rotations, and scales, of
    // the instances by providing an array of InstancedRigidBodyProps
    // which is the same as RigidBodyProps, but with an additional "key" prop.
    const instances = useMemo(() => {
        const instances: InstancedRigidBodyProps[] = [];
        
        for (let i = 0; i < COUNT; i++) {
            instances.push({
                key: "instance_" + Math.random(),
                position: [(Math.random() - 0.5), Math.random() + 3, (Math.random() - 0.5)],
                rotation: [Math.random(), Math.random(), Math.random()],
                args: [0.5, 0.5, 0.5],
            });
        }
            
        return instances;
    }, []);
    
    // useInterval(() => {
    //   if (!rigidBodies.current) {
    //     return;
    //   }
      
    //   rigidBodies.current[40].applyImpulse({ x: 0, y: 10, z: 0 }, true);
    
    // }, 10);

    return (
        <InstancedRigidBodies
        ref={rigidBodies}
        instances={instances}
        colliders="cuboid"
        >
            <instancedMesh 
                args={[undefined, undefined, COUNT]} 
                count={COUNT}
                onClick={(event) => {
                    console.log("Clicked on instance", event);
                }}
            >
                <boxGeometry args={[.1, .1, .1]}/>
                <meshNormalMaterial />
            </instancedMesh>
        </InstancedRigidBodies>
    );
};

function Ground() {
    // <mesh
    //     rotation-x={-Math.PI / 2}
    //     position={[0, -0.85, 0]}
    //     scale={[200, 200, 200]}
    //     receiveShadow
    //     renderOrder={100000}
    // >
    //     <planeGeometry />
    //     {/* <meshBasicMaterial color="lightblue" /> */}
    //     <shadowMaterial transparent color="#251005" opacity={.25} />
    // </mesh>
    return <RigidBody type="fixed" colliders={"cuboid"} restitution={0} friction={1}>
        <Cylinder args={[1, 10, 0.5, 30]} rotation={[0, 0, 0]} position={[0, -1.5, 0]}>
            <meshStandardMaterial color="white" />
        </Cylinder>
    </RigidBody>
}

function PhysicsScene(props: { children?: React.ReactNode }) {
    return <Suspense>
        <Physics >
            <Ground/>
            <Logo />
            {props.children}
            <LogoRain/>
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
        <color attach="background" args={['#ffffff']} />
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
        {/* <AccumulativeShadows frames={100} alphaTest={0.85} opacity={0.8} scale={8} position={[0, -0.85, 0]}>
            <RandomizedLight amount={8} radius={6} ambient={0.5} intensity={1} position={[-4.5, 2.5, -2.5]} bias={0.001} />
        </AccumulativeShadows> */}

        <AccumulativeShadows temporal frames={100} scale={12} alphaTest={0.8} position={[0, -0.85, 0]} opacity={0.4} >
            <RandomizedLight amount={8} radius={6} ambient={0.5} position={[-1, 5, 2.5]} bias={0.001} />
        </AccumulativeShadows>
        <ContactShadows smooth={false} scale={100} position={[0, -5.05, 0]} blur={0.5} opacity={0.75} />
        {/* <group ref={ref}>
            <Lightformer intensity={5} form="ring" color="red" rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
        </group> */}
        <Suspense>
            <PhysicsScene/>
        </Suspense>
        {/* <OrbitControls/> */}
        <Environment preset="warehouse">
            <group rotation={[-Math.PI / 3, 0, 0]} ref={ref}>
                <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                    <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
                ))}
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
            </group>
        </Environment>
    </>
}

export function HomeCanvas() {

    // const [cycle, setCycle] = useState(2);

    // useInterval(() => {
    //     setCycle((cycle) => (cycle + 1) % 3);
    // }, 10000);

    // let effects: ReactElement;

    // switch (cycle) {
    //     case 0:
    //         effects = <TiltShift2 blur={0.2} />
    //         break;
    //     case 1:
    //         effects = <ChromaticAberration/>
    //         break;
    //     default:
    //         effects = <DotScreen scale={0.6} />
    //         break;
    // }

    return <Fragment>
        <Canvas
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
            camera={{ fov: 20 }}
            shadows
        >
            <Stats className='bottom-0 flex items-end mb-1.5 ml-1.5' />
            <Scene />
            <Belt />
            {/* <EffectComposer multisampling={1}>
                {effects}
            </EffectComposer> */}
        </Canvas>
        <Loader/>
    </Fragment>
}