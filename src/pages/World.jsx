import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";
import Terrain from "../components/Terrain";

import { CharacterController } from "../components/Character/CharacterController";

export const TERRAIN_WIDTH = 100;
export const TERRAIN_LENGTH = 100;

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] }
];

export default function World() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 m-0 p-0 overflow-hidden">
      <Canvas className="w-full h-full">
        <ambientLight intensity={1} />

        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Suspense fallback={null}>
          <Physics options={{ gravity: [0, -9.81, 0], debug: true }}>
            <Terrain
              terrainLength={TERRAIN_LENGTH}
              terrainWidth={TERRAIN_WIDTH}
              position={[0, 0, 0]}
            ></Terrain>

            <KeyboardControls map={keyboardMap}>
              <CharacterController
                terrainWidth={TERRAIN_WIDTH}
                terrainLength={TERRAIN_LENGTH}
              />
            </KeyboardControls>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
