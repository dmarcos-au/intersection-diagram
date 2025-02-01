import React from "react";

const Toolbar: React.FC<{ exportDiagram: () => void }> = ({ exportDiagram }) => {
  return (
    <div style={{ padding: "10px", background: "#333", color: "#fff", display: "flex", justifyContent: "space-between" }}>
      <h3>Intersection Stick Diagram</h3>
      <button onClick={exportDiagram} style={{ padding: "5px 10px", cursor: "pointer" }}>
        Export Diagram
      </button>
    </div>
  );
};

export default Toolbar;
