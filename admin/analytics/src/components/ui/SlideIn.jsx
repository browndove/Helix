import { motion } from "framer-motion";

export default function SlideIn({
  children,
  direction = "bottom",
  delay = 0,
  className = "",
  depth = 24,
}) {
  const offset = {
    top: { y: -depth },
    bottom: { y: depth },
    left: { x: -depth },
    right: { x: depth },
  }[direction];

  return (
    <motion.div
      initial={{ ...offset, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
