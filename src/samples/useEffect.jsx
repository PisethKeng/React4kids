import React, { useState, useEffect } from 'react';
const CounterComponent = () => {
  // Initialize state for counter
  const [count, setCount] = useState(0);
  // Initialize state for message
  const [message, setMessage] = useState('');

  // useEffect will run whenever count changes
  useEffect(() => {
    if (count === 0) {
      setMessage('Start counting!');
    } else if (count > 0) {
      setMessage(`Count is now ${count}`);
    }
    
    // Optional cleanup function
    return () => {
      console.log('Component cleanup');
    };
  }, [count]); // Dependency array with count

  // Function to handle increment
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Function to handle reset
  const handleReset = () => {
    setCount(0);
  };

  // Hook to click for name state
  
  const [name, setName] = useState('John');

  const handleClick = () => {
    setName(prevName => prevName === 'John' ? 'Johnathan' : 'John');
  }


  // useEffect to log name changes

  return (
    <>
    {/* Slides */}
    {/*  Main content */}
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: {count}</h2>
      <p>{message}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleClick}>Click me</button>
      <p>Name: {name}</p>
    </div>
    </>
  );
};

export default CounterComponent;
