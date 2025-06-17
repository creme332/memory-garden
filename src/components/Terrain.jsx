import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";

const Terrain = ({
  terrainWidth,
  terrainLength,
  position,
  segments = 32,
  textureRepeatScale = 4,
  colorMapPath = "/textures/Grass/Grass005_1K-JPG_Color.jpg",
  normalMapPath = "/textures/Grass/Grass005_1K-JPG_NormalGL.jpg",
  roughnessMapPath = "/textures/Grass/Grass005_1K-JPG_Roughness.jpg"
}) => {
  const [colorMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    colorMapPath,
    normalMapPath,
    roughnessMapPath
  ]);

  const repeatX = terrainWidth / textureRepeatScale;
  const repeatZ = terrainLength / textureRepeatScale;

  [colorMap, normalMap, roughnessMap].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatZ);
  });

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      terrainWidth,
      terrainLength,
      segments,
      segments
    );
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [terrainWidth, terrainLength, segments]);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh geometry={geometry} position={position} receiveShadow castShadow>
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
        />
      </mesh>
    </RigidBody>
  );
};

export default Terrain;
