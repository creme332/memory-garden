import { RigidBody } from "@react-three/rapier";

// Obsidian Spire - represents sharp, cutting rage
const ObsidianSpire = ({ position, scale = 1 }) => {
  const shards = 3 + Math.floor(Math.random() * 2);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Main spire */}
        <mesh position={[0, scale * 1.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[scale * 0.5, scale * 3, 6]} />
          <meshStandardMaterial
            color="#2F2F2F"
            roughness={0.1}
            metalness={0.8}
            emissive="#8B0000"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Sharp shards */}
        {Array.from({ length: shards }).map((_, i) => {
          const angle = (i / shards) * Math.PI * 2;
          const height = scale * (1.0 + Math.random() * 0.8);
          const x = Math.cos(angle) * scale * 0.4;
          const z = Math.sin(angle) * scale * 0.4;

          return (
            <mesh
              key={i}
              position={[x, height * 0.5, z]}
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
                color="#1C1C1C"
                roughness={0.2}
                metalness={0.9}
                emissive="#FF4500"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default ObsidianSpire;
