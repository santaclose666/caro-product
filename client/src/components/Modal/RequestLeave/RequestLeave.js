import React, { useState, useContext } from "react";
import "./RequestLeave.css";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../SocketProvider/SocketProvider";
import { IoMdArrowRoundBack } from "react-icons/io";

function RequestLeaveRoom(props) {
  const newRoom = props.newRoom;
  const userName = props.userName;
  const typeGame = props.typeGame;
  const [toggleLeave, setToggleLeave] = useState(false);

  const socket = useContext(SocketContext);

  const navigate = useNavigate();

  const handleOut = () => {
    setToggleLeave(true);
  };

  const handleYes = () => {
    socket.emit("out", { newRoom, userName, typeGame });

    navigate("/lobby");
    setToggleLeave(false);
  };

  const handleNo = () => {
    setToggleLeave(false);
  };

  return (
    <div>
      <div>
        <button className="escapeBtn" onClick={handleOut}>
          <IoMdArrowRoundBack />
        </button>
      </div>

      {toggleLeave && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="actionGame">Escape the room!</h2>
            <div>
              <div className="msgRequest">
                U will leave the room! Are u sure?
              </div>
              <button className="btnAction" onClick={handleYes}>
                Yes
              </button>
              <button className="btnNo" onClick={handleNo}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestLeaveRoom;
