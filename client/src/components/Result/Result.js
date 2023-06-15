import React from "react";

import "./Result.css";

const Result = ({ winner, winnerName }) => {
  const styleChild = winner === "Hòa!" ? "tie" : "";
  const style = winner === "X" ? "result winnerX" : "result winnerO";
  return (
    <div className={style}>
      Winner: {" "} <span className={styleChild}>{winnerName === undefined ? winner : winnerName}</span>
    </div>
  );
};

export default Result;
