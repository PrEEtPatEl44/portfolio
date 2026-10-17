export type Point = { x: number; y: number };

/** Keep the iris inside an ellipse while preserving the pointer's direction. */
export function getEyeGaze(origin: Point, pointer: Point) {
  const dx = pointer.x - origin.x;
  const dy = pointer.y - origin.y;
  const distance = Math.hypot(dx, dy);
  const ellipseDistance = Math.hypot(dx / 26, dy / 12);
  const strength = Math.min(distance / 180, 1);

  return {
    x: ellipseDistance === 0 ? 0 : (dx / ellipseDistance) * strength,
    y: ellipseDistance === 0 ? 0 : (dy / ellipseDistance) * strength,
    angle: Math.atan2(dy, dx) * (180 / Math.PI),
    distance,
  };
}

/** Sightline endpoints: leave from the iris rim and stop short of the reticle. */
export function getSightline(origin: Point, pointer: Point, irisRadius: number, gap = 14) {
  const dx = pointer.x - origin.x;
  const dy = pointer.y - origin.y;
  const distance = Math.hypot(dx, dy) || 1;
  const start = Math.min(irisRadius, distance);
  const end = Math.max(start, distance - gap);

  return {
    from: { x: origin.x + (dx / distance) * start, y: origin.y + (dy / distance) * start },
    to: { x: origin.x + (dx / distance) * end, y: origin.y + (dy / distance) * end },
  };
}
