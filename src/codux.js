import React, {
    createContext,
    useContext,
    useMemo,
    useReducer as useReactReducer
} from "react";

const context = createContext();

const hasMiddlewares = middlewares => middlewares && middlewares.length > 0;

const Provider = ({ middlewares, children }) => {
    const wrapReducer = useMemo(
        () => ([state, dispatch]) => {
            const wrappedDispatch = action => {
                const midds = [...middlewares];
                const next = action =>
                    hasMiddlewares(midds)
                        ? midds.pop()(next, action, state, dispatch)
                        : dispatch(action);
                next(action);
                /*if (hasMiddlewares(middlewares)) {
                    middlewares.forEach(middleware =>
                        middleware(dispatch, action, state)
                    );
                } else {
                    dispatch(action);
                }*/
            };
            return [state, wrappedDispatch];
        },
        [middlewares]
    );
    return <context.Provider value={wrapReducer}>{children}</context.Provider>;
};

const useReducer = (reducer, initialState) => {
    const reactReducer = useReactReducer(reducer, initialState);
    const wrapReducer = useContext(context);
    return wrapReducer(reactReducer);
};

export { Provider, useReducer };
