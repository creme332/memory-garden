import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

function useKeyboard() {
  const keys = useRef({});

  useEffect(() => {
    const handleKey = (e) => {
      keys.current[e.code] = e.type === "keydown";
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  return keys;
}

export default function VRMode({
  terrainWidth,
  terrainLength,
  onPositionUpdate
}) {
  const minHeight = 3;
  const maxHeight = 10;
  const moveSpeed = 10;

  const minX = -terrainWidth;
  const maxX = terrainWidth;
  const minZ = -terrainLength;
  const maxZ = terrainLength;

  const { camera } = useThree();
  const direction = useMemo(() => new THREE.Vector3(), []);
  const keys = useKeyboard();

  useEffect(() => {
    onPositionUpdate({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    });
  }, [camera.position, onPositionUpdate]);

  useFrame((_, delta) => {
    direction.set(0, 0, 0);

    // Support WASD and Arrow keys
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) direction.z -= 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) direction.z += 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) direction.x -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) direction.x += 1;

    direction.normalize();
    direction.applyEuler(camera.rotation);
    direction.multiplyScalar(delta * moveSpeed);

    camera.position.add(direction);

    // Clamp camera width
    if (camera.position.x < minX) camera.position.x = minX;
    if (camera.position.x > maxX) camera.position.x = maxX;

    // Clamp camera length
    if (camera.position.z < minZ) camera.position.z = minZ;
    if (camera.position.z > maxZ) camera.position.z = maxZ;

    // Clamp camera height
    if (camera.position.y < minHeight) camera.position.y = minHeight;
    if (camera.position.y > maxHeight) camera.position.y = maxHeight;

    // Update position after all movements and clamps
    onPositionUpdate({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    });
  });

  return <PointerLockControls />;
}
