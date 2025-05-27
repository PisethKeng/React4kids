import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

const LayoutEffectExample = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect runs synchronously after DOM mutations
  // and before the browser repaints
  useLayoutEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [isDarkMode]); // Re-run when theme changes

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        ref={elementRef}
        style={{
          border: `2px solid ${colors.text}`,
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h2>Element Dimensions</h2>
        <p>Width: {Math.round(dimensions.width)}px</p>
        <p>Height: {Math.round(dimensions.height)}px</p>
      </div>

      <button
        onClick={toggleTheme}
        style={{
          padding: '10px 20px',
          backgroundColor: colors.text,
          color: colors.background,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default LayoutEffectExample; 