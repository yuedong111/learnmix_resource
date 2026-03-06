type Unsubscribe = () => void;

export function createStore<S extends object>(initialState: S) {
    let state = initialState;
    const subs = new Set<(s:S) => void>();
    function getState():S{
        return state;
    }

    function setState(patch:Partial<S>|((prev:S)=>Partial<S>)):void{
        const nextPatch = typeof patch === "function" ? patch(state) : patch;
        state = {...state, ...nextPatch};
        for (const fn of subs) fn(state);
    }

    function subscribe(fn:(s:S) => void): Unsubscribe {
        subs.add(fn);
        return () => subs.delete(fn);
    }

    function select<R>(selector:(s:S)=>R): R {
        return selector(state);
    }
    return { getState, setState, subscribe, select };

}
