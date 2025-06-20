import { RigidBody } from "@react-three/rapier";

// Withered Tree Stump - represents lost growth and faded life
const WitheredStump = ({ position = [0, 0, 0], scale = 1 }) => {
  const branches = 3 + Math.floor(Math.random() * 3);

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Main stump */}
        <mesh position={[0, scale * 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[scale * 0.4, scale * 0.5, scale * 1.2, 8]} />
          <meshStandardMaterial
            color="#3a2f2a"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>

        {/* Broken branches */}
        {Array.from({ length: branches }).map((_, i) => {
          const angle = (i / branches) * Math.PI * 2;
          const length = scale * (0.4 + Math.random() * 0.3);
          const x = Math.cos(angle) * scale * 0.2;
          const z = Math.sin(angle) * scale * 0.2;

          return (
            <mesh
              key={i}
              position={[x, scale * (0.8 + Math.random() * 0.4), z]}
              rotation={[
                Math.random() * 0.5,
                angle,
                (Math.random() - 0.5) * 0.8
              ]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[scale * 0.05, scale * 0.08, length, 6]}
              />
              <meshStandardMaterial
                color="#2d2419"
                roughness={1.0}
                metalness={0.0}
              />
            </mesh>
          );
        })}
      </group>
    </RigidBody>
  );
};

export default WitheredStump;
