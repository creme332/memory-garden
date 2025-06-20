import { RigidBody } from "@react-three/rapier";

// Lava Geyser - represents explosive outbursts of rage
const LavaGeyser = ({ position, height = 3 }) => {
  const segments = 6;

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Base pool */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 0.8, 0.4, 8]} />
          <meshStandardMaterial
            color="#B22222"
            roughness={0.3}
            metalness={0.1}
            emissive="#FF4500"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Geyser column segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const y = (i * height) / segments;
          const radius = 0.3 + Math.sin(i * 0.8) * 0.15;
          const offsetX = Math.sin(i * 0.4) * 0.1;
          const offsetZ = Math.cos(i * 0.4) * 0.1;

          return (
            <mesh
              key={i}
              position={[offsetX, y, offsetZ]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[radius, radius * 0.8, height / segments, 6]}
              />
              <meshStandardMaterial
                color={`hsl(${15 - i * 2}, 80%, ${50 - i * 3}%)`}
                roughness={0.4}
                metalness={0.2}
                emissive="#FF6347"
                emissiveIntensity={0.6 - i * 0.1}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default LavaGeyser;
