import React from "react";
export default function LazyPanel() {
  return (
    <div className="demo-card">
      <h3>Panel loaded</h3>
      <p>
        This component comes from a separate JavaScript chunk, requested when it
        is first rendered.
      </p>
    </div>
  );
}
