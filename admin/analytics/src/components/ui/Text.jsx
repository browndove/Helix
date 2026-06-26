import clsx from "clsx";
import { tailwindTextColors } from "../../lib/theme-colors";

const textVariants = {
  footnote: "text-[11px] leading-[1.35] font-normal tracking-[0.01em]",
  caption: "text-[13px] leading-[1.4] font-normal tracking-[0.01em]",
  "body-xs": "text-[13px] leading-[1.4] font-normal",
  "body-xs-semibold": "text-[13px] leading-[1.4] font-semibold",
  "body-sm": "text-[15px] leading-[1.5] font-normal",
  "body-sm-semibold": "text-[15px] leading-[1.5] font-semibold",
  "body-md": "text-[17px] leading-[1.55] font-normal",
  "body-md-semibold": "text-[17px] leading-[1.55] font-semibold",
  "heading-sm": "text-[20px] leading-[1.3] font-semibold tracking-[-0.01em]",
  "heading-md": "text-[24px] leading-[1.2] font-semibold tracking-[-0.012em]",
  metric: "text-[28px] leading-[1.05] font-semibold tabular-nums tracking-[-0.02em]",
  "metric-lg": "text-[38px] leading-[1.05] font-semibold tabular-nums tracking-[-0.02em]",
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
