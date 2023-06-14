import React, { useState, useEffect, useContext } from "react";
import GameName from "../../GameName/GameName";
import Result from "../../Result/Result";
import Reset from "../../Reset/Reset";
import { useSelector } from "react-redux";
import "./Board3x3.css";
import Box from "../../Box/Box3x3/Box";
import RequestPlayAgain from "../../Modal/RequestPlayAgain/RequestPlayAgain";
import Alert from "../../Modal/Alert/Alert";
import RequestLeaveRoom from "../../Modal/RequestLeave/RequestLeave";
import { SocketContext } from "../../../SocketProvider/SocketProvider";
import ChatBox from "../../ChatBox/ChatBox";
import DisplayInfo from "../../DisplayInfo/DisplayInfo";

const Board3x3 = ({ roomname, type }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const socket = useContext(SocketContext);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [c, setC] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [togglePlayAgain, setTogglePlayAgain] = useState(false);
  const [toggleAlert, setToggeAlert] = useState(false);
  const [playerRequest, setPlayerRequest] = useState("");
  const [msg, setMsg] = useState("");

  const userName = user.username;
  const [winnerName, setWinnerName] = useState("");

  const newRoom = roomname;
  const typeGame = type;

  useEffect(() => {
    socket.on("notificateOut", () => {
      setBoard(Array(9).fill(null));
      setWinnerName("");
      setA("");
      setB("");
      setC("");
    });

    socket.on("nextTurn3x3", (data) => {
      setBoard(data.board);
      setPlayer(data.player);
      if (data.player !== data.board[data.index]) {
        setClickCount(0);
      }
    });

    socket.on("winner", (data) => {
      if (data.winner !== "Hòa!") {
        setWinnerName(data.winnerName);
      } else {
        setWinnerName("Hòa!");
      }
      setWinner(data.winner);
      setA(data.a);
      setB(data.b);
      setC(data.c);
      setGameOver(true);
    });

    socket.on("responseReset", (data) => {
      setPlayerRequest(data.userName);
      setTogglePlayAgain(true);
    });

    socket.on("responsePlayAgainSuccess", () => {
      setGameOver(false);
      setBoard(Array(9).fill(null));
      setWinner(null);
      setWinnerName("");
      setClickCount(0);
      setPlayer("X");
      setA("");
      setB("");
      setC("");
    });

    socket.on("responsePlayAgainFailed", () => {
      setMsg(`competitor did not accept your request`);
      setToggeAlert(true);
    });

    return () =>{
      socket.off("nextTurn3x3")
      socket.off("winner")
      socket.off("responseReset")
      socket.off("responsePlayAgainFailed")
      socket.off("responsePlayAgainSuccess")
    }
  }, [socket]);

  const handleBox = (index) => {
    if (board[index] && gameOver) {
      return;
    }

    if (clickCount === 0) {
      const updateBoard = board.map((value, idx) => {
        if (idx === index) {
          return player;
        }
        return value;
      });

      setBoard(updateBoard);

      setClickCount(clickCount + 1);

      socket.emit("turn", {
        newRoom,
        userName,
        updateBoard,
        player,
        index,
        typeGame,
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

  const Board = ({ board, onClick, a, b, c }) => {
    return (
      <div className="board">
        {board.map((value, index) => {
          if (index === a || index === b || index === c) {
            return (
              <Box
                key={index}
                value={value}
                onClick={() => !value && onClick(index)}
                boxHL={true}
              />
            );
          } else {
            return (
              <Box
                key={index}
                value={value}
                onClick={() => !value && onClick(index)}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="game">
      <RequestLeaveRoom
        newRoom={newRoom}
        userName={userName}
        typeGame={typeGame}
      />
      <GameName namePage="Game" />

      <div>
        <DisplayInfo newRoom={roomname} />
      </div>

      <div className="boardChatBoxContainer">
        <Board board={board} onClick={handleBox} a={a} b={b} c={c} />

        <ChatBox newRoom={newRoom} />
      </div>
      <Result winner={winner} winnerName={winnerName} />
      <Reset reset={handleReset} />
      {togglePlayAgain && (
        <RequestPlayAgain
          onClose={handlePopupPlay}
          playerRequest={playerRequest}
          newRoom={newRoom}
          typeGame={typeGame}
        />
      )}
      {toggleAlert && <Alert onClose={handlePopupAlert} msg={msg} />}
    </div>
  );
};

export default Board3x3;
