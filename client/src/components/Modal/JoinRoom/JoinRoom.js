import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import Alert from "../Alert/Alert";
import { SocketContext } from "../../../SocketProvider/SocketProvider";

const JoinRoom = (props) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const socket = useContext(SocketContext);

  const [joinRoom, setJoinRoom] = useState("");
  const userName = useState(user.username);
  const [msg, setMsg] = useState("");
  const [toggleAlert, setToggeAlert] = useState(false);
  let newRoom;

  const navigate = useNavigate();

  const handleClose = () => {
    props.onClose();
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinRoom.trim() !== "") {
      const typeGame = props.typeGame;
      newRoom = typeGame + joinRoom;

      socket.emit("joinRoom", { newRoom, userName, typeGame });
    } else {
      alert("Enter room name");
    }
  };

  const handlePopupAlert = () => {
    setToggeAlert(false);
  };

  useEffect(() => {
    socket.on("acceptJoin", (data) => {
      const typeGame = data.typeGame;
      console.log(newRoom);
      navigate(`/game/${typeGame}/${newRoom}`);
    });

    socket.on("refuseJoin", () => {
      setMsg("This room is full now. Looking for another room!");
      setToggeAlert(true);
    });

    socket.on("roomNotExits", () => {
      setMsg("This room not exits!");
      setToggeAlert(true);
    });

    return () => {
      socket.off("acceptJoin");
      socket.off("refuseJoin");
      socket.off("roomNotExits");
    };
  });

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <h2 className="actionGame">Join Room {props.typeGame}</h2>
          <div>
            <input
              placeholder="Input here!"
              className="inputRoom"
              onChange={(e) => setJoinRoom(e.target.value)}
            />
            <button className="btnAction" onClick={handleJoin}>
              Join
            </button>
          </div>
          <button onClick={handleClose} className="close-modal">
            <AiOutlineCloseCircle />
          </button>
          {toggleAlert && <Alert onClose={handlePopupAlert} msg={msg} />}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
