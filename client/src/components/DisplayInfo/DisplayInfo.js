import React, { useState, useEffect, useContext } from "react";
import "./DisplayInfo.css";
import { SocketContext } from "../../SocketProvider/SocketProvider";
import vs from "../../Images/vs1.png";

const DisplayInfo = ({ newRoom }) => {
  const [host, setHost] = useState("");
  const [guest, setGuest] = useState("Waiting for luv");
  const room = newRoom;
  const defaultImg = "https://caro-server.onrender.com/avatars/default.jpg";

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("sendHostName", (data) => {
      setHost(data.host);
    });

    socket.on("notificateJoin", (data) => {
      console.log(data);
      setHost(data.host);
      setGuest(data.guest);
    });

    socket.on("notificateOut", (data) => {
      setHost(data.playerIn);
      setGuest("Waiting for luv");
    });
  }, [socket]);

  return (
    <div>
      <div className="containerDisplayInfo">
        <div className="containerHostDisplayInfo">
          <img
            alt="avatar"
            src={`https://caro-server.onrender.com/avatars/${host}.jpg`}
            onError={(e) => (e.target.src = defaultImg)}
          />
          <span className="hostNameDisplayInfo">{host}</span>
        </div>
        <div className="containerImgDisplayinfo">
          <img alt="icon" src={vs} />
          <div>Room: {room}</div>
        </div>
        <div className="containerGuestDisplayInfo">
          <span className="guestNameDisplayInfo">{guest}</span>
          <img
            alt="avatar"
            src={`https://caro-server.onrender.com/avatars/${
              guest === "Waiting for luv" ? "default" : guest
            }.jpg`}
            onError={(e) => (e.target.src = defaultImg)}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayInfo;
