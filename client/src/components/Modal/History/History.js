import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./History.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import UploadImg from "../../UploadImg/UploadImg";

const History = ({ handleClose }) => {
  const [history, setHistory] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [msg, setMsg] = useState(null);
  const user = useSelector((state) => state.auth.login?.currentUser);

  const userName = user.username;
  const avatarImg = `https://caro-server.onrender.com/avatars/${userName}.jpg`;
  const defaultImg = "https://caro-server.onrender.com/avatars/default.jpg";

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await axios.get(
          `https://caro-server.onrender.com/history/${userName}/${currPage}`,
          {
            withCredentials: true,
          }
        );

        console.log(res.data);
        if (res.data !== "Can't find any your history game!") {
          setHistory(res.data.history);
          setTotalPage(res.data.totalPage);
        } else {
          setMsg(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getHistory();
  }, [currPage, userName]);

  const handleChangePage = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="modalContentHistory">
      <h1 className="historyTitle">Information!</h1>
      <div class="avatar">
        <img
          src={avatarImg}
          onError={(e) => {
            e.target.src = defaultImg;
          }}
          alt="Avatar"
        />
      </div>
      <UploadImg />

      <div className="containerInforHistory">
        <div className="userNameHistory">User Name: {userName}</div>
        <div className="mailHistory">Mail: {user.email}</div>
      </div>
      {msg === null ? (
        history?.map((history, index) => (
          <div className="containerHistory" key={index}>
            <div
              className={`itemHistory leftItem ${
                history.winner === "X" ? "xHistory" : "oHistory"
              }`}
            >
              <div>{userName}</div>
              <div>
                {history.winner === "Hòa!"
                  ? history.player1 === userName
                    ? "X"
                    : "O"
                  : history.player1 === userName
                  ? history.winner
                  : history.winner === "X"
                  ? "O"
                  : "X"}
              </div>
            </div>
            <div className="itemHistory middleItem">
              <div
                className={`stateHistory ${
                  history.winner === "Hòa!"
                    ? "tieHistory"
                    : history.player1 === userName
                    ? "winnerHistory"
                    : "loserHistory"
                }`}
              >
                {history.winner === "Hòa!"
                  ? history.winner
                  : userName === history.player1
                  ? "Win"
                  : "Lose"}
              </div>
              <div className="typeGameHistory">{history.typeGame}</div>
            </div>
            <div
              className={`itemHistory rightItem ${
                history.winner === "X" ? "oHistory" : "xHistory"
              }`}
            >
              <div>
                {userName === history.player1
                  ? history.player2
                  : history.player1}
              </div>
              {history.winner === "Hòa!"
                ? history.player1 === userName
                  ? "O"
                  : "X"
                : history.player1 === userName
                ? history.winner === "X"
                  ? "O"
                  : "X"
                : history.winner}
            </div>
          </div>
        ))
      ) : (
        <div>{msg}</div>
      )}
      <div className="containerBtnHistory">
        {Array.from({ length: totalPage }, (_, index) => index + 1).map(
          (page) => (
            <button
              className="btnHistory"
              key={page}
              onClick={() => handleChangePage(page)}
              disabled={page === currPage}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button onClick={handleClose} className="close-modal">
        <AiOutlineCloseCircle />
      </button>
    </div>
  );
};

export default History;
