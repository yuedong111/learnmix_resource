export type Mode = "dev" | "prod";
export type LogLevel = "debug" | "info" | "warn" | "error";

// feature flags 的 key 集合（固定）
export const FEATURE_KEYS = ["cache", "metrics", "newUI"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

// 最终强类型配置
export type AppConfig = {
  port: number;
  mode: Mode;
  logLevel: LogLevel;
  featureFlags: Record<FeatureKey, boolean>;
};
