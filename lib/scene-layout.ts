export type BodyName = "solar" | "mars" | "saturn";
export type Composition = { position: [number, number, number]; scale: number };

// Bounds include the Sun's corona and Saturn's tilted rings, not only the surface mesh.
// Local centers are retained so the original desktop composition and shaders remain intact.
const bounds = {
  solar: { center: [-1.6, -.75], width: 13.86, height: 7.86 },
  mars: { center: [-3.35, -.05], width: 5.64, height: 5.64 },
  saturn: { center: [3.1, .1], width: 10.6, height: 5.6 },
} as const;

export function fitComposition(body: BodyName, width: number, height: number, compact: boolean): Composition {
  if (!compact) return { position: [0, 0, 0], scale: 1 };
  const box = bounds[body];
  const scale = Math.min(width * .88 / box.width, height * .40 / box.height, 1);
  // Place the objects in the upper gallery area; the lower area remains available for copy.
  return { scale, position: [-box.center[0] * scale, height * .22 - box.center[1] * scale, 0] };
}
