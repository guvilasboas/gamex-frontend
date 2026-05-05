export type RawAnimationSheet = {
  resource: string;
  animations: Record<string, number[]>;
};

export type AnimationFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FrameMargins = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type FrameGap = {
  horizontal: number;
  vertical: number;
};

export type FrameGrid = {
  columns: number;
  rows: number;
};

export type AnimationOption = {
  key: string;
  label: string;
  sourceLabel: string;
  resource: string;
  frames: AnimationFrame[];
  flatFrames: number[];
};

export type InspectorMetrics = {
  scale: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};
