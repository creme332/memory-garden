import { useMemo, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import GlobalTerrain from "../GlobalTerrain";
import EmotionObject from "../EmotionObject";
import WeatheredPillar from "./WeatheredPillar";
import CrumbledRuin from "./CrumbledRuin";
import JaggedRock from "./JaggedRock";
import WitheredStump from "./WitheredStump";
import { generateRandomPosition, placeNewTree } from "./placementUtils";

const Terrain = ({
  terrainWidth,
  terrainLength,
  position,
  journal = [],
  onDeleteEntry,
  displayDeleteConfirmation,
  setSelectedEntryId,
  onOpenMemoryForm,
  newJournalEntryId
}) => {
  const enableDebugLog = false;

  // Use ref to persist tree positions across re-renders
  const treePositionsRef = useRef(new Map());

  // Generate additional terrain assets (only once)
  const terrainAssets = useMemo(() => {
    const assets = [];

    // Generate jagged rocks
    for (let i = 0; i < 6; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 5);
      assets.push({
        type: "jaggedRock",
        position: pos,
        scale: 0.8 + Math.random() * 1.2,
        id: `jagged-rock-${i}`
      });
    }

    // Generate weathered pillars
    for (let i = 0; i < 4; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 6);
      assets.push({
        type: "weatheredPillar",
        position: pos,
        height: 3 + Math.random() * 4,
        id: `pillar-${i}`
      });
    }

    // Generate crumbled ruins
    for (let i = 0; i < 5; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 4);
      assets.push({
        type: "crumbledRuin",
        position: pos,
        size: 1.5 + Math.random() * 1.0,
        id: `ruin-${i}`
      });
    }

    // Generate withered stumps
    for (let i = 0; i < 3; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 3);
      assets.push({
        type: "witheredStump",
        position: pos,
        scale: 0.7 + Math.random() * 0.6,
        id: `stump-${i}`
      });
    }

    return assets;
  }, [terrainWidth, terrainLength]);

  // Stable tree positioning system
  const treePositions = useMemo(() => {
    const positions = [];
    const existingPositions = [];

    // Get existing positions from our persistent map
    journal.forEach((entry) => {
      if (treePositionsRef.current.has(entry.id)) {
        const pos = treePositionsRef.current.get(entry.id);
        positions.push(pos);
        existingPositions.push(pos);
      } else {
        // This is a new entry, find a position for it
        const newPos = placeNewTree(
          existingPositions,
          terrainWidth,
          terrainLength,
          terrainAssets,
          enableDebugLog
        );

        // Store the position persistently
        treePositionsRef.current.set(entry.id, newPos);
        positions.push(newPos);
        existingPositions.push(newPos);
      }
    });

    // Clean up positions for deleted entries
    const currentEntryIds = new Set(journal.map((entry) => entry.id));
    for (const [entryId] of treePositionsRef.current) {
      if (!currentEntryIds.has(entryId)) {
        treePositionsRef.current.delete(entryId);
      }
    }

    return positions;
  }, [journal, terrainWidth, terrainLength, terrainAssets, enableDebugLog]);

  // Render terrain asset component based on type
  const renderTerrainAsset = (asset) => {
    switch (asset.type) {
      case "jaggedRock":
        return (
          <JaggedRock
            key={asset.id}
            position={asset.position}
            scale={asset.scale}
          />
        );
      case "weatheredPillar":
        return (
          <WeatheredPillar
            key={asset.id}
            position={asset.position}
            height={asset.height}
          />
        );
      case "crumbledRuin":
        return (
          <CrumbledRuin
            key={asset.id}
            position={asset.position}
            size={asset.size}
          />
        );
      case "witheredStump":
        return (
          <WitheredStump
            key={asset.id}
            position={asset.position}
            scale={asset.scale}
          />
        );
      default:
        return null;
    }
  };

  return (
    <group position={position}>
      {/* Terrain base */}
      <GlobalTerrain
        terrainWidth={terrainWidth}
        terrainLength={terrainLength}
        colorMapPath="/textures/rock/Rock030_1K-JPG_Color.jpg"
        normalMapPath="/textures/rock/Rock030_1K-JPG_NormalGL.jpg"
        roughnessMapPath="/textures/rock/Rock030_1K-JPG_Roughness.jpg"
      />

      {/* Trees with stable positioning */}
      {journal.map((entry, idx) => {
        const pos = treePositions[idx] || [0, 1, 0]; // Fallback position
        return (
          <RigidBody key={entry.id} type="fixed" colliders="trimesh">
            <EmotionObject
              position={[pos[0], 0, pos[2]]}
              journalEntry={entry}
              onDelete={onDeleteEntry}
              displayDeleteConfirmation={displayDeleteConfirmation}
              setSelectedEntryId={setSelectedEntryId}
              onOpenMemoryForm={onOpenMemoryForm}
              pathToModel="/models/FallTree.glb"
              scale={1}
              isNew={entry.id === newJournalEntryId}
            />
          </RigidBody>
        );
      })}

      {/* Additional terrain assets */}
      {terrainAssets.map(renderTerrainAsset)}

      {/* Atmospheric lighting for melancholic mood */}
      <ambientLight intensity={0.2} color="#4a5568" />
      <directionalLight
        position={[10, 8, 5]}
        intensity={0.3}
        color="#6b7280"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {/* Subtle rim lighting to enhance mood */}
      <directionalLight
        position={[-5, 6, -8]}
        intensity={0.15}
        color="#8b9dc3"
      />
    </group>
  );
};

export default Terrain;
