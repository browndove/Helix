import { motion, useReducedMotion } from "framer-motion";

export default function SlideIn({
  children,
  direction = "bottom",
  delay = 0,
  className = "",
  depth = 12,
}) {
  const reduceMotion = useReducedMotion();
  const offset = {
    top: { y: -depth },
    bottom: { y: depth },
    left: { x: -depth },
    right: { x: depth },
  }[direction];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ ...offset, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
