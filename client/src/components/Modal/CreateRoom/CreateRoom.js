import React, { useContext, useEffect, useState } from "react";
import "./CreateRoom.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import Alert from "../Alert/Alert";
import { SocketContext } from "../../../SocketProvider/SocketProvider";

const CreateRoom = (props) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const socket = useContext(SocketContext);

  const [createRoom, setCreateRoom] = useState("");
  const [toggleAlert, setToggeAlert] = useState(false);
  const [userName, setUserName] = useState(user.username);
  const [msg, setMsg] = useState("");
  const typeGame = props.typeGame;
  let newRoom;

  const navigate = useNavigate();

  const handleClose = () => {
    props.onClose();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (createRoom.trim() !== "") {
      newRoom = typeGame + createRoom;
      console.log(newRoom);
      socket.emit("createRoom", { newRoom, typeGame, userName });
    } else {
      alert("Enter room name");
    }
  };

  const handlePopupAlert = () => {
    setToggeAlert(false);
  };

  useEffect(() => {
    socket.on("acceptCreate", () => {
      console.log(newRoom);
      navigate(`/game/${typeGame}/${newRoom}`);
    });

    socket.on("refuseCreate", () => {
      setMsg("This room is exits already. Create another room!");
      setToggeAlert(true);
    });

    return () => {
      socket.off("acceptCreate");
      socket.off("refuseCreate");
    };
  });

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <div>
            <h2 className="actionGame">Create Room {typeGame}</h2>
            <input
              placeholder="Input here!"
              className="inputRoom"
              onChange={(e) => setCreateRoom(e.target.value)}
            />
            <button className="btnAction" onClick={handleCreate}>
              Create
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

export default CreateRoom;
