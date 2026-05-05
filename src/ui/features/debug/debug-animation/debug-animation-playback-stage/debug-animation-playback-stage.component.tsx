import { Layer, Rect, Sprite, Stage } from "react-konva";
import type Konva from "konva";
import type { RefObject } from "react";
import { PREVIEW_STAGE_SIZE } from "../debug-animation.constants";
import styles from "../debug-animation.module.css";

type DebugAnimationPlaybackStageProps = {
  animationLabel: string;
  animationKey: string;
  spriteImage?: HTMLImageElement | null;
  spriteRef: RefObject<Konva.Sprite | null>;
  previewOffsetX: number;
  previewOffsetY: number;
  previewBaseWidth: number;
  previewBaseHeight: number;
  previewScaleX: number;
  previewScaleY: number;
  flatEditableFrames: number[];
  speed: number;
  frameIndex: number;
  previewWidth: number;
  previewHeight: number;
};

export function DebugAnimationPlaybackStage({
  animationLabel,
  animationKey,
  spriteImage,
  spriteRef,
  previewOffsetX,
  previewOffsetY,
  previewBaseWidth,
  previewBaseHeight,
  previewScaleX,
  previewScaleY,
  flatEditableFrames,
  speed,
  frameIndex,
  previewWidth,
  previewHeight,
}: DebugAnimationPlaybackStageProps) {
  return (
    <>
      <div className={styles.StageHeader}>
        <div>
          <span className={styles.StageEyebrow}>Preview</span>
          <h3 className={styles.StageTitle}>{animationLabel}</h3>
        </div>
        <p className={styles.StageDescription}>
          Reproducao via react-konva Sprite usando os frames brutos da sheet.
        </p>
      </div>
      <div className={styles.CanvasShell}>
        {spriteImage ? (
          <Stage width={PREVIEW_STAGE_SIZE} height={PREVIEW_STAGE_SIZE}>
            <Layer>
              <Rect
                x={0}
                y={0}
                width={PREVIEW_STAGE_SIZE}
                height={PREVIEW_STAGE_SIZE}
                fill="#08111d"
              />
              <Sprite
                ref={spriteRef}
                image={spriteImage}
                x={previewOffsetX}
                y={previewOffsetY}
                width={previewBaseWidth}
                height={previewBaseHeight}
                scaleX={previewScaleX}
                scaleY={previewScaleY}
                animations={{
                  [animationKey]: flatEditableFrames,
                }}
                animation={animationKey}
                frameRate={speed}
                frameIndex={frameIndex}
              />
              <Rect
                x={previewOffsetX}
                y={previewOffsetY}
                width={previewWidth}
                height={previewHeight}
                stroke="#ef4444"
                strokeWidth={2}
                listening={false}
              />
            </Layer>
          </Stage>
        ) : (
          <div className={styles.LoadingState}>Carregando sprite...</div>
        )}
      </div>
    </>
  );
}
