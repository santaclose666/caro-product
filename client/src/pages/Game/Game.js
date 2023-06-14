import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";
import Board3x3 from "../../components/Board/Board3x3/Board3x3";
import Board5x5 from "../../components/Board/Board5x5/Board5x5";
import { SocketContext } from "../../SocketProvider/SocketProvider";

function Game() {
  const { type } = useParams();
  const { roomname } = useParams();
  console.log(type, roomname);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("joinReady", { roomname });
  }, [socket, roomname]);

  return (
    <div>
      {type === "3x3" ? (
        <Board3x3 roomname={roomname} type={type} />
      ) : (
        <Board5x5 roomname={roomname} type={type} />
      )}
    </div>
  );
}

export default Game;
