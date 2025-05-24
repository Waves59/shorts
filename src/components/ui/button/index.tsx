import { LoadingIcon } from "@internals/components/ui/icon";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "icon"
    | "gradient"
    | "transparent-border";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: ReactNode;
  loading?: boolean;
}

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white border-transparent",
  outline: "bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300",
  ghost: "bg-transparent text-white border-transparent",
  icon: "bg-transparent hover:bg-transparent border-transparent text-white",
  gradient:
    "bg-gradient-to-r from-brand-tint-40 to-brand-tint-30 text-white hover:from-brand-tint-50 hover:to-brand-tint-40 border-transparent",
  "transparent-border":
    "bg-transparent border-2 border-neutral-tint-50/30 text-brand-tint-40-opacity-10 hover:border-brand-tint-40/50 hover:text-white",
} as const;

const sizeClasses = {
  sm: "px-3 py-1.5 text-[11px]/[13px] sm:text-[12px]/[16px]",
  md: "px-4 py-2 text-[12px]/[16px] sm:text-[14px]/[18px]",
  lg: "px-6 py-3 text-[14px]/[18px] sm:text-[16px]/[20px]",
} as const;

const loadingClasses =
  "bg-gray-500 text-gray-300 cursor-not-allowed hover:bg-gray-500";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: BaseButtonProps) => {
  const baseClasses =
    "cursor-pointer inline-flex items-center justify-center font-medium rounded-2xl border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const classes = [
    baseClasses,
    loading ? loadingClasses : variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spacing = size === "sm" ? "gap-1.5" : "gap-2";

  const renderContent = () => {
    if (loading) {
      return <LoadingIcon size={16}>{children}</LoadingIcon>;
    }

    return children;
  };

  return (
    <button
      className={`${classes} ${children ? spacing : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};
