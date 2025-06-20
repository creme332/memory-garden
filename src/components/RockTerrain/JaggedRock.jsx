import { RigidBody } from "@react-three/rapier";

// Jagged Rock Formation - represents emotional pain and sharp memories
const JaggedRock = ({ position = [0, 0, 0], scale = 1 }) => {
  const spikes = 5 + Math.floor(Math.random() * 3);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Base rock */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[scale * 0.6, 0]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={1.0}
            metalness={0.0}
          />
        </mesh>

        {/* Jagged spikes */}
        {Array.from({ length: spikes }).map((_, i) => {
          const angle = (i / spikes) * Math.PI * 2;
          const height = scale * (0.8 + Math.random() * 0.6);
          const x = Math.cos(angle) * scale * 0.3;
          const z = Math.sin(angle) * scale * 0.3;

          return (
            <mesh
              key={i}
              position={[x, height * 0.4, z]}
              rotation={[
                (Math.random() - 0.5) * 0.3,
                angle,
                (Math.random() - 0.5) * 0.3
              ]}
              castShadow
              receiveShadow
            >
              <coneGeometry args={[scale * 0.15, height, 4]} />
              <meshStandardMaterial
                color={`hsl(220, 10%, ${20 + Math.random() * 10}%)`}
                roughness={0.95}
                metalness={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default JaggedRock;
