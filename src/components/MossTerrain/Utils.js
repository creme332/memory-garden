const isValidPosition = (position, obstacles) => {
  const [x, , z] = position;

  // Check against obstacles using grid-based collision detection
  for (const obstacle of obstacles) {
    const distSquared =
      Math.pow(obstacle.position[0] - x, 2) +
      Math.pow(obstacle.position[2] - z, 2);
    if (distSquared < obstacle.radius ** 2) return false;
  }
  return true;
};

const generatePosition = (
  positions,
  obstacles,
  terrainWidth,
  terrainLength
) => {
  const minX = -terrainWidth / 2 + 5;
  const maxX = terrainWidth / 2 - 5;
  const minZ = -terrainLength / 2 + 5;
  const maxZ = terrainLength / 2 - 5;

  const treeSpacing = 10;

  for (let x = maxX; x >= minX; x -= treeSpacing) {
    for (let z = minZ; z <= maxZ; z += treeSpacing) {
      const position = [x, 0, z];

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

export const generateTreePositions = (
  journal,
  obstaclesPositions,
  treePositionsRef,
  terrainWidth,
  terrainLength
) => {
  const positions = [];

  journal.forEach((entry) => {
    if (treePositionsRef.current.has(entry.id)) {
      const pos = treePositionsRef.current.get(entry.id);
      positions.push(pos);
    } else {
      const newPos = generatePosition(
        positions,
        obstaclesPositions,
        terrainWidth,
        terrainLength
      );
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
};
