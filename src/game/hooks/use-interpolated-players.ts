import { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai/react";
import { playersAtom, type Player } from "../../atoms";

/** Must match the server tick rate defined in use-player-move.ts */
const SERVER_TICK_MS = 1000 / 20; // 50ms
/**
 * How long to interpolate across when a new server position arrives.
 * Slightly longer than the tick to avoid "snap" artefacts when ticks
 * arrive a few ms late.
 */
const LERP_DURATION_MS = SERVER_TICK_MS * 1.5; // 75ms

type InterpEntry = {
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
export function useInterpolatedPlayers(): Player[] {
  const players = useAtomValue(playersAtom);

  /** Per-player lerp state */
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

    for (const player of players) {
      const existing = map.get(player.id);
      const curRender = renders.get(player.id);

      // Start from wherever the sprite currently is so there's no visible
      // "rewind" when a new target comes in mid-interpolation.
      const prevX = curRender?.x ?? player.x;
      const prevY = curRender?.y ?? player.y;

      if (
        !existing ||
        existing.targetX !== player.x ||
        existing.targetY !== player.y
      ) {
        map.set(player.id, {
          prevX,
          prevY,
          targetX: player.x,
          targetY: player.y,
          startTime: now,
        });
      }
    }

    // Remove entries for players that have disconnected
    for (const id of map.keys()) {
      if (!players.some((p) => p.id === id)) {
        map.delete(id);
        renders.delete(id);
      }
    }
  }, [players]);

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
  return players.map((player) => {
    const pos = renderPositions.get(player.id);
    return {
      ...player,
      x: pos?.x ?? player.x,
      y: pos?.y ?? player.y,
    };
  });
}
