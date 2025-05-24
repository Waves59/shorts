import { RefObject } from "react";

export interface ProgressBarProps {
  videoRef: RefObject<HTMLVideoElement>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  controlsRef: RefObject<HTMLDivElement | null>;
}
