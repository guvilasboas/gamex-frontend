export interface EngineComponent {
  id: string;
  entityId: string;
  size: {
    x: number;
    y: number;
    z: number;
  };
  offset: {
    x: number;
    y: number;
    z: number;
  };
  enabled: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Type guard to check if an object is an EngineComponent.
 *
 * @param x The object to check.
 * @returns True if the object is an EngineComponent, false otherwise.
 */
export function isEngineComponent(x: unknown): x is EngineComponent {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    typeof (x as any).id === "string" &&
    "entityId" in x &&
    typeof (x as any).entityId === "string" &&
    "size" in x &&
    typeof (x as any).size === "object" &&
    (x as any).size !== null &&
    "x" in (x as any).size &&
    typeof (x as any).size.x === "number" &&
    "y" in (x as any).size &&
    typeof (x as any).size.y === "number" &&
    "z" in (x as any).size &&
    typeof (x as any).size.z === "number" &&
    "offset" in x &&
    typeof (x as any).offset === "object" &&
    (x as any).offset !== null &&
    "x" in (x as any).offset &&
    typeof (x as any).offset.x === "number" &&
    "y" in (x as any).offset &&
    typeof (x as any).offset.y === "number" &&
    "z" in (x as any).offset &&
    typeof (x as any).offset.z === "number" &&
    "enabled" in x &&
    typeof (x as any).enabled === "boolean" &&
    "position" in x &&
    typeof (x as any).position === "object" &&
    (x as any).position !== null &&
    "x" in (x as any).position &&
    typeof (x as any).position.x === "number" &&
    "y" in (x as any).position &&
    typeof (x as any).position.y === "number" &&
    "z" in (x as any).position &&
    typeof (x as any).position.z === "number"
  );
}

/**
 * Type guard to check if an object is an array of EngineComponents.
 *
 * @param x The object to check.
 * @returns True if the object is an array of EngineComponents, false otherwise.
 */
export function isEngineComponentArray(x: unknown): x is EngineComponent[] {
  return Array.isArray(x) && x.every((item) => isEngineComponent(item));
}
