const { Server } = require("socket.io");
const History = require("./models/history");

const io = (server) => {
  const socketServer = new Server(server, {
    cors: {
      origin:
        "https://648958296ed59200083b1f53--startling-lily-2ee1c2.netlify.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  let increase = 0;
  let count = 0;

  let tempRooms3x3 = [];
  let tempRooms5x5 = [];

  let rooms = new Map();

  //check 3x3
  const checkWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const saveHistory = async (winnerName, loserName, typeGame, winner) => {
    console.log(winnerName, loserName);
    const newHistory = new History({
      player1: winnerName,
      player2: loserName,
      typeGame: typeGame,
      winner: winner,
    });

    try {
      await newHistory.save();
    } catch (err) {
      console.log(err);
    }
  };

  const checkWin3x3 = (board, socket, room, winnerName, loserName) => {
    const typeGame = "3x3";
    for (let i = 0; i < checkWin.length; i++) {
      const [a, b, c] = checkWin[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winner = board[a];
        socket.emit("winner", {
          winnerName,
          winner,
          a,
          b,
          c,
        });
        socket.to(room).emit("winner", {
          winnerName,
          winner,
          a,
          b,
          c,
        });

        return saveHistory(winnerName, loserName, typeGame, winner);
      }
    }

    if (!board.includes(null)) {
      winner = "Hòa!";
      socket.emit("winner", {
        winner,
      });
      socket.to(room).emit("winner", {
        winner,
      });

      return saveHistory(winnerName, loserName, typeGame, winner);
    }
  };

  //check 5x5
  const checkWin5x5 = (board, socket, room, winnerName, loserName) => {
    const rows = 20;
    const cols = 20;
    count++;

    const typeGame = "5x5";

    let a = [];
    let b = [];
    let c = [];
    let d = [];
    let e = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        //check rows
        if (
          board[i][j] !== null &&
          board[i][j] === board[i][j + 1] &&
          board[i][j] === board[i][j + 2] &&
          board[i][j] === board[i][j + 3] &&
          board[i][j] === board[i][j + 4]
        ) {
          a.push(i, j);
          b.push(i, j + 1);
          c.push(i, j + 2);
          d.push(i, j + 3);
          e.push(i, j + 4);

          winner = board[i][j];
          socket.emit("winner", { winner, winnerName, a, b, c, d, e });
          socket.to(room).emit("winner", { winner, winnerName, a, b, c, d, e });

          return saveHistory(winnerName, loserName, typeGame, winner);
        }

        //check cols
        if (
          board[i][j] !== null &&
          board[i][j] === board[i + 1][j] &&
          board[i][j] === board[i + 2][j] &&
          board[i][j] === board[i + 3][j] &&
          board[i][j] === board[i + 4][j]
        ) {
          a.push(i, j);
          b.push(i + 1, j);
          c.push(i + 2, j);
          d.push(i + 3, j);
          e.push(i + 4, j);

          winner = board[i][j];
          socket.emit("winner", { winner, winnerName, a, b, c, d, e });
          socket.to(room).emit("winner", { winner, winnerName, a, b, c, d, e });

          return saveHistory(winnerName, loserName, typeGame, winner);
        }

        //check main diagonal
        if (
          board[i][j] !== null &&
          board[i][j] === board[i + 1][j + 1] &&
          board[i][j] === board[i + 2][j + 2] &&
          board[i][j] === board[i + 3][j + 3] &&
          board[i][j] === board[i + 4][j + 4]
        ) {
          a.push(i, j);
          b.push(i + 1, j + 1);
          c.push(i + 2, j + 2);
          d.push(i + 3, j + 3);
          e.push(i + 4, j + 4);

          winner = board[i][j];
          socket.emit("winner", { winner, winnerName, a, b, c, d, e });
          socket.to(room).emit("winner", { winner, winnerName, a, b, c, d, e });

          return saveHistory(winnerName, loserName, typeGame, winner);
        }

        //check sub diagonal
        if (
          board[i][j] !== null &&
          board[i][j] === board[i + 1][j - 1] &&
          board[i][j] === board[i + 2][j - 2] &&
          board[i][j] === board[i + 3][j - 3] &&
          board[i][j] === board[i + 4][j - 4]
        ) {
          a.push(i, j);
          b.push(i + 1, j - 1);
          c.push(i + 2, j - 2);
          d.push(i + 3, j - 3);
          e.push(i + 4, j - 4);

          winner = board[i][j];
          socket.emit("winner", { winner, winnerName, a, b, c, d, e });
          socket.to(room).emit("winner", { winner, winnerName, a, b, c, d, e });

          return saveHistory(winnerName, loserName, typeGame, winner);
        }
      }
    }

    if (count === rows * cols) {
      winner = "Hòa!";
      socket.emit("winner", {
        winner,
      });
      socket.to(room).emit("winner", {
        winner,
      });
    }
  };

  socketServer.on("connection", (socket) => {
    socket.on("startMatching", (data) => {
      const typeGame = data.typeGame;

      typeGame === "3x3"
        ? tempRooms3x3.push(socket.id, data.userName)
        : tempRooms5x5.push(socket.id, data.userName);

      if (tempRooms3x3.length === 4) {
        const randomRoom = `random${typeGame}` + increase++;

        let host = tempRooms3x3[1];
        let guest = tempRooms3x3[3];

        socketServer
          .to(tempRooms3x3[0])
          .emit(`matchSuccess3x3`, { typeGame, randomRoom });
        socketServer
          .to(tempRooms3x3[2])
          .emit(`matchSuccess3x3`, { typeGame, randomRoom });

        tempRooms3x3.unshift(typeGame);
        rooms.set(randomRoom, tempRooms3x3);

        setTimeout(() => {
          socketServer.in(randomRoom).emit("notificateJoin", { host, guest });
          tempRooms3x3 = [];
        }, 1000);
      }

      if (tempRooms5x5.length === 4) {
        const randomRoom = `random${typeGame}` + increase++;

        let host = tempRooms5x5[1];
        let guest = tempRooms5x5[3];

        socketServer
          .to(tempRooms5x5[0])
          .emit(`matchSuccess5x5`, { typeGame, randomRoom });
        socketServer
          .to(tempRooms5x5[2])
          .emit(`matchSuccess5x5`, { typeGame, randomRoom });

        tempRooms5x5.unshift(typeGame);
        rooms.set(randomRoom, tempRooms5x5);

        setTimeout(() => {
          socketServer.in(randomRoom).emit("notificateJoin", { host, guest });
          tempRooms5x5 = [];
        }, 1000);
      }
    });

    socket.on("cancleMatching", (data) => {
      const typeGame = data.typeGame;

      if (typeGame === "3x3") {
        const index = tempRooms3x3.indexOf(socket.id);
        tempRooms3x3.splice(index, 2);
      } else {
        const index = tempRooms5x5.indexOf(socket.id);
        tempRooms5x5.splice(index, 2);
      }
    });

    socket.on("createRoom", (data) => {
      const room = data.newRoom;
      const host = data.userName;
      if (!rooms.has(room)) {
        socket.emit("acceptCreate");
        rooms.set(room, [data.typeGame, socket.id, data.userName]);

        setTimeout(() => {
          socket.emit("sendHostName", { host });
        }, 1000);
      } else {
        socket.emit("refuseCreate");
      }
    });

    socket.on("joinRoom", (data) => {
      const room = data.newRoom;

      if (!rooms.has(room)) {
        socket.emit("roomNotExits");
      }

      const client = rooms.get(room);
      const typeGame = data.typeGame;
      if (rooms.has(room) && client.length === 3) {
        client.push(socket.id, data.userName);
        rooms.set(room, client);

        socket.emit("acceptJoin", { typeGame });

        let host = client[2];
        let guest = client[4];
        setTimeout(() => {
          socketServer.in(room).emit("notificateJoin", { host, guest });
        }, 1000);
      } else if (rooms.has(room) && client.length === 5) {
        socket.emit("refuseJoin");
      }
    });

    socket.on("joinReady", (data) => {
      const room = data.roomname;
      socket.join(room);
    });

    socket.on("out", (data) => {
      const room = data.newRoom;
      let playerIn = null;
      let playerOut = null;

      socket.leave(room);

      if (rooms.has(room)) {
        let client = rooms.get(room);
        if (client.length === 5) {
          if (socket.id === client[1]) {
            playerIn = client[4];
            playerOut = client[2];
            client.splice(1, 2);
          } else {
            playerIn = client[2];
            playerOut = client[4];
            client.splice(3, 2);
          }

          rooms.set(room, client);
          socketServer.in(room).emit("notificateOut", { playerIn, playerOut });
        } else {
          rooms.delete(room);
        }
      }
    });

    socket.on("turn", (data) => {
      const typeGame = data.typeGame;
      const room = data.newRoom;
      let board = data.updateBoard;
      let player = data.player === "X" ? "O" : "X";

      //caro 3x3
      let index = data?.index;

      //caro 5x5
      let row = data?.i;
      let col = data?.j;

      let winnerName = data.userName;
      let loserName = null;

      const client = rooms.get(room);
      winnerName === client[2]
        ? (loserName = client[4])
        : (loserName = client[2]);

      socket.to(room).emit(`nextTurn${typeGame}`, {
        board,
        player,
        index,
        row,
        col,
      });

      typeGame === "3x3"
        ? checkWin3x3(board, socket, room, winnerName, loserName)
        : checkWin5x5(board, socket, room, winnerName, loserName);
    });

    socket.on("reset", (data) => {
      socket.to(data.newRoom).emit("responseReset", data);
    });

    socket.on("requestPlayAgainSuccess", (data) => {
      socket.emit("responsePlayAgainSuccess");
      socket.to(data.newRoom).emit("responsePlayAgainSuccess");
    });

    socket.on("requestPlayAgainFailed", (data) => {
      const room = data.newRoom;
      let anotherPlayer;
      let client = rooms.get(room);
      data.playerRequest === client[2]
        ? (anotherPlayer = client[4])
        : (anotherPlayer = client[2]);
      socket
        .to(data.newRoom)
        .emit("responsePlayAgainFailed", { anotherPlayer });
    });

    socket.on("sendMessage", (data) => {
      const room = data.newRoom;
      message = data.inputVal;

      socket.to(room).emit("receiveMessage", { message });
    });

    socket.on("disconnect", () => {
      for (let [key, val] of rooms.entries()) {
        if (val.includes(socket.id)) {
          if (val.length === 5) {
            if (socket.id === val[1]) {
              let playerIn = val[4];
              let playerOut = val[2];

              val.splice(1, 2);
              rooms.set(key, val);

              socketServer
                .in(key)
                .emit("notificateOut", { playerIn, playerOut });
            } else {
              let playerIn = val[2];
              let playerOut = val[4];

              val.splice(3, 2);
              rooms.set(key, val);

              socketServer
                .in(key)
                .emit("notificateOut", { playerIn, playerOut });
            }
          } else {
            rooms.delete(key);
          }
        }
      }
    });
  });
};

module.exports = io;
