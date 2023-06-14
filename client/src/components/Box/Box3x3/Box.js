import React from "react";
import "./Box.css";

const Box = ({ value, onClick, boxHL }) => {
  let style;

  if(boxHL === true){
    style = value === "X" ? "box x hightlight3x3" : "box o hightlight3x3";
  }
  else{
    style = value === "X" ? "box x" : "box o";
  }

  return (
    <button className={style} onClick={onClick}>
      {value}
    </button>
  );
};

export default Box;
