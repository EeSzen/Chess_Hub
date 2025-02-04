import { useEffect } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "../../Components/ErrorMessage";
import socket from "../../socket";
import { getUserName, getUserToken } from "../../utility/cookie_api";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function CreateGame({ setRoom, setOrientation, setPlayers }) {
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate("/");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(""); // input state
  const [roomError, setRoomError] = useState("");

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // Fetch username and token from cookies when the component mounts
  useEffect(() => {
    const userName = getUserName(cookies);
    const userToken = getUserToken(cookies);
    const userEmail = cookies.currentUser?.email;

    if (userName && userToken && userEmail) {
      setUsername(userName);
      setToken(userToken);
    } else {
      console.error("User not authenticated");
      navigate("/login");
    }
  }, [cookies]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Select Room to Join"
        contentText="Enter a valid room ID to join the room"
        handleContinue={() => {
          const userEmail = cookies.currentUser?.email;
          if (!userEmail) {
            console.error("User email is missing!");
            return;
          }

          // join a room
          if (!roomInput) return; // if given room input is valid, do nothing.

          console.log("Joining room with:", {
            roomId: roomInput,
            username,
            email: userEmail,
          });

          if (username) {
            console.log("Joining room with:", {
              roomId: roomInput,
              username,
              email: userEmail,
            });
            socket.emit(
              "joinRoom",
              { roomId: roomInput, username, email: userEmail },
              (r) => {
                console.log("Response from server:", r);

                // r is the response from the server
                if (r.error) {
                  setRoomError(r.message);
                  return;
                } // if an error is returned in the response set roomError to the error message and exit
                console.log("response:", r);

                setRoom(r?.roomId); // set room to the room ID
                setPlayers(r?.players); // set players array to the array of players in the room
                setOrientation("black"); // set orientation as black
                setRoomDialogOpen(false); // close dialog
              }
            );
          } else {
            console.error("Username is not set.");
          }
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => {
            setRoomInput(e.target.value);
            // Clear the error when typing
            if (roomError) {
              setRoomError("");
            }
          }}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={
            !roomError ? "Enter a room ID" : `Invalid room ID: ${roomError}`
          }
        />
      </CustomDialog>
      {/* Button for starting a game */}
      <Button
        variant="contained"
        onClick={() => {
          const userEmail = cookies.currentUser?.email; // Get email from cookies
          if (!userEmail) {
            console.error("User email is missing!");
            return;
          }
          socket.emit(
            "createRoom",
            { username: username, email: userEmail },
            (r) => {
              console.log(r);
              console.log(r.players);
              setRoom(r.roomId); //  Set only the roomId
              setPlayers(r.players); //  Store players in state
              setOrientation("white");
            }
          );
        }}
      >
        Start a game
      </Button>
      {/* Button for joining a game */}
      <Button
        onClick={() => {
          setRoomDialogOpen(true);
        }}
      >
        Join a game
      </Button>
    </Stack>
  );
}

export default CreateGame;
