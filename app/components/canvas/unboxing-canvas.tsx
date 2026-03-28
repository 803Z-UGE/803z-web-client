import { Fragment, memo, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Box, ContactShadows, Cylinder, Decal, Environment, Grid, Loader, OrbitControls, Stats } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { ConveyorBelt, ConveyorOrientation} from './unboxing-canvas/conveyor-belt';
import { DraggableCube } from './unboxing-canvas/draggable-cube';
import { Storage } from './unboxing-canvas/storage';
import { useInterval } from 'usehooks-ts';
import { useTheme } from '@/contexts/theme';
import * as THREE from 'three';

function Ground() {
    const {theme} = useTheme();
    return <RigidBody colliders={"cuboid"} type="fixed" friction={1}>
        <Box args={[100, 1, 100]} position={[0, -0.51, 0]} receiveShadow>
            <meshStandardMaterial color={theme == "dark" ? "#333335" : "#99999B"} />
        </Box>
    </RigidBody>
}

function PhysicsScene(props: { children?: React.ReactNode }) {
    const texture = useLoader(THREE.TextureLoader, "/assets/textures/Conveyor.png");
    return <Suspense>
        <Physics>
            <Box position={[-7.5, 10, 0]} args={[1, 20, 20]}>
                <meshStandardMaterial color={"white"} />
            </Box>
            <Box position={[0, 10, -7.5]} args={[20, 20, 1]}>
                <meshStandardMaterial color={"white"} />
            </Box>
            <Storage position={{x: -2, y: 0, z: -6}} orientation={ConveyorOrientation.ZPOS} offset={0} interval={10000}/>
            <Storage position={{x: -6, y: 0, z: 2}} orientation={ConveyorOrientation.XPOS} offset={5000} interval={10000}>
                <Decal
                    debug // Makes "bounding box" of the decal visible
                    position={[-1, 2.8, -.25]} // Position of the decal
                    rotation={[-Math.PI / 8, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
                    scale={.5} // Scale of the decal
                >
                    <meshBasicMaterial
                        map={texture}
                        polygonOffset
                        polygonOffsetFactor={-1} // The material should take precedence over the original
                    />
                </Decal>
            </Storage>
            <ConveyorBelt position={{x: -2, y: 0, z: -4}} length={4} orientation={ConveyorOrientation.ZPOS} />
            <ConveyorBelt position={{x: -2, y: 0, z: 4}} length={2} orientation={ConveyorOrientation.XPOS} />
            <ConveyorBelt position={{x: 2, y: 0, z: 4}} length={4} orientation={ConveyorOrientation.ZNEG} />
            <ConveyorBelt position={{x: -4, y: 0, z: 2}} length={1} orientation={ConveyorOrientation.XPOS} />
            <ConveyorBelt position={{x: 2, y: 0, z: -4}} length={2} orientation={ConveyorOrientation.XNEG} />
            {props.children}
            <Ground/>
        </Physics>
    </Suspense>
}

const Shadows = () => {
    //   <AccumulativeShadows temporal frames={100} color="teal" colorBlend={0.5} alphaTest={0.9} scale={20} position={[0, .01, 0]}>
    //     <RandomizedLight amount={8} radius={4} position={[-20, 20, -10]} />
    //   </AccumulativeShadows>
    return <ContactShadows position={[0, 0, 0]} opacity={.5} scale={15} blur={.8} far={10} resolution={512} color="#404060" smooth/>
}

function Scene() {

    // const ref = useRef<THREE.Group>(null)
    // useFrame((state, delta) => {
    //     // Animate the environment as well as the camera
    //     // easing.damp3(ref.current.rotation, [Math.PI / 2, 0, state.clock.elapsedTime / 5 + state.pointer.x], 0.2, delta)
    //     easing.damp3(state.camera.position, [(Math.sin(state.pointer.x / 4) * 13) + 20, (1.25 - 1.25 + state.pointer.y) + 20, (Math.cos(state.pointer.x / 4) * 13) + 20], 0.5, delta)
    //     state.camera.lookAt(0, 0, 0)
    // })
    
    return <>
        {/* <Grid /> */}
        {/* <gridHelper args={[100, 100, 'white', 'white']} castShadow={false}/>*/}
        <Grid 
            infiniteGrid 
            fadeDistance={20} 
            fadeStrength={5}
            sectionColor="#858599" 
            sectionSize={8}
            sectionThickness={2}
            cellSize={1}
            cellThickness={1.5}
            cellColor="#858599" 
            fadeFrom={0}
            position={[0, .0001, 0]}
        /> 
        <Environment preset="city" />

        {/* LIGHTS */}
        {/* <spotLight
          penumbra={1}
          angle={-10}
          castShadow
          position={[10, 60, -5]}
          intensity={8}
          shadow-mapSize={[512, 512]}
        />
        <hemisphereLight intensity={0.2} />
        <ambientLight intensity={0.5} /> */}

        {/* ACTUAL SCENE */}
        <Shadows />
        <Suspense>
            <PhysicsScene/>
        </Suspense>
    </>
}

export function UnboxingCanvas() {

    return <Fragment>
        <Canvas
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, borderRadius: '8px' }}
            orthographic
            camera={{ zoom: 75, position: [20, 20, 20] }}
            shadows
        >
            <Stats className='bottom-0 flex items-end mb-1.5 ml-1.5' />
            <Scene />

            <OrbitControls 
                // autoRotate 
                // autoRotateSpeed={.5}
                enableRotate={false} 
                enableDamping={false} 
                enablePan={false} 
                enableZoom={false} 
            />

            {/* <EffectComposer autoClear={false}>
                <Outline
                    edgeStrength={100}
                    width={1000}
                />
            </EffectComposer> */}
        </Canvas>
        <Loader/>
    </Fragment>
}