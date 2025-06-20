import { RigidBody } from "@react-three/rapier";

// Crumbling Ruins - represents decay and lost hope
const CrumbledRuin = ({ position = [0, 0, 0], size = 1 }) => {
  const pieces = 6 + Math.floor(Math.random() * 4);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {Array.from({ length: pieces }).map((_, i) => {
          const angle = (i / pieces) * Math.PI * 2;
          const radius = size * (0.8 + Math.random() * 0.4);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.random() * size * 0.5;
          const rotX = (Math.random() - 0.5) * 0.8;
          const rotZ = (Math.random() - 0.5) * 0.8;

          return (
            <mesh
              key={i}
              position={[x, y, z]}
              rotation={[rotX, angle, rotZ]}
              castShadow
              receiveShadow
            >
              <boxGeometry
                args={[
                  size * (0.3 + Math.random() * 0.4),
                  size * (0.5 + Math.random() * 0.8),
                  size * (0.2 + Math.random() * 0.3)
                ]}
              />
              <meshStandardMaterial
                color={`hsl(25, 20%, ${15 + Math.random() * 10}%)`}
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default CrumbledRuin;
