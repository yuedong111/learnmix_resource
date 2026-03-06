
import { assertNever } from "../core/never";
import type { AppConfig, LogLevel, Mode } from "../config/schema";

export type Action =
  | { type: "setPort"; port: number }
  | { type: "setMode"; mode: Mode }
  | { type: "setLogLevel"; logLevel: LogLevel }
  | { type: "toggleFeature"; key: keyof AppConfig["featureFlags"]; value: boolean };

export function reduceConfig(prev: AppConfig, action: Action): AppConfig {
  switch (action.type) {
    case "setPort":
      return { ...prev, port: action.port };
    case "setMode":
      return { ...prev, mode: action.mode };
    case "setLogLevel":
      return { ...prev, logLevel: action.logLevel };
    case "toggleFeature":
      return {
        ...prev,
        featureFlags: { ...prev.featureFlags, [action.key]: action.value },
      };
    default:
      return assertNever(action, "Unhandled action");
  }
}