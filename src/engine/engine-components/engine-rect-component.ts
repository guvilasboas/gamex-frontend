import { EngineComponent, isEngineComponent } from "./engine-component";

export interface EngineRectComponent extends EngineComponent {
  type: "[Rect]";
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
}

export function isEngineRectComponent(x: unknown): x is EngineRectComponent {
  if (!isEngineComponent(x)) {
    return false;
  }

  return (
    typeof x === "object" &&
    x !== null &&
    "type" in x &&
    (x as any).type === "[Rect]"
  );
}
