import React, { useEffect, useState, useContext } from "react";
import {SocketContext} from "../../../SocketProvider/SocketProvider";

function RequestPlayAgain(props) {
  const [playerRequest, setPlayerRequest] = useState(props.playerRequest);
  const [newRoom, setNewRoom] = useState(props.newRoom);

  const socket = useContext(SocketContext)

  const handleYes = () => {
    socket.emit("requestPlayAgainSuccess", { newRoom });
    props.onClose();
  };

  const handleNo = () => {
    socket.emit("requestPlayAgainFailed", { newRoom, playerRequest });
    props.onClose();
  };

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <h2 className="actionGame">Message from Rival</h2>
          <div>
            <div className="msgRequest">{playerRequest} require u play with them again!!</div>
            <button className="btnAction" onClick={handleYes}>Yes</button>
            <button className="btnNo" onClick={handleNo}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPlayAgain;
