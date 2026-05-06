import { useEffect, useRef, useState } from "react";
import { EngineComponent } from "../engine-components";
import { SERVER_TICK_MS } from "../engine-config";

/**
 * How long to interpolate across when a new server position arrives.
 * Slightly longer than the tick to avoid "snap" artefacts when ticks
 * arrive a few ms late.
 */
const LERP_DURATION_MS = SERVER_TICK_MS * 1.5; // 75ms

export type InterpEntry = {
  prevX: number;
  prevY: number;
  targetX: number;
  targetY: number;
  startTime: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Returns the player list with `x` / `y` smoothly interpolated between
 * successive server updates.  All other fields (walking, facing, …) are
 * taken verbatim from the latest server state so that animation clips and
 * direction switches remain frame-accurate.
 */
export function useEngineInterpolation(
  entities: EngineComponent[],
): EngineComponent[] {
  const interpMap = useRef<Map<string, InterpEntry>>(new Map());

  /**
   * Mirror of the rendered positions kept in a ref so that the next
   * server-update effect can read the *current visual* position without
   * depending on React state (avoids stale closure issues).
   */
  const renderPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  const [renderPositions, setRenderPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  const rafRef = useRef<number | null>(null);

  // ── Respond to server state changes ─────────────────────────────────────
  useEffect(() => {
    const now = performance.now();
    const map = interpMap.current;
    const renders = renderPosRef.current;

    for (const player of entities) {
      const existing = map.get(player.id);
      const curRender = renders.get(player.id);

      const { position } = player;

      // Start from wherever the sprite currently is so there's no visible
      // "rewind" when a new target comes in mid-interpolation.
      const prevX = curRender?.x ?? position.x;
      const prevY = curRender?.y ?? position.y;

      if (
        !existing ||
        existing.targetX !== position.x ||
        existing.targetY !== position.y
      ) {
        map.set(player.id, {
          prevX,
          prevY,
          targetX: position.x,
          targetY: position.y,
          startTime: now,
        });
      }
    }

    // Remove entries for players that have disconnected
    for (const id of map.keys()) {
      if (!entities.some((p) => p.id === id)) {
        map.delete(id);
        renders.delete(id);
      }
    }
  }, [entities]);

  // ── rAF loop — drives visual positions at ~60 fps ────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const next = new Map<string, { x: number; y: number }>();

      for (const [id, entry] of interpMap.current) {
        const t = Math.min((now - entry.startTime) / LERP_DURATION_MS, 1);
        next.set(id, {
          x: lerp(entry.prevX, entry.targetX, t),
          y: lerp(entry.prevY, entry.targetY, t),
        });
      }

      renderPosRef.current = next;
      setRenderPositions(new Map(next));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Merge interpolated positions back into the player list ───────────────
  const unsortedEntities = entities.map((player) => {
    const pos = renderPositions.get(player.id);
    return {
      ...player,
      position: {
        x: pos?.x ?? player.position.x,
        y: pos?.y ?? player.position.y,
        z: player.position.z, // z is not interpolated since it's not sent by the server
      },
    };
  });

  return unsortedEntities.sort((a, b) => a.position.y - b.position.y);
}
