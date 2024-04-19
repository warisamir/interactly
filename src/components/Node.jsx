import React from "react";

const Node = ({ id, data, position, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        border: "1px solid red",
        padding: "8px",
        background: "#fff",
        borderRadius: "4px",
        cursor: "pointer",
  
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {data.label}
    </div>
  );
};

export default Node;
