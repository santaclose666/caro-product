import React from "react";

import './GameName.css'

function GameName({namePage}) {
  return (
    <div className="gameName">
      <span className="red">Tic</span>
      <span className="purple">Tac</span>
      <span className="red">Toe</span>
      <span className="purple">{namePage}</span>
    </div>
  );
}

export default GameName;
