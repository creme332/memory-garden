import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import Objects from "./Objects"; // Import the Objects component

const BeachObjects = ({ obstacles = [] }) => {
  const lighthouse = useGLTF("/models/happy/Lighthouse.glb");
  const beachchair = useGLTF("/models/happy/Beachchair.glb");
  const sandcastle = useGLTF("/models/happy/Sandcastle.glb");
  const seagull = useGLTF("/models/happy/Seagull.glb");
  const beachball = useGLTF("/models/happy/beachball.glb");
  const beachcabana = useGLTF("/models/happy/Beachcabana.glb");

  if (!obstacles || obstacles.length < 7) {
    console.warn("Not enough obstacle positions provided to BeachObjects");
    return null;
  }

  return (
    <>
      {/* Lighthouse - Top right */}
      <Objects object={lighthouse} position={obstacles[0].position} scale={2} />

      {/* Beach Chair - Bottom left */}
      <Objects
        object={beachchair}
        position={obstacles[1].position}
        scale={0.015}
      />

      {/* Sandcastle - Top left */}
      <Objects
        object={sandcastle}
        position={obstacles[2].position}
        scale={0.05}
      />

      {/* Seagull - Flying above center */}
      <Objects
        object={seagull}
        position={obstacles[3].position}
        scale={0.025}
      />

      {/* Beach Cabana - Floating above center */}
      <Objects
        object={beachcabana}
        position={obstacles[4].position}
        scale={0.009}
      />

      {/* Beachball - Floating near beach chair */}
      <Objects object={beachball} position={obstacles[5].position} scale={2} />

      {/* Beachball 2 - Floating near beach chair */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={obstacles[6].position} scale={0.5}>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default BeachObjects;
