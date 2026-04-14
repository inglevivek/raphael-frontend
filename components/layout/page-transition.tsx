'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const EASE = [0.16, 1, 0.3, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: EASE }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}