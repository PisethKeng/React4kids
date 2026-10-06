import React from 'react';
import '../styles/cyberpunk.css';

const CyberpunkBackground = () => {
  return (
    <>
      <div className="cyberpunk-bg">
        <div className="grid-overlay" />
        <div className="particles">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="particle" />
          ))}
        </div>
      </div>
      <div className="scanline" />
    </>
  );
};

export default CyberpunkBackground; 