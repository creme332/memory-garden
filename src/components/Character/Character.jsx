/**
 * Character.jsx
 *
 * This component defines a 3D animated character using React Three Fiber and Drei.
 * It loads a GLTF model, manages animation playback (e.g., idle, walk, run),
 * and provides the necessary mesh and skeleton setup for real-time rendering.
 *
 * Adapted from: https://youtu.be/yjpGVIe_Gy8?si=0gpRZ3RdC7NPE_KQ
 */

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const MODEL_URL = "/models/character.glb";
export function Character({ animation, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.24).play();
    return () => actions?.[animation]?.fadeOut(0.24);
  }, [animation, actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="fall_guys">
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name="body"
            geometry={nodes.body.geometry}
            material={materials.Material}
            skeleton={nodes.body.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="eye"
            geometry={nodes.eye.geometry}
            material={materials.Material}
            skeleton={nodes.eye.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="hand-"
            geometry={nodes["hand-"].geometry}
            material={materials.Material}
            skeleton={nodes["hand-"].skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="leg"
            geometry={nodes.leg.geometry}
            material={materials.Material}
            skeleton={nodes.leg.skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
