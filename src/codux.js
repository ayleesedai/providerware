import React, { createContext, useContext, useMemo, useReducer as useReactReducer } from 'react';

const context = createContext();

const Provider = ({ middlewares, children }) => {
    const wrapReducer = useMemo(() => reducer => {
        const [state, dispatch] = reducer;
        const wrappedDispatch = action => {
            if (!middlewares || middlewares.length === 0) {
                dispatch(action);
            } else {
                for(let i=0; i<middlewares.length; ++i)
                    middlewares[i](dispatch, action, state);
            }
        }
        return [state, wrappedDispatch];
    }, [middlewares]);
    return <context.Provider value={wrapReducer}>{children}</context.Provider>
};

const useReducer = (reducer, initialState) => {
    const reactReducer = useReactReducer(reducer, initialState);
    const wrapReducer = useContext(context);
    return wrapReducer(reactReducer);
}

export { Provider, useReducer };
