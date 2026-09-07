export const MAX_DRAGON_ITERATIONS = 12;

export function buildDragonCurve(iterations: number) {
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > MAX_DRAGON_ITERATIONS) {
    throw new RangeError(`Dragon curve iterations must be between 1 and ${MAX_DRAGON_ITERATIONS}.`);
  }

  // Each fold adds a right turn followed by the reversed, inverted turns.
  let turns: number[] = [];
  for (let fold = 0; fold < iterations; fold++) {
    turns = [...turns, 1, ...turns.slice().reverse().map((turn) => -turn)];
  }

  const directions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];
  const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  let direction = 0;
  let minX = 0, maxX = 1, minY = 0, maxY = 0;
  for (const turn of turns) {
    direction = (direction + turn + 4) % 4;
    const previous = points[points.length - 1];
    const step = directions[direction];
    const point = { x: previous.x + step.x, y: previous.y + step.y };
    points.push(point);
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const padding = 2;
  return {
    points,
    path: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    reversePath: points.slice().reverse().map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    bounds: { minX, maxX, minY, maxY },
    viewBox: `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`,
    segments: points.length - 1,
  };
}

export function getDragonFoldFrame(curve: ReturnType<typeof buildDragonCurve>, progress: number) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) {
    throw new RangeError("Dragon fold progress must be between 0 and 1.");
  }

  // The next iteration is this curve plus a reversed copy, turned at its endpoint.
  const pivot = curve.points[curve.points.length - 1];
  const rotation = -90 * progress;
  const radians = rotation * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  let { minX, maxX, minY, maxY } = curve.bounds;
  for (const point of curve.points) {
    const dx = point.x - pivot.x;
    const dy = point.y - pivot.y;
    const x = pivot.x + dx * cosine - dy * sine;
    const y = pivot.y + dx * sine + dy * cosine;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Frame the entire sweep so the rotating copy never clips at the canvas edge.
  const padding = Math.max(2, Math.max(maxX - minX, maxY - minY) * 0.14);
  const viewBox = [minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding]
    .map((value) => Number(value.toFixed(6))).join(" ");
  return { viewBox, rotation, pivot };
}
