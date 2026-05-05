import type {
  AnimationOption,
  FrameGap,
  FrameGrid,
  FrameMargins,
} from "../debug-animation.types";
import { clampNonNegative, clampPositive } from "../debug-animation.utils";
import {
  DEFAULT_RENDER_SCALE,
  MAX_SPEED,
  MIN_SPEED,
} from "../debug-animation.constants";
import styles from "../debug-animation.module.css";

type DebugAnimationControlsProps = {
  animationOptions: AnimationOption[];
  selectedAnimationKey: string;
  mode: "playback" | "inspect";
  isPlaying: boolean;
  totalFrames: number;
  speed: number;
  frameIndex: number;
  renderScale: number;
  renderWidth: number;
  renderHeight: number;
  previewBaseWidth: number;
  previewBaseHeight: number;
  fixedFrameWidth: number;
  fixedFrameHeight: number;
  frameGap: FrameGap;
  frameGrid: FrameGrid;
  frameMargins: FrameMargins;
  onAnimationChange: (value: string) => void;
  onModeChange: (value: "playback" | "inspect") => void;
  onTogglePlaying: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onSpeedChange: (value: number) => void;
  onFrameIndexChange: (value: number) => void;
  onRenderScaleChange: (value: number) => void;
  onRenderWidthChange: (value: number) => void;
  onRenderHeightChange: (value: number) => void;
  onFixedFrameWidthChange: (value: number) => void;
  onFixedFrameHeightChange: (value: number) => void;
  onFrameGapChange: (axis: keyof FrameGap, value: number) => void;
  onFrameGridChange: (axis: keyof FrameGrid, value: number) => void;
  onFrameMarginChange: (side: keyof FrameMargins, value: number) => void;
  onReset: () => void;
  onExport: () => void;
};

export function DebugAnimationControls({
  animationOptions,
  selectedAnimationKey,
  mode,
  isPlaying,
  totalFrames,
  speed,
  frameIndex,
  renderScale,
  renderWidth,
  renderHeight,
  previewBaseWidth,
  previewBaseHeight,
  fixedFrameWidth,
  fixedFrameHeight,
  frameGap,
  frameGrid,
  frameMargins,
  onAnimationChange,
  onModeChange,
  onTogglePlaying,
  onPreviousFrame,
  onNextFrame,
  onSpeedChange,
  onFrameIndexChange,
  onRenderScaleChange,
  onRenderWidthChange,
  onRenderHeightChange,
  onFixedFrameWidthChange,
  onFixedFrameHeightChange,
  onFrameGapChange,
  onFrameGridChange,
  onFrameMarginChange,
  onReset,
  onExport,
}: DebugAnimationControlsProps) {
  return (
    <>
      <div className={styles.Section}>
        <span className={styles.SectionLabel}>Animacao</span>
        <label className={styles.FieldLabel} htmlFor="debug-animation-select">
          Selecione uma animacao
        </label>
        <select
          id="debug-animation-select"
          className={styles.Select}
          value={selectedAnimationKey}
          onChange={(event) => onAnimationChange(event.target.value)}
        >
          {animationOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.sourceLabel} / {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.Section}>
        <span className={styles.SectionLabel}>Modo</span>
        <div
          className={styles.SegmentedControl}
          role="tablist"
          aria-label="Debug mode"
        >
          <button
            type="button"
            className={styles.SegmentedButton}
            data-active={mode === "playback"}
            onClick={() => onModeChange("playback")}
          >
            Reproducao
          </button>
          <button
            type="button"
            className={styles.SegmentedButton}
            data-active={mode === "inspect"}
            onClick={() => onModeChange("inspect")}
          >
            Inspecao
          </button>
        </div>
      </div>

      <div className={styles.Section}>
        <span className={styles.SectionLabel}>Controles</span>
        <div className={styles.ControlsRow}>
          <button
            type="button"
            className={styles.ControlButton}
            onClick={onTogglePlaying}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className={styles.ControlButton}
            onClick={onPreviousFrame}
            disabled={totalFrames === 0}
          >
            Frame -
          </button>
          <button
            type="button"
            className={styles.ControlButton}
            onClick={onNextFrame}
            disabled={totalFrames === 0}
          >
            Frame +
          </button>
        </div>

        <div className={styles.RangeField}>
          <div className={styles.RangeHeader}>
            <label
              className={styles.FieldLabel}
              htmlFor="debug-animation-speed"
            >
              Velocidade
            </label>
            <span className={styles.FieldValue}>{speed.toFixed(0)} fps</span>
          </div>
          <input
            id="debug-animation-speed"
            className={styles.Range}
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={1}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
        </div>

        <div className={styles.RangeField}>
          <div className={styles.RangeHeader}>
            <label
              className={styles.FieldLabel}
              htmlFor="debug-animation-frame"
            >
              Frame atual
            </label>
            <span className={styles.FieldValue}>
              {totalFrames === 0 ? 0 : frameIndex + 1}/{totalFrames}
            </span>
          </div>
          <input
            id="debug-animation-frame"
            className={styles.Range}
            type="range"
            min={0}
            max={Math.max(totalFrames - 1, 0)}
            step={1}
            value={Math.min(frameIndex, Math.max(totalFrames - 1, 0))}
            onChange={(event) => onFrameIndexChange(Number(event.target.value))}
            disabled={totalFrames === 0}
          />
        </div>

        <div className={styles.ControlGroups}>
          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Preview</legend>
            <div className={styles.NumericFields}>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-scale"
                >
                  Scale
                </label>
                <input
                  id="debug-animation-scale"
                  className={styles.NumberInput}
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={renderScale}
                  onChange={(event) =>
                    onRenderScaleChange(
                      clampPositive(
                        Number(event.target.value),
                        DEFAULT_RENDER_SCALE,
                      ),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-width"
                >
                  Largura
                </label>
                <input
                  id="debug-animation-width"
                  className={styles.NumberInput}
                  type="number"
                  min={1}
                  step={1}
                  value={renderWidth}
                  onChange={(event) =>
                    onRenderWidthChange(
                      clampPositive(
                        Number(event.target.value),
                        previewBaseWidth,
                      ),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-height"
                >
                  Altura
                </label>
                <input
                  id="debug-animation-height"
                  className={styles.NumberInput}
                  type="number"
                  min={1}
                  step={1}
                  value={renderHeight}
                  onChange={(event) =>
                    onRenderHeightChange(
                      clampPositive(
                        Number(event.target.value),
                        previewBaseHeight,
                      ),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Frame Size</legend>
            <div className={styles.NumericFields}>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-fixed-width"
                >
                  Frame W
                </label>
                <input
                  id="debug-animation-fixed-width"
                  className={styles.NumberInput}
                  type="number"
                  min={1}
                  step={1}
                  value={fixedFrameWidth}
                  onChange={(event) =>
                    onFixedFrameWidthChange(
                      clampPositive(Number(event.target.value), 1),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-fixed-height"
                >
                  Frame H
                </label>
                <input
                  id="debug-animation-fixed-height"
                  className={styles.NumberInput}
                  type="number"
                  min={1}
                  step={1}
                  value={fixedFrameHeight}
                  onChange={(event) =>
                    onFixedFrameHeightChange(
                      clampPositive(Number(event.target.value), 1),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Gap</legend>
            <div className={styles.NumericFields}>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-gap-horizontal"
                >
                  Gap H
                </label>
                <input
                  id="debug-animation-gap-horizontal"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameGap.horizontal}
                  onChange={(event) =>
                    onFrameGapChange(
                      "horizontal",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-gap-vertical"
                >
                  Gap V
                </label>
                <input
                  id="debug-animation-gap-vertical"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameGap.vertical}
                  onChange={(event) =>
                    onFrameGapChange(
                      "vertical",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Grid</legend>
            <div className={styles.NumericFields}>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-columns"
                >
                  Colunas
                </label>
                <input
                  id="debug-animation-columns"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameGrid.columns}
                  onChange={(event) =>
                    onFrameGridChange(
                      "columns",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-rows"
                >
                  Linhas
                </label>
                <input
                  id="debug-animation-rows"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameGrid.rows}
                  onChange={(event) =>
                    onFrameGridChange(
                      "rows",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Margin</legend>
            <div className={styles.NumericFields}>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-margin-left"
                >
                  Margin L
                </label>
                <input
                  id="debug-animation-margin-left"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameMargins.left}
                  onChange={(event) =>
                    onFrameMarginChange(
                      "left",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-margin-top"
                >
                  Margin T
                </label>
                <input
                  id="debug-animation-margin-top"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameMargins.top}
                  onChange={(event) =>
                    onFrameMarginChange(
                      "top",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-margin-right"
                >
                  Margin R
                </label>
                <input
                  id="debug-animation-margin-right"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameMargins.right}
                  onChange={(event) =>
                    onFrameMarginChange(
                      "right",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
              <div className={styles.NumberField}>
                <label
                  className={styles.FieldLabel}
                  htmlFor="debug-animation-margin-bottom"
                >
                  Margin B
                </label>
                <input
                  id="debug-animation-margin-bottom"
                  className={styles.NumberInput}
                  type="number"
                  min={0}
                  step={1}
                  value={frameMargins.bottom}
                  onChange={(event) =>
                    onFrameMarginChange(
                      "bottom",
                      clampNonNegative(Number(event.target.value), 0),
                    )
                  }
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.ControlFieldset}>
            <legend className={styles.ControlLegend}>Actions</legend>
            <div className={styles.ActionRow}>
              <button
                type="button"
                className={styles.ResetButton}
                onClick={onReset}
              >
                Resetar
              </button>
              <button
                type="button"
                className={styles.CopyButton}
                onClick={onExport}
              >
                Exportar
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
