interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const ArrowLeft = ({
  width = 24,
  height = 24,
  className = "",
  fill = "currentColor",
  stroke,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    className={className}
  >
    <path d="M16.707 4.707 9.414 12l7.293 7.293-1.414 1.414L6.586 12l8.707-8.707 1.414 1.414z" />
  </svg>
);
