import React, { useMemo } from 'react';
import { useReducer, Provider } from './codux';
import './App.css';

const Counter = ({ name }) => {
  const [state, dispatch] = useReducer((state, { type }) => type === 'INC' ? ({ name, count: state.count + 1 }) : state, { name, count: 0 });
  return (
    <div onClick={() => dispatch({ type: 'INC' })} style={{ color: 'red', padding: '1em' }}>{`${name}: ${state.count}`}</div>
  );
}

const AParent = ({ children }) => <div style={{ backgroundColor: 'black'}}>{children}</div>

const AnotherParent = ({ children }) => <div style={{ backgroundColor: 'blue'}}>{children}</div>

const AThirdParent = ({ children }) => <div style={{ backgroundColor: 'yellow'}}>{children}</div>

const App = () => {
  const loggerMiddleware = useMemo(() => (dispatch, action, state) => {
    console.group(action.type);
    dispatch(action);
    console.log('State', state);
    console.log('Action', action);
    console.groupEnd();
  });
  return (
    <div className="App">
      <Provider middlewares={[loggerMiddleware]}>
        <Counter name="Primo" />
        <AnotherParent>
          <AThirdParent>
            <Counter name="Secondo" />
          </AThirdParent>
          <Counter name="Terzo" />
        </AnotherParent>
        <AParent>
          <Counter name="Quarto" />
        </AParent>
      </Provider>
    </div>
  );
}

export default App;
