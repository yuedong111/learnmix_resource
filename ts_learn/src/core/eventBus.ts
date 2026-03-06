

type Unsubscribe = () => void;

type Handler<P> = P extends void ? () => void : (payload: P) => void;


type EventBus<Events extends Record<string, any>> = {
    on<K extends keyof Events>(type: K, handler: Handler<Events[K]>): Unsubscribe;
    emit<K extends keyof Events>(type: K, ...args: Events[K] extends void ? [] : [payload: Events[K]]): void;
};

//TypeScript 可以自动推断返回类型 - TypeScript 会根据 return { on, emit }; 推断出返回类型，加上返回类型仅仅是示例
export function createEventBus<Events extends Record<string, any>>(): EventBus<Events> {
    const listeners: Partial<Record<keyof Events, Set<Function>>> = {};
    function on<K extends keyof Events>(type: K, handler: Handler<Events[K]>): Unsubscribe {
        const set = (listeners[type] ??= new Set());
        set.add(handler as unknown as Function);
        return () => {
            set.delete(handler as unknown as Function);
            if (set.size === 0) delete listeners[type];
        }
    }

    function emit<K extends keyof Events>(type: K, ...args: Events[K] extends void ? [] : [payload: Events[K]]): void {
        const set = listeners[type];
        if (!set) return;
        for (const handler of set) {
            (handler as any)(...args);
        }
    }
    return { on, emit };
}

