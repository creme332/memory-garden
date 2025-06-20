import GlobalTerrain from "../GlobalTerrain";
import Rocks from "./Rocks";
import Tree from "./Tree";
import { useMemo, useState } from "react";

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
  const [rockPositions, setRockPositions] = useState([]);

  const globalTerrain = useMemo(() => {
    return (
      <GlobalTerrain
        terrainWidth={terrainWidth}
        terrainLength={terrainLength}
        colorMapPath="/textures/Grass/Grass005_1K-JPG_Color.jpg"
        normalMapPath="/textures/Grass/Grass005_1K-JPG_NormalGL.jpg"
        roughnessMapPath="/textures/Grass/Grass005_1K-JPG_Roughness.jpg"
      />
    );
  }, [terrainWidth, terrainLength]);

  const rocks = useMemo(() => {
    // Generate positions for rocks
    const minX = -terrainWidth / 2 + 10;
    const maxX = terrainWidth / 2 - 10;
    const minZ = -terrainLength / 2 + 10;
    const maxZ = terrainLength / 2 - 10;

    const positions = [];

    for (let i = maxX; i >= minX; i -= 10) {
      for (let j = maxZ; j >= minZ; j -= 10) {
        positions.push([i, 0, j]);
      }
    }

    setRockPositions(positions);

    return <Rocks url="/models/Rock.glb" positions={positions} />;
  }, [terrainWidth, terrainLength, setRockPositions]);

  const trees = useMemo(() => {
    return (
      <Tree
        journal={journal}
        terrainWidth={terrainWidth}
        terrainLength={terrainLength}
        onDeleteEntry={onDeleteEntry}
        displayDeleteConfirmation={displayDeleteConfirmation}
        setSelectedEntryId={setSelectedEntryId}
        onOpenMemoryForm={onOpenMemoryForm}
        obstaclesPositions={rockPositions}
        newJournalEntryId={newJournalEntryId}
      />
    );
  }, [
    terrainWidth,
    terrainLength,
    journal,
    onDeleteEntry,
    displayDeleteConfirmation,
    setSelectedEntryId,
    onOpenMemoryForm,
    rockPositions
  ]);

  return (
    <group position={position}>
      {/* Trees placed according to the new pattern */}
      {trees}

      {/*terrain*/}
      {globalTerrain}

      {/* Add rocks in a grid pattern */}
      {rocks}
    </group>
  );
};

export default Terrain;
