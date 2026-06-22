import clsx from "clsx";

const variants = {
  primary: "bg-accent-primary text-white hover:bg-accent-primary/90 shadow-input",
  secondary: "bg-tertiary text-text-primary hover:bg-quaternary",
  outline: "border border-tertiary bg-primary text-text-primary hover:bg-primary-light",
  ghost: "bg-transparent text-text-secondary hover:bg-primary-light",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40",
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
