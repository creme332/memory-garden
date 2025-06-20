import { RigidBody } from "@react-three/rapier";

// Weathered Stone Pillar - represents isolation and endurance through hardship
const WeatheredPillar = ({ position = [0, 0, 0], height = 4 }) => {
  const segments = 8;

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Main pillar with irregular segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const y = (i * height) / segments;
          const radius = 0.4 + Math.sin(i * 0.5) * 0.15;
          const offsetX = Math.sin(i * 0.3) * 0.1;
          const offsetZ = Math.cos(i * 0.3) * 0.1;

          return (
            <mesh
              key={i}
              position={[offsetX, y, offsetZ]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[radius, radius * 0.9, height / segments, 6]}
              />
              <meshStandardMaterial
                color={`hsl(${200 + i * 2}, 15%, ${25 - i}%)`}
                roughness={0.95}
                metalness={0.05}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default WeatheredPillar;
