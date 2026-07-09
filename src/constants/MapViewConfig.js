/**
 * Rotation offset of map view in radians
 * @type {number}
 */
export const MAP_ROTATION_OFFSET = Math.PI / 2;

/**
 * Whether to try to allow rotation from 359 - 0 by rotating + 1 degree rather than -359. Enabling may cause inaccurate rotations sometimes.
 * Set to "false" to ignore the logic and prevent such errors. However, irratic rotations when completing a full rotation may be the result
 * @type {boolean}
 */
export const MAP_CONTINUOUS_ROTATION = true;

/**
 * Whether to flip the occupancy grid displayed in navigation map
 * @type {boolean}
 */
export const MAP_FLIP_GRID = true;

/**
 * Whether to flip the path displayed in navigation map
 * @type {boolean}
 */
export const MAP_FLIP_PATH = true;

/**
 * Whether to flip the rotation of the robot in navigation map
 * @type {boolean}
 */
export const MAP_FLIP_ROTATION = true;

/**
 * The zoom to use on the map and path
 * @type {number}
 */
export const MAP_ZOOM = 4;

/**
 * The thickness of the path on the display. divide by MAP_ZOOM to make it responsive to changes in zoom.
 * @type {number}
 */
export const MAP_PATH_THICKNESS = .5 / MAP_ZOOM;
