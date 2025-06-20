import { RigidBody } from "@react-three/rapier";

const Objects = ({ object, position = [0, 0, 0], scale = 1 }) => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <primitive object={object.scene} position={position} scale={scale} />
    </RigidBody>
  );
};

export default Objects;
