import React from 'react';

// Simulate an async operation
const simulateAsyncOperation = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export default function UseTransitionExample() {
  const [isPending, startTransition] = React.useTransition();
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('');

  const handleIncrement = async () => {
    startTransition(async () => {
      await simulateAsyncOperation();
      setCount(prev => prev + 1);
    });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>useTransition - Loading States</h2>
      
      <div className="transition-section">
        <p>Count: {count}</p>
        <button onClick={handleIncrement} disabled={isPending}>
          {isPending ? 'Loading...' : 'Increment'}
        </button>
      </div>

      <div className="text-input-section">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type something!"
        />
        <p>You typed: {text}</p>
      </div>

      <div className="status-section">
        <p>Transition Status: {isPending ? 'Pending' : 'Complete'}</p>
      </div>

      <div className="code-example">
        <pre>
          <code>
            {`// Import useTransition
const [isPending, startTransition] = React.useTransition();

// Start a transition
startTransition(async () => {
  await someAsyncOperation();
  setState(newState);
});

// Use isPending in JSX
<button disabled={isPending}>
  {isPending ? 'Loading...' : 'Click me'}
</button>`}
          </code>
        </pre>
      </div>
    </div>
  );
}