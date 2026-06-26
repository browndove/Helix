import clsx from "clsx";

export default function Card({ children, className, hover = true, padding = "p-8" }) {
  return (
    <section className={clsx("dashboard-card", hover && "hover-lift", padding, className)}>
      {children}
    </section>
  );
}

export function Panel({ children, className }) {
  return <div className={clsx("nested-panel p-3", className)}>{children}</div>;
}
