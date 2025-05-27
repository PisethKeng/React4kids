export default function ReactRouting() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          flexDirection: 'column', // stack h1 and pre vertically
        }}
      >
        <h1>React Routing</h1>
        <pre
          style={{
            textAlign: 'left',
            background: '#f4f4f4',
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            maxWidth: '90%',
          }}
        >
          <code>
            {`
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  
  // Example pages
  import HomePage from './pages/HomePage';
  import AboutPage from './pages/AboutPage';
  import NotFoundPage from './pages/NotFoundPage';
  
  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;
            `}
          </code>
        </pre>
      </div>
    );
  }
  