"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __tayariReady?: boolean;
  }
}

/** Tells the MotionScript failsafe that React has hydrated, so reveals stay in charge. */
export function MotionReady() {
  useEffect(() => {
    window.__tayariReady = true;
  }, []);
  return null;
}
