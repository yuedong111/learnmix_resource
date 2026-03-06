import type { AppConfig } from "../config/schema";

export type Events = {
  "config/loaded": AppConfig;
  "config/changed": { prev: AppConfig; next: AppConfig; reason: string };
  "ui/render": void; // ✅ void payload 事件：emit 时不能传第二参
  "log/info": { msg: string };
  "log/error": { msg: string };
};