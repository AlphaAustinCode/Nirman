"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode } from 'react';

export default function SmoothScroller({ children }: { children: ReactNode }) {
  // Lenis instance access if needed across the app
  useLenis(({ scroll }) => {
    // console.log("current scroll", scroll)
  });

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
