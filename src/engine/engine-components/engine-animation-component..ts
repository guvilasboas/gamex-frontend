import { EngineComponent, isEngineComponent } from "./engine-component";

export interface EngineAnimation extends EngineComponent {
  type: "[Animation]";
  resource: string;
  animation: string;
  playing: boolean;
  frameRate: number;
}

/**
 * Type guard to check if an object is an EngineAnimation.
 *
 * @param x The object to check.
 * @returns True if the object is an EngineAnimation, false otherwise.
 */
export function isEngineAnimation(x: unknown): x is EngineAnimation {
  if (!isEngineComponent(x)) {
    return false;
  }

  return (
    typeof x === "object" &&
    x !== null &&
    "type" in x &&
    (x as any).type === "[Animation]"
  );
}
