import { RigidBody } from "@react-three/rapier";

// Charred Remains - represents burned bridges and destroyed relationships
const CharredRemains = ({ position, scale = 1 }) => {
  const pieces = 5 + Math.floor(Math.random() * 3);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {Array.from({ length: pieces }).map((_, i) => {
          const angle = (i / pieces) * Math.PI * 2;
          const radius = scale * (0.5 + Math.random() * 0.5);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.random() * scale * 0.3;
          const rotX = (Math.random() - 0.5) * 1.2;
          const rotZ = (Math.random() - 0.5) * 1.2;

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
                  scale * (0.2 + Math.random() * 0.3),
                  scale * (0.4 + Math.random() * 0.6),
                  scale * (0.15 + Math.random() * 0.25)
                ]}
              />
              <meshStandardMaterial
                color={`hsl(${15 + Math.random() * 10}, 30%, ${8 + Math.random() * 7}%)`}
                roughness={0.95}
                metalness={0.0}
                emissive="#8B0000"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default CharredRemains;
