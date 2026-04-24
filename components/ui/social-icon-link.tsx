"use client";

import { motion, Variants } from "framer-motion";
import { TextFlip } from "@/components/ui/text-flip";

const variants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      variants={variants}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-none border border-neutral-800 bg-black text-sm font-medium shadow-xs transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:shadow-none"
    >
      <TextFlip>{children}</TextFlip>
    </motion.a>
  );
}
