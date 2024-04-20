import React from 'react';

const DeleteBtn = ({ onClick}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        backgroundColor: "#d97979",
        color: "white",
        borderRadius: "50%",
      }}
      onClick={onClick}
    >
      X
    </div>
  );
};

export default DeleteBtn;
