import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Rain = ({ terrainWidth, terrainLength, position, count }) => {
  const meshRef = useRef();

  // Generate initial positions and velocities
  const rainData = useMemo(() => {
    const positions = [];
    const velocities = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * (terrainWidth / 2);
      const y = Math.random() * 50 + 10;
      const z = (Math.random() * 2 - 1) * (terrainLength / 2);

      positions.push(new THREE.Vector3(x, y, z));
      velocities.push(Math.random() * 0.1 + 0.1);
    }

    return { positions, velocities };
  }, [terrainWidth, terrainLength, count]);

  // Animate the rain
  useFrame(() => {
    const { positions, velocities } = rainData;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const pos = positions[i];
      pos.y -= velocities[i];

      if (pos.y < -5) {
        pos.y = 50;
        pos.x = (Math.random() * 2 - 1) * (terrainWidth / 2);
        pos.z = (Math.random() * 2 - 1) * (terrainLength / 2);
      }

      const dummy = new THREE.Object3D();
      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh position={position} ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="lightblue" />
    </instancedMesh>
  );
};

export default Rain;
