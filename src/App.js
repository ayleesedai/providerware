import React, { useMemo } from "react";
import { useReducer, Provider } from "./codux";

const Counter = ({ name }) => {
    const [state, dispatch] = useReducer(
        (state, { type }) =>
            type === "INC" ? { name, count: state.count + 1 } : state,
        { name, count: 0 }
    );
    const onClick = useMemo(() => () => dispatch({ type: "INC" }), []);
    return (
        <div
            onClick={onClick}
            style={{
                fontWeight: "normal",
                cursor: "pointer",
                color: "white",
                padding: "1em"
            }}
        >{`${name}: ${state.count}`}</div>
    );
};

const AComponent = ({ color: backgroundColor, children }) => (
    <div style={{ backgroundColor }}>{children}</div>
);

const App = () => {
    const loggerMiddleware = useMemo(() => (next, action, state, dispatch) => {
        console.group(action.type);
        console.log("State", state);
        console.log("Action", action);
        console.groupEnd();
        next(action);
    });
    const anotherLoggerMiddleware = useMemo(
        () => (next, action, state, dispatch) => {
            console.log("Another log", action.type);
            next(action);
        }
    );
    return (
        <div
            style={{
                width: "33%",
                fontSize: "1.5em",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <Provider middlewares={[loggerMiddleware, anotherLoggerMiddleware]}>
                {"Click on any bar to increment its counter"}
                <AComponent color="green">
                    <Counter name="First" />
                </AComponent>
                <AComponent color="blue">
                    <AComponent color="black">
                        <Counter name="Second" />
                    </AComponent>
                    <Counter name="Third" />
                </AComponent>
                <AComponent color="magenta">
                    <Counter name="Fourth" />
                </AComponent>
            </Provider>
        </div>
    );
};

export default App;
