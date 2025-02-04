import { useState, useMemo, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import ErrorMessage from "../../Components/ErrorMessage";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import * as React from "react";
/////////////////////////////////////////////
import { sendGameData } from "../../utility/history_api";
import { getUserName, getUserToken } from "../../utility/cookie_api";
import { useCookies } from "react-cookie";
import { updateRating } from "../../utility/leaderboard_api";
///////////////////////////
import socket from "../../socket";

function Game({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  // const currentUserName = getUserName(cookies);

  // Authentication - Get token
  useEffect(() => {
    if (token) {
      socket.emit("authenticate", token, (response) => {
        if (response.error) {
          console.error("Authentication failed:", response.error);
        } else {
          console.log("Authenticated as:", response.username);
        }
      });
    } else {
      console.error("No token found in localStorage");
    }

    // Cleanup socket on component unmount
    return () => {
      socket.off("authenticate");
    };
  }, []);

  const handleUndo = useCallback(() => {
    setFen(chess.undo());
    setFen(chess.fen());
    setHistory(chess.history());
  }, [chess]);

  const handleReset = useCallback(() => {
    setFen(chess.reset());
    setFen(chess.fen());
    setHistory(chess.history());
  }, [chess]);

  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`); // set game over
    });
  }, []);

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        console.log(result);
        setFen(chess.fen());
        setHistory(chess.history());

        // checking if match is over or if is checkmate
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} Wins!`
            );
            // setRatingChange(10);
          } else if (chess.isDraw()) {
            setOver("Draw");
            // setRatingChange(5);
          } else {
            setOver("Game Over");
          }
          handleGameFinish();
        }
        return result;
      } catch (error) {
        // illegal move!!!
        console.error("illegal move!!!:", error);
        return null;
      }
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
    if (chess.turn() !== orientation[0]) return false;
    if (players.length < 2) return false;

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q",
    };

    const move = makeAMove(moveData);

    if (move === null) return false;

    socket.emit("move", {
      // <- 3 emit a move event.
      move: moveData,
      room,
    });

    return true;
  }

  const handleGameFinish = async () => {
    // Ensure both players exist before proceeding
    if (!players || players.length < 2 || !players[1]) {
      console.error("Error: One or more players are missing:", players);
      return; // Prevent saving history with an undefined player
    }

    const moves = chess.history({ verbose: true }).map((move) => ({
      player: move.color === "w" ? "white" : "black",
      move: move.san,
    }));

    const winner = chess.isCheckmate()
      ? chess.turn() === "w"
        ? "black"
        : "white"
      : null;

    const whitePlayer = players?.[0]?.username || "Unknown";
    const blackPlayer = players?.[1]?.username || "Unknown";
    console.log("White Player:", players?.[0]);
    console.log("Black Player:", players?.[1]);

    const gameData = {
      moves: moves,
      winner: winner,
      players: {
        white: whitePlayer,
        black: blackPlayer,
      },
      date: new Date(),
    };

    socket.on("gameOver", (data) => {
      console.log("Game Over Response:", data); // Log response to check structure

      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      if (data.success) {
        console.log("Updated leaderboard:", data.updatedLeaderboard);
        setLeaderboard(data.updatedLeaderboard);
      }
    });

    // send history data
    sendGameData(gameData);

    const userEmail = players?.[0]?.email;
    const opponentEmail = players?.[1]?.email;

    if (!userEmail || !opponentEmail) {
      console.error("Error: Missing player email", {
        userEmail,
        opponentEmail,
      });
      return; // Exit to avoid making an invalid API request
    }

    let result;
    console.log(result);
    if (winner === "white") {
      result = userEmail; // White won
    } else if (winner === "black") {
      result = opponentEmail; // Black won
    } else {
      result = "draw";
    }

    // Update player ratings
    try {
      if (winner === "white") {
        await updateRating(userEmail, userEmail, 10, "win");
        await updateRating(opponentEmail, opponentEmail, 10, "loss");
      } else if (winner === "black") {
        await updateRating(userEmail, userEmail, 10, "loss");
        await updateRating(opponentEmail, opponentEmail, 10, "win");
      } else if (chess.isDraw()) {
        await updateRating(userEmail, userEmail, 5, "draw");
        await updateRating(opponentEmail, opponentEmail, 5, "draw");
      }
    } catch (error) {
      console.error(
        "Error updating rating:",
        error.response?.data || error.message
      );
    }
  };

  // if move is made emit to everyone in the room
  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
    });

    return () => {
      socket.off("move"); // Cleanup to prevent duplicate listeners
    };
  }, [makeAMove]);

  return (
    <Grid
      container
      spacing={3}
      sx={{
        backgroundColor: "#f0f8ff",
        p: 2,
        py: 5,
        margin: 0,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Chessboard Section */}
      <Grid xs={12} md={8} sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 3,
            boxShadow: 4,
            bgcolor: "white",
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 2,
              color: "#3f51b5",
              fontWeight: "bold",
            }}
          >
            {!chess.isGameOver()
              ? chess.turn() === "w"
                ? "White's Turn"
                : "Black's Turn"
              : "Checkmate!"}
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h5">Room ID: {room}</Typography>
            </CardContent>
          </Card>

          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
          />

          <ErrorMessage
            open={Boolean(over)}
            title={over}
            contentText={over}
            handleContinue={() => {
              socket.emit("closeRoom", { roomId: room });
              cleanup();
            }}
          />
        </Box>
      </Grid>

      {/* Move History Section */}
      <Grid
        item
        padding={0}
        xs={12}
        md={4}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <Container display="flex" flexDirection="column" gap={2}>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "#3f51b5", fontWeight: "bold" }}
          >
            Move History
          </Typography>
          {players.length > 0 && (
            <Box>
              <List>
                <ListSubheader>Players</ListSubheader>
                {players.map((p) => (
                  <ListItem key={p.id}>
                    <ListItemText primary={p.username} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {!chess.isGameOver() ? (
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleUndo}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                }}
              >
                Undo
              </Button>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                }}
              >
                Reset
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleReset}
              sx={{
                bgcolor: "#f44336",
                "&:hover": { bgcolor: "#d32f2f" },
              }}
            >
              Start New Game
            </Button>
          )}

          <List
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "#e8f5e9",
              overflow: "auto",
              maxHeight: 300,
              ul: { padding: 0 },
              marginTop: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Box>
              {history && history.length !== 0 ? (
                history.map((move, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#c8e6c9",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemText sx={{ fontWeight: "bold" }}>
                      {index + 1}. {move}
                    </ListItemText>
                  </ListItem>
                ))
              ) : (
                <ListItemText>Starting Position</ListItemText>
              )}
            </Box>
          </List>
        </Container>
      </Grid>

      {/* On smaller screens, move history will appear below the chessboard */}
      <Grid xs={12} md={4} sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
        <Box
          display="flex"
          justifyContent="center"
          textAlign="center"
          flexDirection="column"
          gap={2}
          maxWidth="400px"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "#3f51b5", fontWeight: "bold" }}
          >
            Move History
          </Typography>

          {!chess.isGameOver() ? (
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleUndo}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                }}
              >
                Undo
              </Button>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                }}
              >
                Reset
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleReset}
              sx={{
                bgcolor: "#f44336",
                "&:hover": { bgcolor: "#d32f2f" },
              }}
            >
              Start New Game
            </Button>
          )}

          <List
            sx={{
              width: "100%",
              maxWidth: "100%",
              bgcolor: "#e8f5e9",
              overflow: "auto",
              maxHeight: 300,
              ul: { padding: 0 },
              marginTop: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <ul>
              {history && history.length !== 0 ? (
                history.map((move, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#c8e6c9",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemText sx={{ fontWeight: "bold" }}>
                      {index + 1}. {move}
                    </ListItemText>
                  </ListItem>
                ))
              ) : (
                <ListItemText>Starting Position</ListItemText>
              )}
            </ul>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Game;
