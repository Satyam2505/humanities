"use client";

import { useEffect, useState } from "react";

interface FeedHealthGaugeProps {
  score: number;
}

/**
 * Sized in CSS rather than pixels so it scales with the viewport and with
 * browser/OS zoom. The sweep on mount is there to pull the eye to the
 * headline number first; it collapses to a static arc under reduced motion
 * via the global rule in globals.css.
 */
export function FeedHealthGauge({ score }: FeedHealthGaugeProps) {
  const [display, setDisplay] = useState(0);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDisplay(score));
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className="relative grid shrink-0 place-items-center [inline-size:clamp(7.5rem,4rem+14vw,12.5rem)] [aspect-ratio:1]"
      role="img"
      aria-label={`Feed health score: ${score} out of 100`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--level-track)"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="relative flex flex-col items-center leading-none" aria-hidden="true">
        <span className="font-display text-fluid-2xl font-semibold tabular-nums text-ink">
          {score}
        </span>
        <span className="mt-1 text-fluid-xs font-medium text-muted">feed health</span>
      </div>
    </div>
  );
}
