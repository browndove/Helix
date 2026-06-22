import clsx from "clsx";
import { tailwindTextColors } from "../../lib/theme-colors";

const textVariants = {
  "body-xs": "text-[10px] leading-[1.05] font-medium",
  "body-xs-semibold": "text-[10px] leading-[1.05] font-semibold",
  "body-sm": "text-xs leading-[1.05] font-medium",
  "body-sm-semibold": "text-xs leading-[1.05] font-semibold",
  "body-md": "text-sm leading-[1.05] font-medium",
  "body-md-semibold": "text-sm leading-[1.05] font-bold",
  "heading-sm": "text-base leading-[1.05] font-bold",
  "heading-md": "text-lg leading-[1.05] font-bold",
  "metric": "text-[28px] leading-[1.05] font-bold tabular-nums",
  "metric-lg": "text-[38px] leading-[1.05] font-bold tabular-nums",
};

export default function Text({
  as: Component = "span",
  variant = "body-sm",
  color = "text-primary",
  truncate = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "tracking-tight",
        textVariants[variant],
        color !== "none" && tailwindTextColors[color],
        truncate && "truncate",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
