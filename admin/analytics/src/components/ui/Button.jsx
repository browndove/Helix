import clsx from "clsx";

const variants = {
  primary:
    "bg-accent-primary text-white hover:bg-[var(--accent-blue-hover)] active:scale-[0.97]",
  secondary:
    "bg-[var(--fill-tertiary)] text-text-primary hover:bg-[var(--fill-secondary)] active:scale-[0.97]",
  outline:
    "border-[1.5px] border-accent-primary bg-transparent text-accent-primary hover:bg-[var(--accent-blue-subtle)] active:scale-[0.97]",
  ghost:
    "bg-transparent text-text-secondary hover:bg-[var(--fill-tertiary)] hover:text-text-primary",
};

const sizes = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-11 px-6 text-[17px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-pill font-normal tracking-[-0.01em]",
        "transition-[background,transform,opacity] duration-150 ease-apple",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
