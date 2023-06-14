import React, { useState, useEffect, useContext } from "react";
import "./Board5x5.css";
import Square from "../../Box/Box5x5/Box5x5";
import Result from "../../Result/Result";
import GameName from "../../GameName/GameName";
import Reset from "../../Reset/Reset";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../SocketProvider/SocketProvider";
import RequestLeaveRoom from "../../Modal/RequestLeave/RequestLeave";
import RequestPlayAgain from "../../Modal/RequestPlayAgain/RequestPlayAgain";
import Alert from "../../Modal/Alert/Alert";
import ChatBox from "../../ChatBox/ChatBox";
import DisplayInfo from "../../DisplayInfo/DisplayInfo";

const Board5x5 = ({ roomname, type }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const socket = useContext(SocketContext);

  const rows = 20;
  const cols = 20;
  const [winner, setWinner] = useState(null);
  const [winnerName, setWinnerName] = useState("");
  const [player, setPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [a, setA] = useState([]);
  const [b, setB] = useState([]);
  const [c, setC] = useState([]);
  const [d, setD] = useState([]);
  const [e, setE] = useState([]);
  const [board, setBoard] = useState(Array(rows).fill(Array(cols).fill(null)));

  const [togglePlayAgain, setTogglePlayAgain] = useState(false);
  const [toggleAlert, setToggeAlert] = useState(false);
  const [playerRequest, setPlayerRequest] = useState("");
  const [msg, setMsg] = useState("");

  const userName = user.username;
  const newRoom = roomname;
  const typeGame = type;

  useEffect(() => {
    socket.on("notificateOut", () => {
      setBoard(Array(rows).fill(Array(cols).fill(null)));
      setWinnerName("");
      setA("");
      setB("");
      setC("");
      setD("");
      setE("");
    });

    socket.on("nextTurn5x5", (data) => {
      setBoard(data.board);
      setPlayer(data.player);
      if (data.player !== data.board[data.row][data.col]) {
        setClickCount(0);
      }
    });

    socket.on("winner", (data) => {
      setGameOver(true);
      if (data.winner !== "Hòa!") {
        setWinnerName(data.winnerName);
        setWinner(data.winner);
        setA(data.a);
        setB(data.b);
        setC(data.c);
        setD(data.d);
        setE(data.e);
      } else {
        setWinner(data.winner);
      }
    });

    socket.on("responseReset", (data) => {
      setPlayerRequest(data.userName);
      setTogglePlayAgain(true);
    });

    socket.on("responsePlayAgainSuccess", () => {
      setGameOver(false);
      setBoard(Array(rows).fill(Array(cols).fill(null)));
      setWinner(null);
      setWinnerName("");
      setClickCount(0);
      setPlayer("X");
      setA([]);
      setB([]);
      setC([]);
      setD([]);
      setE([]);
    });

    socket.on("responsePlayAgainFailed", () => {
      setMsg(`competitor did not accept your request`);
      setToggeAlert(true);
    });

    return () =>{
      socket.off("nextTurn5x5")
      socket.off("winner")
      socket.off("responseReset")
      socket.off("responsePlayAgainFailed")
      socket.off("responsePlayAgainSuccess")
    }
  }, [socket]);

  const handleClick = (i, j) => {
    if (board[i][j] || gameOver === true) {
      return;
    }

    if (clickCount === 0) {
      let updateBoard = board.map((r) => [...r]);

      updateBoard[i][j] = player;

      setBoard(updateBoard);

      setClickCount(clickCount + 1);

      socket.emit("turn", {
        newRoom,
        userName,
        updateBoard,
        player,
        typeGame,
        i,
        j,
      });
    } else {
      return;
    }
  };

  const handlePopupPlay = () => {
    setTogglePlayAgain(false);
  };

  const handleReset = () => {
    socket.emit("reset", {
      newRoom,
      userName,
    });
  };

  const handlePopupAlert = () => {
    setToggeAlert(false);
  };

  const renderSquare = (i, j) => {
    if (
      (i === a[0] && j === a[1]) ||
      (i === b[0] && j === b[1]) ||
      (i === c[0] && j === c[1]) ||
      (i === d[0] && j === d[1]) ||
      (i === e[0] && j === e[1])
    ) {
      return (
        <Square
          key={j}
          value={board[i][j]}
          onClick={() => handleClick(i, j)}
          boxHL={true}
        />
      );
    } else {
      return (
        <Square key={j} value={board[i][j]} onClick={() => handleClick(i, j)} />
      );
    }
  };

  const renderBoard = () => {
    return board.map((row, i) => (
      <div key={i} className="board-row">
        {row.map((col, j) => renderSquare(i, j))}
      </div>
    ));
  };

  return (
    <div className="game">
      <RequestLeaveRoom newRoom={newRoom} userName={userName} />
      <GameName namePage="Game" />
      <div>
        <DisplayInfo newRoom={roomname} />
      </div>
      <div className="boardChatBoxContainer">
        <div className="containerBoard">{renderBoard()}</div>

        <div className="containerCBRR">
          <ChatBox newRoom={newRoom} />
          <Result winner={winner} winnerName={winnerName} />
          <Reset reset={handleReset} />
        </div>
      </div>

      {togglePlayAgain && (
        <RequestPlayAgain
          onClose={handlePopupPlay}
          playerRequest={playerRequest}
          newRoom={newRoom}
        />
      )}
      {toggleAlert && <Alert onClose={handlePopupAlert} msg={msg} />}
    </div>
  );
};

export default Board5x5;
