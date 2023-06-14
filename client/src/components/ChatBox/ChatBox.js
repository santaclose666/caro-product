import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../SocketProvider/SocketProvider";
import { useSelector } from "react-redux";
import { BsFillSendFill } from "react-icons/bs";
import "./ChatBox.css";

const ChatBox = ({ newRoom }) => {
  const userName = useSelector(
    (state) => state.auth.login?.currentUser.username
  );
  const socket = useContext(SocketContext);
  const inputMessage = useRef();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [otherPlayer, setOtherPlayer] = useState("");
  const avatarImg = `https://caro-server.onrender.com/avatars/${
    otherPlayer === "" ? "default" : otherPlayer
  }.jpg`;
  const defaultImg = "https://caro-server.onrender.com/avatars/default.jpg";

  useEffect(() => {
    socket.on("notificateJoin", (data) => {
      data.host === userName
        ? setOtherPlayer(data.guest)
        : setOtherPlayer(data.host);

      const newMessage = {
        text: `${data.host} just joined in room!`,
        isSystem: true,
      };

      if (data.guest === undefined) {
        setMessages([...messages, newMessage]);
      } else {
        const newMessage2 = {
          text: `${data.guest} just joined in room!`,
          isSystem: true,
        };

        setMessages([...messages, newMessage, newMessage2]);
      }

      scrollToBottom();
    });

    socket.on("notificateOut", (data) => {
      const newMessage = {
        text: `${data.playerOut} just left the room!`,
        isSystem: true,
      };
      setOtherPlayer("");
      setMessages([...messages, newMessage]);
      scrollToBottom();
    });

    socket.on("receiveMessage", (data) => {
      const newMessage = {
        text: data.message,
        isMe: false,
      };

      setMessages([...messages, newMessage]);
      scrollToBottom();
    });

    return () => {
      socket.off("notificateJoin");
      socket.off("receiveMessage");
    };
  }, [messages, socket, userName]);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      if (inputVal.trim() !== "") {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (inputVal.trim() !== "") {
      const newMessage = {
        text: inputVal,
        isMe: true,
      };

      socket.emit("sendMessage", { inputVal, newRoom });
      setMessages([...messages, newMessage]);
      inputMessage.current.value = "";
      scrollToBottom();
    } else {
      alert("Type a messages!");
    }
  };

  const scrollToBottom = () => {
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  return (
    <div className="containerChatBox">
      <div className="containerInforRival">
        <img
          alt="avatar"
          src={avatarImg}
          onError={(e) => {
            e.target.src = defaultImg;
          }}
        />
        <div className="rivalName">{otherPlayer}</div>
      </div>
      <div className="chatContainer">
        <div className="messageContainer">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.isSystem ? `system` : message.isMe ? `me` : `other`
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="containerBtnChatBox">
        <input
          className="inputChatBox"
          type="text"
          ref={inputMessage}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyPress={handleEnterPress}
          placeholder="Type a message..."
        />
        <button className="btnChatBox" onClick={handleSend}>
          <BsFillSendFill />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
