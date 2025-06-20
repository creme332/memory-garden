import { RigidBody } from "@react-three/rapier";

// Molten Boulder - represents burning anger and heated emotions
const MoltenBoulder = ({ position, scale = 1 }) => {
  const fragments = 4 + Math.floor(Math.random() * 3);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Main boulder */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[scale * 0.8, 1]} />
          <meshStandardMaterial
            color="#8B0000"
            roughness={0.8}
            metalness={0.2}
            emissive="#FF4500"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Glowing fragments */}
        {Array.from({ length: fragments }).map((_, i) => {
          const angle = (i / fragments) * Math.PI * 2;
          const radius = scale * (0.6 + Math.random() * 0.4);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.random() * scale * 0.3;

          return (
            <mesh
              key={i}
              position={[x, y, z]}
              rotation={[
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
              ]}
              castShadow
              receiveShadow
            >
              <octahedronGeometry
                args={[scale * (0.2 + Math.random() * 0.3), 0]}
              />
              <meshStandardMaterial
                color="#DC143C"
                roughness={0.6}
                metalness={0.3}
                emissive="#FF6347"
                emissiveIntensity={0.4}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default MoltenBoulder;
