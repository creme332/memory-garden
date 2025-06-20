import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const Rocks = ({ url, positions }) => {
  const { scene } = useGLTF(url);
  if (!scene) return null;

  // Prepare a function to generate a perfectly grounded instance
  const getClonedGroundedScene = () => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const bottom = box.min.y;
    cloned.position.y = -bottom;
    return cloned;
  };

  return (
    <>
      {positions.map((position, i) => (
        <RigidBody key={i} type="fixed" colliders="trimesh" position={position}>
          <primitive
            object={getClonedGroundedScene()}
            scale={3}
            castShadow
            receiveShadow
          />
        </RigidBody>
      ))}
    </>
  );
};

export default Rocks;
