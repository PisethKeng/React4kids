import React from 'react';

// Define action types
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const RESET = 'reset';

// Reducer function
const counterReducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    case RESET:
      return { count: 0 };
    default:
      return state;
  }
};

export default function UseReducerExample() {
  const [state, dispatch] = React.useReducer(counterReducer, { count: 0 });

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>useReducer - State Management</h2>
      
      <div className="counter-section">
        <p>Count: {state.count}</p>
        <div className="button-group">
          <button onClick={() => dispatch({ type: DECREMENT })}>-</button>
          <button onClick={() => dispatch({ type: INCREMENT })}>+</button>
          <button onClick={() => dispatch({ type: RESET })}>Reset</button>
        </div>
      </div>

      <div className="code-example">
        <pre>
          <code>
            {`// Reducer function
const counterReducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    case RESET:
      return { count: 0 };
    default:
      return state;
  }
};

// In component
const [state, dispatch] = React.useReducer(counterReducer, { count: 0 });

// Dispatch actions
<button onClick={() => dispatch({ type: INCREMENT })}>+</button>
<button onClick={() => dispatch({ type: DECREMENT })}>-</button>
<button onClick={() => dispatch({ type: RESET })}>Reset</button>`}
          </code>
        </pre>
      </div>
    </div>
  );
}