"use client";

import { motion, Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AnimatedBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      whileHover={{ scale: 1.08, y: -1 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
