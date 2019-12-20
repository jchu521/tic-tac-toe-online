import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { Grid, Typography, CircularProgress, Button } from "@material-ui/core";

const useStyles = makeStyles({
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  disabledRedButton: {
    backgroundColor: "#f50057 !important"
  },
  disabledBlueButton: {
    backgroundColor: "#3f51b5 !important"
  },
  disabledGrayButton: {
    backgroundColor: "#E0E0E0 !important"
  }
});

const initialBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

var test = [];

function Room({ location, history }) {
  const classes = useStyles();
  const [mark, setMark] = useState("O");
  const [board, setBoard] = useState(initialBoard);
  const [p1Message, setP1Message] = useState("");
  const [p2Message, setP2Message] = useState("");
  const [join, setJoin] = useState(false);
  const [endPoint, setEndPoint] = useState("localhost:5000");
  const [p1Turn, setP1Turn] = useState(true);
  const [p2Turn, setP2Turn] = useState(false);

  const socket = io(endPoint);

  useEffect(() => {
    if (location.state.player === "Player1") {
      socket.emit("createGame", { roomName: location.state.roomName });
    }
    if (location.state.player === "Player2") {
      socket.emit("joinGame", { roomName: location.state.roomName });
    }

    socket.on("player1", data => {
      if (data && data.message) {
        setP1Message(data.message);
      }
      if (data && data.joined) {
        setJoin(true);
        setP1Message("Your Turn");
      }
    });

    socket.on("player2", data => {
      setJoin(true);
      setP2Message("Waiting");
    });
  }, [location && location.state && location.state.player]);

  socket.on("player1 turn", data => {
    if (data && data.message) {
      setP1Message(data.message);
    }
  });

  socket.on("player2 turn", data => {
    if (data && data.message) {
      setP2Message(data.message);
    }
  });

  socket.on("restart", data => {
    setBoard(data.board);
  });
  /**
   * Opponent played his turn. Update UI.
   * Allow the current player to play now.
   */
  socket.on("turnPlayed", function(data) {
    setBoard(data.newBoard);
    let endGame = checkWinner(data.newBoard, data.mark);

    if (endGame) {
      if (data.mark === "O") {
        setP1Message("WIN");
        setP2Message("LOSS");
      } else {
        setP1Message("LOSS");
        setP2Message("WIN");
      }
    } else {
      if (data.mark === "O") {
        setP1Turn(false);
        setP2Turn(true);
      } else {
        setP1Turn(true);
        setP2Turn(false);
      }
      setMark(data.mark === "O" ? "X" : "O");
    }
  });

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = (newboard, newMark) => {
    let win = false;
    test = [];
    newboard.forEach(element => {
      test = test.concat(element);
    });
    winConditions.forEach(element => {
      if (
        test[element[0]] === newMark &&
        test[element[1]] === newMark &&
        test[element[2]] === newMark
      ) {
        win = true;
      }
    });

    return win;
  };

  const handleClick = (i, j) => e => {
    if (board[i][j].length === 0) {
      const newBoard = [...board];
      // checkWinner();

      newBoard[i][j] = mark;

      socket.emit("playTurn", {
        newBoard,
        roomName: location.state.roomName,
        mark
      });
    }
  };

  return (
    <Grid container justify="center" className={classes.app}>
      <Grid item xs={12}>
        <Typography variant="h2">Tic Tac Toe</Typography>
      </Grid>
      <Grid item xs={12}>
        {location.state.player === "Player1" && p1Message}
        {location.state.player === "Player2" && p2Message}
      </Grid>
      {join ? (
        <>
          <button
            onClick={() => {
              // setMessage("");
              socket.emit("play again", {
                board: [
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""]
                ]
              });
            }}
          >
            Play again
          </button>
          <Grid item xs={12}>
            {board &&
              board.map((i, index) => (
                <div key={index} className={classes.row}>
                  {i.map((j, jIndex) => (
                    <Button
                      key={jIndex}
                      variant="contained"
                      color="default"
                      classes={{
                        disabled:
                          j === ""
                            ? classes.disabledGrayButton
                            : j === "X"
                            ? classes.disabledRedButton
                            : classes.disabledBlueButton
                      }}
                      onClick={handleClick(index, jIndex)}
                      style={{
                        lineHeight: "120px",
                        width: 120,
                        height: 120,
                        border: "1px solid black"
                      }}
                      disabled={
                        j !== "" ||
                        (location.state.player === "Player1" && !p1Turn) ||
                        (location.state.player === "Player2" && !p2Turn)
                          ? true
                          : false
                      }
                    >
                      {" "}
                    </Button>
                  ))}
                </div>
              ))}
          </Grid>
        </>
      ) : (
        <CircularProgress size={200} style={{ marginTop: 25 }} />
      )}
    </Grid>
  );
}

export default withRouter(Room);
