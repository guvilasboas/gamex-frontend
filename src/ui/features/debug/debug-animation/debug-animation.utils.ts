import * as animations from "../../../../game/game-animations";
import type {
  AnimationFrame,
  AnimationOption,
  FrameGap,
  FrameGrid,
  FrameMargins,
  InspectorMetrics,
  RawAnimationSheet,
} from "./debug-animation.types";

const RAW_ANIMATION_SOURCES: Array<{ label: string; data: RawAnimationSheet }> =
  Object.values(animations).map((animation) => {
    return {
      label: animation.label,
      data: animation,
    };
  });

export function clampPositive(value: number, fallback: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

export function clampNonNegative(value: number, fallback = 0) {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function splitFrames(rawFrames: number[]): AnimationFrame[] {
  const frames: AnimationFrame[] = [];

  for (let index = 0; index < rawFrames.length; index += 4) {
    frames.push({
      x: rawFrames[index] ?? 0,
      y: rawFrames[index + 1] ?? 0,
      width: rawFrames[index + 2] ?? 0,
      height: rawFrames[index + 3] ?? 0,
    });
  }

  return frames;
}

export function cloneFrames(frames: AnimationFrame[]) {
  return frames.map((frame) => ({ ...frame }));
}

export function flattenFrames(frames: AnimationFrame[]) {
  return frames.flatMap((frame) => [
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  ]);
}

export function normalizeFrame(frame: AnimationFrame): AnimationFrame {
  return {
    x: Math.round(frame.x),
    y: Math.round(frame.y),
    width: Math.max(1, Math.round(frame.width)),
    height: Math.max(1, Math.round(frame.height)),
  };
}

export function inferFrameGap(frames: AnimationFrame[]): FrameGap {
  if (frames.length < 2) {
    return { horizontal: 0, vertical: 0 };
  }

  const [firstFrame, ...otherFrames] = frames;
  const sameRowFrame = otherFrames.find((frame) => frame.y === firstFrame.y);
  const nextRowFrame = otherFrames.find((frame) => frame.y > firstFrame.y);

  return {
    horizontal: sameRowFrame
      ? Math.max(0, sameRowFrame.x - (firstFrame.x + firstFrame.width))
      : 0,
    vertical: nextRowFrame
      ? Math.max(0, nextRowFrame.y - (firstFrame.y + firstFrame.height))
      : 0,
  };
}

export function inferFrameMargins(
  frames: AnimationFrame[],
  image?: HTMLImageElement,
): FrameMargins {
  if (frames.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }

  const minX = Math.min(...frames.map((frame) => frame.x));
  const minY = Math.min(...frames.map((frame) => frame.y));
  const maxX = Math.max(...frames.map((frame) => frame.x + frame.width));
  const maxY = Math.max(...frames.map((frame) => frame.y + frame.height));

  return {
    left: Math.max(0, Math.round(minX)),
    top: Math.max(0, Math.round(minY)),
    right: Math.max(0, Math.round((image?.width ?? maxX) - maxX)),
    bottom: Math.max(0, Math.round((image?.height ?? maxY) - maxY)),
  };
}

export function inferFrameGrid(frames: AnimationFrame[]): FrameGrid {
  if (frames.length === 0) {
    return { columns: 0, rows: 0 };
  }

  const rowYs = Array.from(new Set(frames.map((frame) => frame.y))).sort(
    (left, right) => left - right,
  );

  return {
    columns: Math.max(
      ...rowYs.map((rowY) => frames.filter((frame) => frame.y === rowY).length),
    ),
    rows: rowYs.length,
  };
}

export function recalculateFrames(
  frameCount: number,
  frameWidth: number,
  frameHeight: number,
  frameGap: FrameGap,
  frameGrid: FrameGrid,
  margins: FrameMargins,
  image?: HTMLImageElement,
) {
  if (frameCount <= 0) {
    return [];
  }

  const normalizedWidth = Math.max(1, Math.round(frameWidth));
  const normalizedHeight = Math.max(1, Math.round(frameHeight));
  const normalizedGap = {
    horizontal: Math.max(0, Math.round(frameGap.horizontal)),
    vertical: Math.max(0, Math.round(frameGap.vertical)),
  };
  const normalizedGrid = {
    columns: Math.max(0, Math.round(frameGrid.columns)),
    rows: Math.max(0, Math.round(frameGrid.rows)),
  };
  const normalizedMargins = {
    left: Math.max(0, Math.round(margins.left)),
    top: Math.max(0, Math.round(margins.top)),
    right: Math.max(0, Math.round(margins.right)),
    bottom: Math.max(0, Math.round(margins.bottom)),
  };

  const availableRightEdge = image
    ? Math.max(
        normalizedMargins.left + normalizedWidth,
        image.width - normalizedMargins.right,
      )
    : Number.POSITIVE_INFINITY;
  const columnsFromRows =
    normalizedGrid.rows > 0 ? Math.ceil(frameCount / normalizedGrid.rows) : 0;
  const effectiveColumns =
    normalizedGrid.columns > 0
      ? normalizedGrid.columns
      : columnsFromRows > 0
        ? columnsFromRows
        : 0;

  const frames: AnimationFrame[] = [];
  let currentX = normalizedMargins.left;
  let currentY = normalizedMargins.top;

  for (let index = 0; index < frameCount; index += 1) {
    const nextRightEdge = currentX + normalizedWidth;
    const reachedConfiguredColumnBreak =
      effectiveColumns > 0 && index > 0 && index % effectiveColumns === 0;

    if (
      reachedConfiguredColumnBreak ||
      (index > 0 &&
        nextRightEdge > availableRightEdge &&
        currentX !== normalizedMargins.left)
    ) {
      currentX = normalizedMargins.left;
      currentY += normalizedHeight + normalizedGap.vertical;
    }

    frames.push({
      x: currentX,
      y: currentY,
      width: normalizedWidth,
      height: normalizedHeight,
    });

    currentX += normalizedWidth + normalizedGap.horizontal;
  }

  return frames;
}

export function areFrameGapsEqual(left: FrameGap, right: FrameGap) {
  return (
    left.horizontal === right.horizontal && left.vertical === right.vertical
  );
}

export function areFrameGridsEqual(left: FrameGrid, right: FrameGrid) {
  return left.columns === right.columns && left.rows === right.rows;
}

export function areFrameMarginsEqual(left: FrameMargins, right: FrameMargins) {
  return (
    left.left === right.left &&
    left.top === right.top &&
    left.right === right.right &&
    left.bottom === right.bottom
  );
}

export function buildAnimationOptions(): AnimationOption[] {
  return RAW_ANIMATION_SOURCES.flatMap(({ label, data }) =>
    Object.entries(data.animations).map(([animationName, flatFrames]) => ({
      key: `${label}:${animationName}`,
      label: animationName,
      sourceLabel: label,
      resource: data.resource,
      frames: splitFrames(flatFrames),
      flatFrames,
    })),
  );
}

export function getInspectorMetrics(
  image: HTMLImageElement,
  frames: AnimationFrame[],
  stageSize: number,
): InspectorMetrics {
  const maxWidth = Math.max(
    image.width,
    ...frames.map((frame) => frame.x + frame.width),
  );
  const maxHeight = Math.max(
    image.height,
    ...frames.map((frame) => frame.y + frame.height),
  );
  const scale = Math.min(stageSize / maxWidth, stageSize / maxHeight);
  const width = maxWidth * scale;
  const height = maxHeight * scale;
  const offsetX = (stageSize - width) / 2;
  const offsetY = (stageSize - height) / 2;

  return { scale, width, height, offsetX, offsetY };
}
