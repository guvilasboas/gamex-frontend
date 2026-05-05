import {
  Circle,
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import type Konva from "konva";
import { useState } from "react";
import type { MutableRefObject, RefObject } from "react";
import { INSPECTOR_STAGE_SIZE } from "../debug-animation.constants";
import type {
  AnimationFrame,
  InspectorMetrics,
} from "../debug-animation.types";
import styles from "../debug-animation.module.css";

type DebugAnimationInspectorStageProps = {
  animationLabel: string;
  spriteImage?: HTMLImageElement | null;
  inspectorMetrics: InspectorMetrics | null;
  editableFrames: AnimationFrame[];
  frameIndex: number;
  frameGroupRefs: MutableRefObject<Record<number, Konva.Group | null>>;
  transformerRef: RefObject<Konva.Transformer | null>;
  onSelectFrame: (index: number) => void;
  onUpdateFrameAtIndex: (index: number, frame: AnimationFrame) => void;
};

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;

export function DebugAnimationInspectorStage({
  animationLabel,
  spriteImage,
  inspectorMetrics,
  editableFrames,
  frameIndex,
  frameGroupRefs,
  transformerRef,
  onSelectFrame,
  onUpdateFrameAtIndex,
}: DebugAnimationInspectorStageProps) {
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false);

  const applyZoom = (newZoom: number, originX?: number, originY?: number) => {
    const clampedZoom = Math.min(
      Math.max(+newZoom.toFixed(2), ZOOM_MIN),
      ZOOM_MAX,
    );
    if (originX !== undefined && originY !== undefined) {
      setStagePos((pos) => ({
        x: originX - ((originX - pos.x) / zoom) * clampedZoom,
        y: originY - ((originY - pos.y) / zoom) * clampedZoom,
      }));
    } else {
      const center = INSPECTOR_STAGE_SIZE / 2;
      setStagePos((pos) => ({
        x: center - ((center - pos.x) / zoom) * clampedZoom,
        y: center - ((center - pos.y) / zoom) * clampedZoom,
      }));
    }
    setZoom(clampedZoom);
  };

  const zoomIn = () => applyZoom(zoom + ZOOM_STEP);
  const zoomOut = () => applyZoom(zoom - ZOOM_STEP);
  const zoomReset = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <>
      <div className={styles.StageHeader}>
        <div>
          <span className={styles.StageEyebrow}>Inspector</span>
          <h3 className={styles.StageTitle}>{animationLabel}</h3>
        </div>
        <p className={styles.StageDescription}>
          Arraste o frame para reposicionar, redimensione o frame ativo e use os
          marcadores circulares no topo para se orientar.
        </p>
      </div>
      <div className={styles.ZoomRow}>
        <button
          className={styles.ZoomButton}
          onClick={zoomOut}
          disabled={zoom <= ZOOM_MIN}
          title="Diminuir zoom"
        >
          −
        </button>
        <span
          className={styles.ZoomLabel}
          onClick={zoomReset}
          title="Resetar zoom"
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          className={styles.ZoomButton}
          onClick={zoomIn}
          disabled={zoom >= ZOOM_MAX}
          title="Aumentar zoom"
        >
          +
        </button>
        <div className={styles.ZoomDivider} />
        <button
          className={styles.ZoomButton}
          data-active={panMode}
          onClick={() => setPanMode((v) => !v)}
          title={panMode ? "Sair do modo pan" : "Ativar pan (arrastar tela)"}
        >
          &#10021;
        </button>
      </div>
      <div className={styles.CanvasShell} data-pan={panMode}>
        {spriteImage && inspectorMetrics ? (
          <Stage
            width={INSPECTOR_STAGE_SIZE}
            height={INSPECTOR_STAGE_SIZE}
            scaleX={zoom}
            scaleY={zoom}
            x={stagePos.x}
            y={stagePos.y}
            draggable={panMode}
            onDragEnd={(e) => {
              const s = e.target as Konva.Stage;
              setStagePos({ x: s.x(), y: s.y() });
            }}
            onWheel={(event) => {
              event.evt.preventDefault();
              const stage = event.target.getStage()!;
              const pointer = stage.getPointerPosition()!;
              const delta = event.evt.deltaY > 0 ? -0.1 : 0.1;
              applyZoom(zoom + delta, pointer.x, pointer.y);
            }}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={INSPECTOR_STAGE_SIZE}
                height={INSPECTOR_STAGE_SIZE}
                fill="#08111d"
              />
              <KonvaImage
                image={spriteImage}
                x={inspectorMetrics.offsetX}
                y={inspectorMetrics.offsetY}
                width={inspectorMetrics.width}
                height={inspectorMetrics.height}
              />
              {editableFrames.map((frame, index) => {
                const isActive = index === frameIndex;
                const scaledX =
                  inspectorMetrics.offsetX + frame.x * inspectorMetrics.scale;
                const scaledY =
                  inspectorMetrics.offsetY + frame.y * inspectorMetrics.scale;
                const scaledWidth = frame.width * inspectorMetrics.scale;
                const scaledHeight = frame.height * inspectorMetrics.scale;
                const markerColor = isActive ? "#fb923c" : "#34d399";
                const markerColumns = [1 / 6, 3 / 6, 5 / 6];
                const markerRows = [1 / 6, 3 / 6, 5 / 6];
                const gridDivisions = [1 / 3, 2 / 3];

                // scale visual elements relative to the frame's rendered size
                const frameUnit = Math.min(scaledWidth, scaledHeight);
                const fs = Math.min(1, Math.max(0.15, frameUnit / 64));
                const rectStrokeWidth = isActive
                  ? Math.max(0.5, 3 * fs)
                  : Math.max(0.3, 1.5 * fs);
                const gridStrokeWidth = Math.max(0.3, 1 * fs);
                const dashSize = Math.max(2, 8 * fs);
                const dashGap = Math.max(1, 4 * fs);
                const markerRadius = isActive
                  ? Math.max(1.5, 4 * fs)
                  : Math.max(1, 3 * fs);
                const markerStrokeWidth = isActive
                  ? Math.max(0.5, 2 * fs)
                  : Math.max(0.4, 1.5 * fs);

                return (
                  <Group
                    key={`${index}-${frame.x}-${frame.y}`}
                    ref={(node) => {
                      frameGroupRefs.current[index] = node;
                    }}
                    x={scaledX}
                    y={scaledY}
                    draggable={!panMode}
                    listening={!panMode}
                    onClick={panMode ? undefined : () => onSelectFrame(index)}
                    onTap={panMode ? undefined : () => onSelectFrame(index)}
                    onDragStart={
                      panMode ? undefined : () => onSelectFrame(index)
                    }
                    onDragEnd={(event) => {
                      const node = event.target as Konva.Group;

                      onUpdateFrameAtIndex(index, {
                        x:
                          (node.x() - inspectorMetrics.offsetX) /
                          inspectorMetrics.scale,
                        y:
                          (node.y() - inspectorMetrics.offsetY) /
                          inspectorMetrics.scale,
                        width: frame.width,
                        height: frame.height,
                      });
                    }}
                    onTransformStart={() => onSelectFrame(index)}
                    onTransformEnd={(event) => {
                      const node = event.target as Konva.Group;
                      const nextWidth = frame.width * node.scaleX();
                      const nextHeight = frame.height * node.scaleY();

                      node.scaleX(1);
                      node.scaleY(1);

                      onUpdateFrameAtIndex(index, {
                        x:
                          (node.x() - inspectorMetrics.offsetX) /
                          inspectorMetrics.scale,
                        y:
                          (node.y() - inspectorMetrics.offsetY) /
                          inspectorMetrics.scale,
                        width: nextWidth,
                        height: nextHeight,
                      });
                    }}
                  >
                    <Group listening={false}>
                      {gridDivisions.map((division) => (
                        <Line
                          key={`grid-v-${division}`}
                          points={[
                            scaledWidth * division,
                            0,
                            scaledWidth * division,
                            scaledHeight,
                          ]}
                          stroke={
                            isActive
                              ? "rgba(251, 146, 60, 0.55)"
                              : "rgba(52, 211, 153, 0.4)"
                          }
                          strokeWidth={gridStrokeWidth}
                          dash={[dashSize, dashGap]}
                        />
                      ))}
                      {gridDivisions.map((division) => (
                        <Line
                          key={`grid-h-${division}`}
                          points={[
                            0,
                            scaledHeight * division,
                            scaledWidth,
                            scaledHeight * division,
                          ]}
                          stroke={
                            isActive
                              ? "rgba(251, 146, 60, 0.55)"
                              : "rgba(52, 211, 153, 0.4)"
                          }
                          strokeWidth={gridStrokeWidth}
                          dash={[dashSize, dashGap]}
                        />
                      ))}
                      {markerRows.flatMap((row) =>
                        markerColumns.map((column) => (
                          <Circle
                            key={`marker-${row}-${column}`}
                            x={scaledWidth * column}
                            y={scaledHeight * row}
                            radius={markerRadius}
                            fill="#e2e8f0"
                            stroke={markerColor}
                            strokeWidth={markerStrokeWidth}
                            opacity={0.95}
                          />
                        )),
                      )}
                    </Group>
                    <Rect
                      x={0}
                      y={0}
                      width={scaledWidth}
                      height={scaledHeight}
                      fill={
                        isActive
                          ? "rgba(249, 115, 22, 0.12)"
                          : "rgba(34, 197, 94, 0.08)"
                      }
                      stroke={isActive ? "#f97316" : "#22c55e"}
                      strokeWidth={rectStrokeWidth}
                      dash={isActive ? undefined : [dashSize, dashGap]}
                    />
                  </Group>
                );
              })}
              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                flipEnabled={false}
                ignoreStroke
                borderStroke="#f8fafc"
                anchorStroke="#f97316"
                anchorFill="#fff7ed"
                anchorSize={(() => {
                  const f = editableFrames[frameIndex];
                  if (!f || !inspectorMetrics) return 10;
                  const unit = Math.min(
                    f.width * inspectorMetrics.scale,
                    f.height * inspectorMetrics.scale,
                  );
                  return Math.min(10, Math.max(4, unit / 8));
                })()}
                boundBoxFunc={(oldBox, newBox) => {
                  const minSize = Math.max(inspectorMetrics.scale, 6);

                  if (newBox.width < minSize || newBox.height < minSize) {
                    return oldBox;
                  }

                  return newBox;
                }}
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
