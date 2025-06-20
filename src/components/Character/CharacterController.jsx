import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Character } from "./Character";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = ({
  terrainWidth,
  terrainLength,
  onPositionUpdate,
  initialCharacterPosition
}) => {
  const isTyping = () => {
    const el = document.activeElement;
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
  };

  const WALK_SPEED = 8;
  const RUN_SPEED = 10;
  const ROTATION_SPEED = degToRad(3);
  const JUMP_FORCE = 3; // Adjust this to control jump height
  const MAX_JUMP_VELOCITY = 4; // Maximum upward velocity allowed

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const [animation, setAnimation] = useState("idle");
  const [isGrounded, setIsGrounded] = useState(true);

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();

  const minX = -terrainWidth;
  const maxX = terrainWidth;
  const minZ = -terrainLength;
  const maxZ = terrainLength;
  useFrame(({ camera }) => {
    if (isTyping()) return;

    if (rb.current) {
      const pos = rb.current.translation();

      if (onPositionUpdate) {
        onPositionUpdate(pos);
      }

      const vel = rb.current.linvel();
      const movement = { x: 0, z: 0 };

      // Check if character is grounded (you might need to adjust this based on your terrain)
      setIsGrounded(pos.y <= 0.1); // Assuming ground level is at y=0

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;

      // Jump control
      if (get().jump && isGrounded && vel.y <= 1) {
        vel.y = JUMP_FORCE;
      }

      // Limit maximum upward velocity to control jump height
      if (vel.y > MAX_JUMP_VELOCITY) {
        vel.y = MAX_JUMP_VELOCITY;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        setAnimation(speed === RUN_SPEED ? "run" : "walk");
      } else {
        setAnimation("idle");

        // stop sliding effect when character stops moving
        vel.x = 0;
        vel.z = 0;

        // Reset vertical velocity when idle to prevent falling
        vel.y = 0;
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      // Cancel velocity if next position is out of bounds
      const nextX = pos.x + vel.x * 0.1;
      const nextZ = pos.z + vel.z * 0.1;

      if (nextX < minX || nextX > maxX) vel.x = 0;
      if (nextZ < minZ || nextZ > maxZ) vel.z = 0;

      // Reset vertical velocity if too low to prevent falling through terrain
      if (vel.y < -5) {
        vel.y = -5;
      }

      rb.current.setLinvel(vel, true);
    }

    // CAMERA FOLLOWING
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody
      lockRotations
      ref={rb}
      type="dynamic"
      mass={1}
      restitution={0.1}
      friction={0.8}
      gravityScale={1}
      position={initialCharacterPosition}
      colliders={false} // disable auto collider
    >
      {/* 👇 Custom Capsule Collider */}
      <CapsuleCollider args={[0.3, 0.8]} position={[0, 0.9, 0]} />

      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-8} />
        <group ref={character}>
          <Character scale={0.5} animation={animation} position={[0, 0.1, 0]} />
        </group>
      </group>
    </RigidBody>
  );
};
