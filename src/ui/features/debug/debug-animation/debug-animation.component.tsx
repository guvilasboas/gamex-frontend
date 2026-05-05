import { useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import { useImage } from "../../../../hooks/use-image";
import {
  DEFAULT_RENDER_SCALE,
  DEFAULT_SPEED,
  INSPECTOR_STAGE_SIZE,
  PREVIEW_STAGE_SIZE,
} from "./debug-animation.constants";
import { DebugAnimationControls } from "./debug-animation-controls";
import { DebugAnimationInspectorStage } from "./debug-animation-inspector-stage";
import { DebugAnimationMetadata } from "./debug-animation-metadata";
import { DebugAnimationPlaybackStage } from "./debug-animation-playback-stage";
import type {
  AnimationFrame,
  FrameGap,
  FrameGrid,
  FrameMargins,
} from "./debug-animation.types";
import {
  areFrameGapsEqual,
  areFrameGridsEqual,
  areFrameMarginsEqual,
  buildAnimationOptions,
  clampPositive,
  cloneFrames,
  flattenFrames,
  getInspectorMetrics,
  inferFrameGap,
  inferFrameGrid,
  inferFrameMargins,
  normalizeFrame,
  recalculateFrames,
} from "./debug-animation.utils";
import styles from "./debug-animation.module.css";

export function DebugAnimation() {
  const animationOptions = useMemo(() => buildAnimationOptions(), []);
  const [selectedAnimationKey, setSelectedAnimationKey] = useState(
    animationOptions[0]?.key ?? "",
  );
  const [mode, setMode] = useState<"playback" | "inspect">("playback");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [frameIndex, setFrameIndex] = useState(0);
  const [renderScale, setRenderScale] = useState(DEFAULT_RENDER_SCALE);
  const [renderWidth, setRenderWidth] = useState(1);
  const [renderHeight, setRenderHeight] = useState(1);
  const [editableFrames, setEditableFrames] = useState<AnimationFrame[]>([]);
  const [fixedFrameWidth, setFixedFrameWidth] = useState(1);
  const [fixedFrameHeight, setFixedFrameHeight] = useState(1);
  const [frameGap, setFrameGap] = useState<FrameGap>({
    horizontal: 0,
    vertical: 0,
  });
  const [frameGrid, setFrameGrid] = useState<FrameGrid>({
    columns: 0,
    rows: 0,
  });
  const [frameMargins, setFrameMargins] = useState<FrameMargins>({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const spriteRef = useRef<Konva.Sprite>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const frameGroupRefs = useRef<Record<number, Konva.Group | null>>({});

  const selectedAnimation =
    animationOptions.find((option) => option.key === selectedAnimationKey) ??
    animationOptions[0];
  const spriteImage = useImage(selectedAnimation?.resource ?? "");
  const sourceFrames = selectedAnimation?.frames ?? [];
  const defaultFrame = sourceFrames[0] ?? null;
  const defaultFrameGap = useMemo(
    () => inferFrameGap(sourceFrames),
    [sourceFrames],
  );
  const defaultFrameGrid = useMemo(
    () => inferFrameGrid(sourceFrames),
    [sourceFrames],
  );
  const defaultFrameMargins = useMemo(
    () => inferFrameMargins(sourceFrames, spriteImage ?? undefined),
    [sourceFrames, spriteImage],
  );
  const gridFrameCount = useMemo(
    () =>
      frameGrid.columns > 0 && frameGrid.rows > 0
        ? frameGrid.columns * frameGrid.rows
        : sourceFrames.length,
    [frameGrid.columns, frameGrid.rows, sourceFrames.length],
  );
  const flatEditableFrames = useMemo(
    () => flattenFrames(editableFrames),
    [editableFrames],
  );

  useEffect(() => {
    setFrameIndex(0);
    setIsPlaying(false);
  }, [selectedAnimationKey]);

  useEffect(() => {
    const nextFrames = cloneFrames(sourceFrames);

    setEditableFrames(nextFrames);
    setFixedFrameWidth(defaultFrame?.width ?? 1);
    setFixedFrameHeight(defaultFrame?.height ?? 1);
    setFrameGap(defaultFrameGap);
    setFrameGrid(defaultFrameGrid);
    setFrameMargins(defaultFrameMargins);
  }, [
    defaultFrame,
    defaultFrameGap,
    defaultFrameGrid,
    defaultFrameMargins,
    sourceFrames,
  ]);

  useEffect(() => {
    if (!selectedAnimation || sourceFrames.length === 0) {
      return;
    }

    const shouldUseSavedFrames =
      fixedFrameWidth === (defaultFrame?.width ?? 1) &&
      fixedFrameHeight === (defaultFrame?.height ?? 1) &&
      areFrameGapsEqual(frameGap, defaultFrameGap) &&
      areFrameGridsEqual(frameGrid, defaultFrameGrid) &&
      areFrameMarginsEqual(frameMargins, defaultFrameMargins);

    if (shouldUseSavedFrames) {
      setEditableFrames(cloneFrames(sourceFrames));
      return;
    }

    setEditableFrames(
      recalculateFrames(
        gridFrameCount,
        fixedFrameWidth,
        fixedFrameHeight,
        frameGap,
        frameGrid,
        frameMargins,
        spriteImage ?? undefined,
      ),
    );
  }, [
    fixedFrameHeight,
    fixedFrameWidth,
    defaultFrame,
    defaultFrameGap,
    defaultFrameGrid,
    defaultFrameMargins,
    frameGap,
    frameGrid,
    gridFrameCount,
    frameMargins,
    selectedAnimation,
    sourceFrames,
    spriteImage,
  ]);

  useEffect(() => {
    const baseFrame = editableFrames[0] ?? selectedAnimation?.frames[0];

    if (!baseFrame) {
      return;
    }

    setRenderScale(DEFAULT_RENDER_SCALE);
    setRenderWidth(baseFrame.width * DEFAULT_RENDER_SCALE);
    setRenderHeight(baseFrame.height * DEFAULT_RENDER_SCALE);
  }, [editableFrames, selectedAnimation]);

  useEffect(() => {
    const sprite = spriteRef.current;

    if (!sprite || !selectedAnimation) {
      return;
    }

    sprite.frameRate(speed);
    sprite.animation(selectedAnimation.key);
    sprite.frameIndex(frameIndex);

    if (isPlaying) {
      sprite.start();
    } else {
      sprite.stop();
    }

    sprite.getLayer()?.batchDraw();
  }, [flatEditableFrames, frameIndex, isPlaying, selectedAnimation, speed]);

  useEffect(() => {
    const transformer = transformerRef.current;

    if (!transformer || mode !== "inspect") {
      return;
    }

    const activeNode = frameGroupRefs.current[frameIndex];

    transformer.nodes(activeNode ? [activeNode] : []);
    transformer.getLayer()?.batchDraw();
  }, [editableFrames, frameIndex, mode]);

  useEffect(() => {
    if (!isPlaying || !selectedAnimation) {
      return;
    }

    let animationFrameId = 0;

    const syncFrameIndex = () => {
      const sprite = spriteRef.current;
      if (!sprite) {
        return;
      }

      setFrameIndex(sprite.frameIndex());
      animationFrameId = window.requestAnimationFrame(syncFrameIndex);
    };

    animationFrameId = window.requestAnimationFrame(syncFrameIndex);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isPlaying, selectedAnimation]);

  const totalFrames = editableFrames.length;
  const currentFrame = editableFrames[frameIndex] ?? null;
  const uniqueFrameSizes = Array.from(
    new Set(editableFrames.map((frame) => `${frame.width} x ${frame.height}`)),
  );
  const animationBounds = editableFrames.reduce(
    (bounds, frame) => ({
      width: Math.max(bounds.width, frame.x + frame.width),
      height: Math.max(bounds.height, frame.y + frame.height),
    }),
    { width: 0, height: 0 },
  );

  useEffect(() => {
    if (!selectedAnimation || totalFrames === 0) {
      return;
    }

    if (frameIndex >= totalFrames) {
      setFrameIndex(totalFrames - 1);
    }
  }, [frameIndex, selectedAnimation, totalFrames]);

  if (!selectedAnimation) {
    return (
      <div className={styles.EmptyState}>Nenhuma animacao encontrada.</div>
    );
  }

  const updateFrameAtIndex = (index: number, nextFrame: AnimationFrame) => {
    setEditableFrames((currentFrames) =>
      currentFrames.map((frame, currentIndex) =>
        currentIndex === index ? normalizeFrame(nextFrame) : frame,
      ),
    );
  };

  const resetInspectorSettings = () => {
    setEditableFrames(cloneFrames(sourceFrames));
    setFixedFrameWidth(defaultFrame?.width ?? 1);
    setFixedFrameHeight(defaultFrame?.height ?? 1);
    setFrameGap(defaultFrameGap);
    setFrameGrid(defaultFrameGrid);
    setFrameMargins(defaultFrameMargins);
  };

  const copyFramesToClipboard = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(flattenFrames(editableFrames), null, 2),
    );
  };

  const previewFrame = currentFrame ?? editableFrames[0];
  const previewBaseWidth = previewFrame?.width ?? 1;
  const previewBaseHeight = previewFrame?.height ?? 1;
  const previewWidth = clampPositive(
    renderWidth,
    previewBaseWidth * renderScale,
  );
  const previewHeight = clampPositive(
    renderHeight,
    previewBaseHeight * renderScale,
  );
  const previewScaleX = previewWidth / Math.max(previewBaseWidth, 1);
  const previewScaleY = previewHeight / Math.max(previewBaseHeight, 1);
  const previewOffsetX = (PREVIEW_STAGE_SIZE - previewWidth) / 2;
  const previewOffsetY = (PREVIEW_STAGE_SIZE - previewHeight) / 2;

  const inspectorMetrics =
    spriteImage && editableFrames.length > 0
      ? getInspectorMetrics(spriteImage, editableFrames, INSPECTOR_STAGE_SIZE)
      : null;

  const handleTogglePlaying = () => {
    setIsPlaying((current) => !current);
  };

  const handlePreviousFrame = () => {
    setIsPlaying(false);
    setFrameIndex((current) => (current === 0 ? totalFrames - 1 : current - 1));
  };

  const handleNextFrame = () => {
    setIsPlaying(false);
    setFrameIndex((current) => (current + 1) % totalFrames);
  };

  const handleFrameIndexChange = (value: number) => {
    setIsPlaying(false);
    setFrameIndex(value);
  };

  const handleRenderScaleChange = (value: number) => {
    setRenderScale(value);
    setRenderWidth(previewBaseWidth * value);
    setRenderHeight(previewBaseHeight * value);
  };

  const handleRenderWidthChange = (value: number) => {
    setRenderWidth(value);
    setRenderScale(value / Math.max(previewBaseWidth, 1));
  };

  const handleRenderHeightChange = (value: number) => {
    setRenderHeight(value);
    setRenderScale(value / Math.max(previewBaseHeight, 1));
  };

  const handleFrameGapChange = (axis: keyof FrameGap, value: number) => {
    setFrameGap((current) => ({
      ...current,
      [axis]: value,
    }));
  };

  const handleFrameGridChange = (axis: keyof FrameGrid, value: number) => {
    setFrameGrid((current) => ({
      ...current,
      [axis]: value,
    }));
  };

  const handleFrameMarginChange = (side: keyof FrameMargins, value: number) => {
    setFrameMargins((current) => ({
      ...current,
      [side]: value,
    }));
  };

  const handleSelectFrame = (index: number) => {
    setIsPlaying(false);
    setFrameIndex(index);
  };

  return (
    <div className={styles.Container}>
      <aside className={styles.Sidebar}>
        <DebugAnimationControls
          animationOptions={animationOptions}
          selectedAnimationKey={selectedAnimation.key}
          mode={mode}
          isPlaying={isPlaying}
          totalFrames={totalFrames}
          speed={speed}
          frameIndex={frameIndex}
          renderScale={renderScale}
          renderWidth={renderWidth}
          renderHeight={renderHeight}
          previewBaseWidth={previewBaseWidth}
          previewBaseHeight={previewBaseHeight}
          fixedFrameWidth={fixedFrameWidth}
          fixedFrameHeight={fixedFrameHeight}
          frameGap={frameGap}
          frameGrid={frameGrid}
          frameMargins={frameMargins}
          onAnimationChange={setSelectedAnimationKey}
          onModeChange={setMode}
          onTogglePlaying={handleTogglePlaying}
          onPreviousFrame={handlePreviousFrame}
          onNextFrame={handleNextFrame}
          onSpeedChange={setSpeed}
          onFrameIndexChange={handleFrameIndexChange}
          onRenderScaleChange={handleRenderScaleChange}
          onRenderWidthChange={handleRenderWidthChange}
          onRenderHeightChange={handleRenderHeightChange}
          onFixedFrameWidthChange={setFixedFrameWidth}
          onFixedFrameHeightChange={setFixedFrameHeight}
          onFrameGapChange={handleFrameGapChange}
          onFrameGridChange={handleFrameGridChange}
          onFrameMarginChange={handleFrameMarginChange}
          onReset={resetInspectorSettings}
          onExport={copyFramesToClipboard}
        />

        <DebugAnimationMetadata
          selectedAnimation={selectedAnimation}
          spriteImage={spriteImage}
          totalFrames={totalFrames}
          uniqueFrameSizes={uniqueFrameSizes}
          currentFrame={currentFrame}
          previewWidth={previewWidth}
          previewHeight={previewHeight}
          renderScale={renderScale}
          animationBounds={animationBounds}
          fixedFrameWidth={fixedFrameWidth}
          fixedFrameHeight={fixedFrameHeight}
          frameGap={frameGap}
          frameGrid={frameGrid}
          frameMargins={frameMargins}
        />
      </aside>

      <section className={styles.StagePanel}>
        {mode === "playback" ? (
          <DebugAnimationPlaybackStage
            animationLabel={selectedAnimation.label}
            animationKey={selectedAnimation.key}
            spriteImage={spriteImage}
            spriteRef={spriteRef}
            previewOffsetX={previewOffsetX}
            previewOffsetY={previewOffsetY}
            previewBaseWidth={previewBaseWidth}
            previewBaseHeight={previewBaseHeight}
            previewScaleX={previewScaleX}
            previewScaleY={previewScaleY}
            flatEditableFrames={flatEditableFrames}
            speed={speed}
            frameIndex={frameIndex}
            previewWidth={previewWidth}
            previewHeight={previewHeight}
          />
        ) : (
          <DebugAnimationInspectorStage
            animationLabel={selectedAnimation.label}
            spriteImage={spriteImage}
            inspectorMetrics={inspectorMetrics}
            editableFrames={editableFrames}
            frameIndex={frameIndex}
            frameGroupRefs={frameGroupRefs}
            transformerRef={transformerRef}
            onSelectFrame={handleSelectFrame}
            onUpdateFrameAtIndex={updateFrameAtIndex}
          />
        )}
      </section>
    </div>
  );
}
