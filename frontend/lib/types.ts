export type ExposureLevel = "low" | "moderate" | "high" | "common";

export interface Evidence {
  quote: string;
  source: string;
  confidence: number | null;
}

export interface Dimension {
  code: string;
  name: string;
  sub: string;
  score: number;
  level: ExposureLevel;
  evidence: Evidence;
  note: string | null;
}

export interface Tier {
  id: string;
  title: string;
  desc: string;
  color: string;
  dimensions: Dimension[];
}

export type PlatformStatus = "active" | "soon";

export interface Platform {
  id: string;
  label: string;
  status: PlatformStatus;
}

export interface OverviewData {
  feedHealth: number;
  platforms: Platform[];
  tiers: Tier[];
  recommendation: string;
}
