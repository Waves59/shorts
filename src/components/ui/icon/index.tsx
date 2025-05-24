import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";
import { PauseIcon } from "./PauseIcon";
import { PlayIcon } from "./PlayIcon";

export { ArrowLeft, ArrowRight, PauseIcon, PlayIcon };

const iconComponents = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  play: PlayIcon,
  pause: PauseIcon,
} as const;

export type IconName = keyof typeof iconComponents;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
}

export const Icon = ({
  name,
  size = 24,
  className = "",
  fill = "currentColor",
  stroke,
  width,
  height,
}: IconProps) => {
  const iconSize =
    width && height ? { width, height } : { width: size, height: size };

  const commonProps = {
    ...iconSize,
    className,
    fill,
    stroke,
  };

  const Component = iconComponents[name];

  return Component ? <Component {...commonProps} /> : null;
};
