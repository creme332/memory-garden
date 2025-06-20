// TODO: This object is not currently used. It will be needed later.

/**
 * Creates an EmotionZone object.
 * @param {string} name - The name of the emotion zone.
 * @param {number} length - The size of the zone along the Z-axis.
 * @param {number} width - The size of the zone along the X-axis.
 * @param {[number, number, number]} position - Center position of the zone [x, y, z].
 * @returns {{
 *   name: string,
 *   width: number,
 *   length: number,
 *   position: [number, number, number],
 *   contains: (pos: [number, number, number]) => boolean
 * }}
 */
function EmotionZone(name, length, width, position) {
  const [centerX, centerY, centerZ] = position;
  const halfWidth = width / 2;
  const halfLength = length / 2;

  /**
   * Determines whether a given 3D position lies within this zone.
   * @param {[number, number, number]} pos - Position to test [x, y, z]
   * @returns {boolean}
   */
  function contains(pos) {
    const [x, y, z] = pos;

    return (
      x >= centerX - halfWidth &&
      x <= centerX + halfWidth &&
      z >= centerZ - halfLength &&
      z <= centerZ + halfLength
      // y is intentionally ignored, treat as infinite vertical span or customize if needed
    );
  }

  return {
    name,
    width,
    length,
    position,
    contains
  };
}
