import { FEATURE_KEYS, type FeatureKey } from "./schema";

export type FeatureFlags = { [K in FeatureKey]: boolean };

export const defaultFeatureFlags = {
  cache: true,
  metrics: false,
  newUI: false,
} satisfies FeatureFlags;

// ❌ 下面这些都会红线：
// export const bad = { cache: true, metr1cs: false, newUI: false } satisfies FeatureFlags;
// export const bad2 = { cache: true, newUI: false } satisfies FeatureFlags;
