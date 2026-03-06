import { loadConfig } from "../config/loadConfig";
import { createStore } from "../core/store";
import { createEventBus } from "../core/eventBus";
import type { Events } from "./events";
import { decodeActionFromArgv } from "./cli";
import { reduceConfig } from "./actions";

function main() {
    // 1) loadConfig（unknown -> decode -> typed）
    const cfgR = loadConfig();
    if (!cfgR.ok) {
        console.error("CONFIG ERROR:", cfgR.error);
        process.exit(1);
    }

    // 2) createStore(config)
    const store = createStore(cfgR.data);

    // 3) createEventBus()
    const bus = createEventBus<Events>();

    // ---- 订阅者（模拟 UI/日志系统） ----

    // 订阅 store：状态变化 => emit 事件
    const unsubStore = store.subscribe((next) => {
        bus.emit("log/info", { msg: `store updated: mode=${next.mode} port=${next.port}` });
        bus.emit("ui/render"); // ✅ void payload：不能传第二参
    });

    // 订阅 bus：打印日志
    const unsubInfo = bus.on("log/info", (p) => console.log("[INFO]", p.msg));
    const unsubErr = bus.on("log/error", (p) => console.log("[ERROR]", p.msg));

    // 模拟 UI 渲染订阅
    const unsubRender = bus.on("ui/render", () => {
        const s = store.getState();
        console.log("[UI]", `mode=${s.mode} port=${s.port}`, s.featureFlags);
    });

    bus.emit("config/loaded", store.getState());

    // ---- CLI 改 config → store 更新 → emit → 订阅响应 ----
    const actionR = decodeActionFromArgv(process.argv);
    if (!actionR.ok) {
        bus.emit("log/error", { msg: actionR.error });
    } else if (actionR.data) {
        const prev = store.getState();
        const next = reduceConfig(prev, actionR.data);
        store.setState(next);

        bus.emit("config/changed", { prev, next, reason: "cli" });
    } else {
        bus.emit("log/info", { msg: "No CLI action. Try: set port=4000" });
    }

    // ---- 订阅泄漏复现与修复（见下一节） ----
    // 正常结束：释放订阅
    unsubRender();
    unsubInfo();
    unsubErr();
    unsubStore();
}

main();