import { useMemo, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import GlobalTerrain from "../GlobalTerrain";
import MoltenBoulder from "./MoltenBoulder";
import CharredRemains from "./CharredRemains";
import ObsidianSpire from "./ObsidianSpire";
import LavaGeyser from "./LavaGeyser";
import { placeNewDeadTree, generateRandomPosition } from "./utils";
import EmotionObject from "../EmotionObject";

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

  // Use ref to persist dead tree positions across re-renders
  const deadTreePositionsRef = useRef(new Map());

  // Generate additional lava terrain assets (only once)
  const terrainAssets = useMemo(() => {
    const assets = [];

    // Generate molten boulders
    for (let i = 0; i < 8; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 4);
      assets.push({
        type: "moltenBoulder",
        position: pos,
        scale: 0.8 + Math.random() * 1.0,
        id: `molten-boulder-${i}`
      });
    }

    // Generate lava geysers
    for (let i = 0; i < 5; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 6);
      assets.push({
        type: "lavaGeyser",
        position: pos,
        height: 2.5 + Math.random() * 2.0,
        id: `lava-geyser-${i}`
      });
    }

    // Generate obsidian spires
    for (let i = 0; i < 6; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 5);
      assets.push({
        type: "obsidianSpire",
        position: pos,
        scale: 0.7 + Math.random() * 0.8,
        id: `obsidian-spire-${i}`
      });
    }

    // Generate charred remains
    for (let i = 0; i < 4; i++) {
      const pos = generateRandomPosition(terrainWidth, terrainLength, 3);
      assets.push({
        type: "charredRemains",
        position: pos,
        scale: 1.0 + Math.random() * 0.5,
        id: `charred-remains-${i}`
      });
    }

    return assets;
  }, [terrainWidth, terrainLength]);

  // Stable dead tree positioning system
  const deadTreePositions = useMemo(() => {
    const positions = [];
    const existingPositions = [];

    // Get existing positions from our persistent map
    journal.forEach((entry) => {
      if (deadTreePositionsRef.current.has(entry.id)) {
        const pos = deadTreePositionsRef.current.get(entry.id);
        positions.push(pos);
        existingPositions.push(pos);
      } else {
        // This is a new entry, find a position for it
        const newPos = placeNewDeadTree(
          existingPositions,
          terrainWidth,
          terrainLength,
          terrainAssets,
          enableDebugLog
        );

        // Store the position persistently
        deadTreePositionsRef.current.set(entry.id, newPos);
        positions.push(newPos);
        existingPositions.push(newPos);
      }
    });

    // Clean up positions for deleted entries
    const currentEntryIds = new Set(journal.map((entry) => entry.id));
    for (const [entryId] of deadTreePositionsRef.current) {
      if (!currentEntryIds.has(entryId)) {
        deadTreePositionsRef.current.delete(entryId);
      }
    }

    return positions;
  }, [journal, terrainWidth, terrainLength, terrainAssets, enableDebugLog]);

  return (
    <group position={position}>
      {/* Terrain base */}
      <GlobalTerrain
        terrainWidth={terrainWidth}
        terrainLength={terrainLength}
        colorMapPath="/textures/lava/Lava002_1K-JPG_Color.jpg"
        normalMapPath="/textures/lava/Lava002_1K-JPG_NormalGL.jpg"
        roughnessMapPath="/textures/lava/Lava002_1K-JPG_Roughness.jpg"
      />

      {/* Dead Trees with stable positioning */}
      {journal.map((entry, idx) => {
        const pos = deadTreePositions[idx] || [0, 1, 0]; // Fallback position
        return (
          <RigidBody key={entry.id} type="fixed" colliders="trimesh">
            <EmotionObject
              position={[pos[0], 0, pos[2]]}
              journalEntry={journal[idx]}
              onDelete={onDeleteEntry}
              displayDeleteConfirmation={displayDeleteConfirmation}
              setSelectedEntryId={setSelectedEntryId}
              onOpenMemoryForm={onOpenMemoryForm}
              pathToModel={"/models/deadTree.glb"}
              scale={0.8}
              isNew={entry.id === newJournalEntryId}
            />
          </RigidBody>
        );
      })}

      {/* Additional lava terrain assets */}
      {terrainAssets.map((asset) => {
        switch (asset.type) {
          case "moltenBoulder":
            return (
              <MoltenBoulder
                key={asset.id}
                position={asset.position}
                scale={asset.scale}
              />
            );
          case "lavaGeyser":
            return (
              <LavaGeyser
                key={asset.id}
                position={asset.position}
                height={asset.height}
              />
            );
          case "obsidianSpire":
            return (
              <ObsidianSpire
                key={asset.id}
                position={asset.position}
                scale={asset.scale}
              />
            );
          case "charredRemains":
            return (
              <CharredRemains
                key={asset.id}
                position={asset.position}
                scale={asset.scale}
              />
            );
          default:
            return null;
        }
      })}

      {/* Intense lighting for fiery mood */}
      <ambientLight intensity={0.3} color="#8B0000" />
      <directionalLight
        position={[10, 8, 5]}
        intensity={0.4}
        color="#FF6347"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {/* Dramatic rim lighting for volcanic atmosphere */}
      <directionalLight
        position={[-5, 6, -8]}
        intensity={0.25}
        color="#FF4500"
      />
      {/* Additional warm fill light */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.3}
        color="#DC143C"
        distance={30}
        decay={2}
      />
    </group>
  );
};

export default Terrain;
