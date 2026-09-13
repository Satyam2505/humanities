import type { ExposureLevel } from "./types";

/**
 * Exposure is shown as intensity within the brand palette rather than as
 * traffic-light severity. "Common" sits at the lowest intensity because
 * baseline content is expected, not notable, and is never labeled "High".
 */
export type Intensity = 1 | 2 | 3;

export const LEVEL_LABEL: Record<ExposureLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  common: "Common",
};

export const LEVEL_INTENSITY: Record<ExposureLevel, Intensity> = {
  low: 1,
  moderate: 2,
  high: 3,
  common: 1,
};

export const INTENSITY_FILL: Record<Intensity, string> = {
  1: "var(--level-1)",
  2: "var(--level-2)",
  3: "var(--level-3)",
};
