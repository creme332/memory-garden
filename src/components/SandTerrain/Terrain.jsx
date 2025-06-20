import GlobalTerrain from "../GlobalTerrain";
import EmotionObject from "../EmotionObject";
import BeachObjects from "./BeachObjects";
import { useMemo, useRef } from "react";
import { TERRAIN_WIDTH, TERRAIN_LENGTH } from "../../pages/World";

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
  const BOUNDARY_X_MIN = -TERRAIN_WIDTH / 2 + 5;
  const BOUNDARY_X_MAX = TERRAIN_WIDTH / 2 - 5;
  const BOUNDARY_Z_MIN = -TERRAIN_LENGTH / 2 + 5;
  const BOUNDARY_Z_MAX = TERRAIN_LENGTH / 2 - 5;

  // Helper function to check if position is valid
  const isValidPosition = (position, obstacles) => {
    const [x, , z] = position;
    // Check if position is within terrain bounds
    if (
      x < BOUNDARY_X_MIN ||
      x > BOUNDARY_X_MAX ||
      z < BOUNDARY_Z_MIN ||
      z > BOUNDARY_Z_MAX
    ) {
      return false;
    }

    // Check against obstacles using grid-based collision detection
    for (const obstacle of obstacles) {
      const dist = Math.sqrt(
        Math.pow(obstacle.position[0] - x, 2) +
          Math.pow(obstacle.position[2] - z, 2)
      );
      if (dist < obstacle.radius) {
        return false;
      }
    }
    return true;
  };

  // Function to generate tree positions
  const generatePosition = (positions, obstacles) => {
    for (let x = BOUNDARY_X_MAX; x >= BOUNDARY_X_MIN; x -= 8) {
      for (let z = BOUNDARY_X_MAX; z >= BOUNDARY_X_MIN; z -= 8) {
        const position = [x, 0, z];

        // Check if the position already exists in positions array
        const isPositionUnique = !positions.some(
          (existingPos) =>
            existingPos[0] === position[0] && existingPos[2] === position[2]
        );

        if (isPositionUnique && isValidPosition(position, obstacles)) {
          return position;
        }
      }
    }
  };

  // Get all obstacles in the scene
  const obstacles = useMemo(
    () => [
      {
        position: [-TERRAIN_WIDTH / 2 + 8, 0.5, -TERRAIN_LENGTH / 2 + 8],
        radius: 5
      }, // Lighthouse
      {
        position: [-TERRAIN_WIDTH / 2 + 40, 0, -TERRAIN_LENGTH / 2 + 13],
        radius: 2
      }, // Beach Chair
      {
        position: [-TERRAIN_WIDTH / 2 + 8, 0, TERRAIN_LENGTH / 2 - 8],
        radius: 3
      }, // Sandcastle
      {
        position: [-TERRAIN_WIDTH / 2 + 37, 0, -TERRAIN_LENGTH / 2 + 44],
        radius: 1
      }, // Seagull
      {
        position: [0, 0.02, 0],
        radius: 10
      }, // Beach Cabana
      {
        position: [-TERRAIN_WIDTH / 2 + 40, 0.2, -TERRAIN_LENGTH / 2 + 40],
        radius: 1
      }, // Beachball
      {
        position: [-TERRAIN_WIDTH / 2 + 32, 0.2, -TERRAIN_LENGTH / 2 + 42],
        radius: 1
      } // Beachball 2
    ],
    []
  );

  // Use ref to persist tree positions across re-renders
  const treePositionsRef = useRef(new Map());

  // Memoized tree positions
  const treePositions = useMemo(() => {
    const positions = [];

    // Get existing positions from our persistent map
    journal.forEach((entry) => {
      if (treePositionsRef.current.has(entry.id)) {
        const pos = treePositionsRef.current.get(entry.id);
        positions.push(pos);
      } else {
        const newPos = generatePosition(positions, obstacles);
        if (newPos) {
          treePositionsRef.current.set(entry.id, newPos);
          positions.push(newPos);
        }
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
  }, [journal, obstacles]);

  const Terrain = useMemo(
    () => (
      <GlobalTerrain
        terrainWidth={terrainWidth}
        terrainLength={terrainLength}
        colorMapPath="/textures/sand/aerial_beach_01_diff_1k.jpg"
        normalMapPath="/textures/sand/aerial_beach_01_nor_gl_1k.jpg"
        roughnessMapPath="/textures/sand/aerial_beach_01_rough_1k.jpg"
      />
    ),
    [terrainWidth, terrainLength]
  );

  const memoizedBeachObjects = useMemo(
    () => <BeachObjects obstacles={obstacles} />,
    [obstacles]
  );

  return (
    <group position={position}>
      {/* Trees */}
      {treePositions.map((pos, idx) => (
        <EmotionObject
          key={journal[idx]?.id || idx} // Use journal entry ID for key if it exists, fallback to index
          position={pos}
          journalEntry={journal[idx]}
          onDelete={onDeleteEntry}
          displayDeleteConfirmation={displayDeleteConfirmation}
          setSelectedEntryId={setSelectedEntryId}
          onOpenMemoryForm={onOpenMemoryForm}
          pathToModel="/models/happy/Palmtree.glb"
          scale={2}
          isNew={journal[idx].id === newJournalEntryId}
        />
      ))}

      {/* Terrain */}
      {Terrain}

      {/* Beach Objects */}
      {memoizedBeachObjects}
    </group>
  );
};

export default Terrain;
