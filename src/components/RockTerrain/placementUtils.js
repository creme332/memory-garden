// Utility functions for placement algorithms
export const generateRandomPosition = (width, length, margin = 2) => {
  return [
    (Math.random() - 0.5) * (width - margin * 2),
    0, // Start from ground level
    (Math.random() - 0.5) * (length - margin * 2)
  ];
};

export const createSpatialGrid = (width, length, cellSize = 5) => {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(length / cellSize);
  return {
    cols,
    rows,
    cellSize,
    grid: Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => [])
      )
  };
};

export const addToGrid = (grid, position, object) => {
  const col = Math.floor(
    (position[0] + (grid.cols * grid.cellSize) / 2) / grid.cellSize
  );
  const row = Math.floor(
    (position[2] + (grid.rows * grid.cellSize) / 2) / grid.cellSize
  );

  if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) {
    grid.grid[row][col].push({ position, object });
  }
};

export const getGridNeighbors = (grid, position, radius = 1) => {
  const col = Math.floor(
    (position[0] + (grid.cols * grid.cellSize) / 2) / grid.cellSize
  );
  const row = Math.floor(
    (position[2] + (grid.rows * grid.cellSize) / 2) / grid.cellSize
  );

  const neighbors = [];
  for (
    let r = Math.max(0, row - radius);
    r <= Math.min(grid.rows - 1, row + radius);
    r++
  ) {
    for (
      let c = Math.max(0, col - radius);
      c <= Math.min(grid.cols - 1, col + radius);
      c++
    ) {
      neighbors.push(...grid.grid[r][c]);
    }
  }
  return neighbors;
};

// Smart tree placement algorithm - now only places new trees
export const placeNewTree = (
  existingPositions,
  terrainWidth,
  terrainLength,
  existingObstacles = [],
  debugLog = false
) => {
  const spatialGrid = createSpatialGrid(terrainWidth, terrainLength);

  // Add existing positions to spatial grid
  existingPositions.forEach((pos, idx) => {
    addToGrid(spatialGrid, pos, { type: "tree", id: idx });
  });

  // Add existing obstacles to spatial grid
  existingObstacles.forEach((obstacle) => {
    addToGrid(spatialGrid, obstacle.position, obstacle);
  });

  const maxAttempts = 100; // Prevent infinite loops
  let attempts = 0;

  if (debugLog) {
    console.log(
      `Placing new tree on ${terrainWidth}x${terrainLength} terrain with ${existingPositions.length} existing trees`
    );
  }

  for (attempts = 0; attempts < maxAttempts; attempts++) {
    const candidatePos = generateRandomPosition(terrainWidth, terrainLength, 3);

    // Check against spatial grid neighbors
    const neighbors = getGridNeighbors(spatialGrid, candidatePos, 1);
    const hasCollision = neighbors.some((neighbor) => {
      const dx = candidatePos[0] - neighbor.position[0];
      const dz = candidatePos[2] - neighbor.position[2];
      return Math.sqrt(dx * dx + dz * dz) < 4; // Minimum distance of 4 units
    });

    if (!hasCollision) {
      if (debugLog) {
        console.log(
          `New tree placed at:`,
          candidatePos,
          `after ${attempts + 1} attempts`
        );
      }
      return candidatePos;
    }
  }

  // Fallback position if no suitable spot found
  console.warn(
    `Could not find suitable position for new tree after ${maxAttempts} attempts, using fallback`
  );
  return [Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5]; // Added base height to fallback
};
