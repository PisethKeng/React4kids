import React from 'react';

export default function UseStateExample() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('');

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>useState - State Management</h2>
      
      <div className="counter-section">
        <p>Count: {count}</p>
        <div className="button-group">
          <button onClick={() => setCount(prev => prev - 1)}>-</button>
          <button onClick={() => setCount(prev => prev + 1)}>+</button>
        </div>
      </div>

      <div className="text-input-section">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something!"
        />
        <p>You typed: {text}</p>
      </div>

      <div className="code-example">
        <pre>
          <code>
            {`const [count, setCount] = React.useState(0);
const [text, setText] = React.useState('');

// Counter
<button onClick={() => setCount(prev => prev - 1)}>-</button>
<button onClick={() => setCount(prev => prev + 1)}>+</button>

// Text Input
<input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>`}
          </code>
        </pre>
      </div>
    </div>
  );
}