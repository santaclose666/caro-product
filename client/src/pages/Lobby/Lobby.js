import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/apiRequest";
import "./Lobby.css";
import GameName from "../../components/GameName/GameName";
import CreateRoom from "../../components/Modal/CreateRoom/CreateRoom";
import JoinRoom from "../../components/Modal/JoinRoom/JoinRoom";
import { SocketContext } from "../../SocketProvider/SocketProvider";
import History from "../../components/Modal/History/History";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { HiInformationCircle } from "react-icons/hi";
import { BiLogOut, BiLogInCircle } from "react-icons/bi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

const Lobby = () => {
  const [toggleCreateRoom, setToggleCreateRoom] = useState(false);
  const [toggleJoinRoom, setToggleJoinRoom] = useState(false);
  const [togglePickGame, setTogglePickGame] = useState(false);
  const [togglePickRoom, setTogglePickRoom] = useState(true);
  const [toggleDisplayHistory, setToggleDisplayHistory] = useState(false);
  const [matchRandom, setMatchRandom] = useState("Match Random");

  const socket = useContext(SocketContext);

  const [typeGame, setTypeGame] = useState("3x3");
  let type = null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const [userName, setUserName] = useState(user?.username);

  const handleMatch = () => {
    if (matchRandom === "Match Random") {
      socket.emit("startMatching", { userName, typeGame });

      setMatchRandom("Looking for another player!");
    } else {
      socket.emit("cancleMatching", { typeGame });

      setMatchRandom("Match Random");
    }
  };

  const handleCreateRoom = () => {
    setToggleCreateRoom(true);
  };
  const handlePopupCreate = () => {
    setToggleCreateRoom(false);
  };

  const handleJoinRoom = () => {
    setToggleJoinRoom(true);
  };
  const handlePopupJoin = () => {
    setToggleJoinRoom(false);
  };

  const handle3x3 = () => {
    type = "3x3";
    setTypeGame(type);
    setTogglePickGame(false);
    setTogglePickRoom(true);
  };

  const handle5x5 = () => {
    type = "5x5";
    setTypeGame(type);
    setTogglePickGame(false);
    setTogglePickRoom(true);
  };

  const handleChangeTypeGame = () => {
    setTogglePickGame(true);
    setTogglePickRoom(false);
  };

  const handleDisplayHistory = () => {
    setToggleDisplayHistory(true);
  };
  const handlePopupDisplayHistory = () => {
    setToggleDisplayHistory(false);
  };

  const handleLogout = () => {
    logoutUser(dispatch, navigate);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    socket.on(`matchSuccess3x3`, (data) => {
      const typeGame = data.typeGame;
      const newRoom = data.randomRoom;

      navigate(`/game/${typeGame}/${newRoom}`);
    });

    socket.on(`matchSuccess5x5`, (data) => {
      const typeGame = data.typeGame;
      const newRoom = data.randomRoom;

      navigate(`/game/${typeGame}/${newRoom}`);
    });

    return () => {
      socket.off("matchSuccess3x3");
      socket.off("matchSuccess5x5");
    };
  }, [socket]);

  return (
    <div className="wrap">
      <GameName namePage="Lobby" />

      {togglePickGame && (
        <>
          <h1>Pick a type game!</h1>
          <div className="typeGame">
            <button onClick={handle3x3} className="btnTypeGame caro3">
              3x3
            </button>
            <button onClick={handle5x5} className="btnTypeGame caro5">
              5x5
            </button>
          </div>
        </>
      )}

      {togglePickRoom && (
        <>
          <div className="containerWelcome">
            Welcome <span className="username">{user?.username}</span>
          </div>

          <div className="containerTextTypeGame">
            <span className="textTypeGame">Type Game: </span>
            <span className="type">{typeGame}</span>
            <button
              className="btnChangeTypeGame"
              onClick={handleChangeTypeGame}
            >
              <FaExchangeAlt />
            </button>
          </div>

          <button className="btnLobby blueBtn" onClick={handleMatch}>
            {matchRandom} <GiPerspectiveDiceSixFacesRandom />
          </button>

          <div>
            <button className="btnLobby redBtn" onClick={handleCreateRoom}>
              Create Room <IoIosCreate />
            </button>
            {toggleCreateRoom && (
              <CreateRoom onClose={handlePopupCreate} typeGame={typeGame} />
            )}
          </div>

          <div>
            <button className="btnLobby blueBtn" onClick={handleJoinRoom}>
              Join Room <BiLogInCircle />
            </button>
            {toggleJoinRoom && (
              <JoinRoom onClose={handlePopupJoin} typeGame={typeGame} />
            )}
          </div>

          <div>
            <button className="btnLobby redBtn" onClick={handleDisplayHistory}>
              Information <HiInformationCircle />
            </button>
            {toggleDisplayHistory && (
              <History handleClose={handlePopupDisplayHistory} />
            )}
          </div>

          <button className="btnLobby blueBtn" onClick={handleLogout}>
            Logout <BiLogOut />
          </button>
        </>
      )}
    </div>
  );
};

export default Lobby;
