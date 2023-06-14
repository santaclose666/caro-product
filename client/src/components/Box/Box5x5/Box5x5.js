import React from "react";
import "./Box5x5.css";

const Square = ({ value, onClick, boxHL }) => {
  let style
  
  if (boxHL === true) {
    style =
      value === "X"
        ? "square styleX hightLight5x5"
        : "square styleO hightLight5x5";
  } else {
    style = value === "X" ? "square styleX" : "square styleO";
  }

  return (
    <button className={style} onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;
