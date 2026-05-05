import type {
  AnimationFrame,
  AnimationOption,
  FrameGap,
  FrameGrid,
  FrameMargins,
} from "../debug-animation.types";
import styles from "../debug-animation.module.css";

type DebugAnimationMetadataProps = {
  selectedAnimation: AnimationOption;
  spriteImage?: HTMLImageElement | null;
  totalFrames: number;
  uniqueFrameSizes: string[];
  currentFrame: AnimationFrame | null;
  previewWidth: number;
  previewHeight: number;
  renderScale: number;
  animationBounds: { width: number; height: number };
  fixedFrameWidth: number;
  fixedFrameHeight: number;
  frameGap: FrameGap;
  frameGrid: FrameGrid;
  frameMargins: FrameMargins;
};

export function DebugAnimationMetadata({
  selectedAnimation,
  spriteImage,
  totalFrames,
  uniqueFrameSizes,
  currentFrame,
  previewWidth,
  previewHeight,
  renderScale,
  animationBounds,
  fixedFrameWidth,
  fixedFrameHeight,
  frameGap,
  frameGrid,
  frameMargins,
}: DebugAnimationMetadataProps) {
  return (
    <div className={styles.Metadata}>
      <div>
        <span className={styles.MetadataLabel}>Sheet</span>
        <strong className={styles.MetadataValue}>
          {selectedAnimation.sourceLabel}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Sprite</span>
        <strong className={styles.MetadataValue}>
          {selectedAnimation.resource}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Imagem original</span>
        <strong className={styles.MetadataValue}>
          {spriteImage
            ? `${spriteImage.width} x ${spriteImage.height}px`
            : "Carregando dimensoes..."}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Total de frames</span>
        <strong className={styles.MetadataValue}>{totalFrames}</strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Tamanhos de frame</span>
        <strong className={styles.MetadataValue}>
          {uniqueFrameSizes.join(", ")}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Frame atual bruto</span>
        <strong className={styles.MetadataValue}>
          {currentFrame
            ? `${currentFrame.width} x ${currentFrame.height}px`
            : "-"}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Frame atual escalado</span>
        <strong className={styles.MetadataValue}>
          {previewWidth} x {previewHeight}px @ {renderScale.toFixed(2)}x
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Area usada na sheet</span>
        <strong className={styles.MetadataValue}>
          {animationBounds.width} x {animationBounds.height}px
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Layout automatico</span>
        <strong className={styles.MetadataValue}>
          {fixedFrameWidth} x {fixedFrameHeight}px, gap H {frameGap.horizontal}
          px, gap V {frameGap.vertical}px, cols {frameGrid.columns}, linhas{" "}
          {frameGrid.rows}, margens {frameMargins.left}/{frameMargins.top}/
          {frameMargins.right}/{frameMargins.bottom}
        </strong>
      </div>
      <div>
        <span className={styles.MetadataLabel}>Frame</span>
        <strong className={styles.MetadataValue}>
          {currentFrame
            ? `${currentFrame.x}, ${currentFrame.y}, ${currentFrame.width}, ${currentFrame.height}`
            : "-"}
        </strong>
      </div>
    </div>
  );
}
