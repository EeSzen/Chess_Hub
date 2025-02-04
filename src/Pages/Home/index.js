import { useState, useEffect, useCallback } from "react";
import { TextField, Container } from "@mui/material";
import CustomDialog from "../../Components/ErrorMessage";
import Game from "../Game";
import CreateGame from "../CreateGame";
import socket from "../../socket";
import Header from "../../Components/Header";
import { getUserName, getUserToken } from "../../utility/cookie_api";
import { useCookies } from "react-cookie";

function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  // color on the chessboard
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  // Fetch user data from cookies on login
  useEffect(() => {
    console.log(cookies);
    // Get username and token from cookies
    const token = getUserToken(cookies);
    const userName = getUserName(cookies);

    if (token && userName) {
      // Emit the "userLogin" event to the backend with the token
      socket.emit("userLogin", token, (response) => {
        if (response.error) {
          console.error("Login failed:", response.error);
        } else {
          setUsername(userName); // Set the username after successful login
          console.log("Logged in as", userName);
        }
      });
    } else {
      console.error("User not logged in");
      // Optionally, redirect to login page if no user info found
    }
  }, [cookies]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData);
      setPlayers(roomData.players);
    });
  }, []);

  return (
    <div className="Home">
      <Header />
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Container>
          {room ? (
            <Game
              room={room}
              orientation={orientation}
              username={username}
              players={players}
              cleanup={cleanup} // Game cleanup function
            />
          ) : (
            <CreateGame
              setRoom={setRoom}
              setOrientation={setOrientation}
              setPlayers={setPlayers}
              cookies={cookies} // Pass cookies for getting user info
            />
          )}
        </Container>
      </Container>
    </div>
  );
}

export default Home;
/////////////////////////////////////
{
  /* <Container>
          <CustomDialog
            open={!usernameSubmitted}
            handleClose={() => setUsernameSubmitted(true)}
            title="Pick a username"
            contentText="Please select a username"
            handleContinue={() => {
              if (!username) return;
              socket.emit("username", username);
              setUsernameSubmitted(true);
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              name="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />
          </CustomDialog>
          {room ? (
            <Game
              room={room}
              orientation={orientation}
              username={username}
              players={players}
              // the cleanup function will be used by Game to reset the state when a game is over
              cleanup={cleanup}
            />
          ) : (
            <CreateGame
              setRoom={setRoom}
              setOrientation={setOrientation}
              setPlayers={setPlayers}
            />
          )}
        </Container> */
}
/////////////////////////////////////

// // testing for create game(works but not sure how)
// import React, { useState } from "react";
// import { Button, Container } from "@mui/material";
// import axios from "axios";
// import CustomDialog from "../../Components/ErrorMessage";
// import Game from "../Game";
// import Header from "../../Components/Header";

// function Home() {
//   // State to store the game details
//   const [game, setGame] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Function to create a new game
//   const createGame = async () => {
//     const playerWhite = "Test 1"; // Example player names
//     const playerBlack = "Test 2";

//     setLoading(true); // Start loading

//     try {
//       // Send POST request to the backend
//       const response = await axios.post("http://localhost:5555/games", {
//         playerWhite,
//         playerBlack,
//       });

//       // Store the created game data in the state
//       setGame(response.data);
//     } catch (error) {
//       console.error("There was an error creating the game:", error);
//     } finally {
//       setLoading(false); // Stop loading after the request is completed
//     }
//   };

//   return (
//     <div className="Home">
//       <Header />

//       <Container sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
//         <CustomDialog />
//         <div>
//           {/* Button to create a game */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={createGame}
//             disabled={loading} // Disable button while loading
//           >
//             {loading ? "Creating..." : "Create Game"}
//           </Button>

//           {game && (
//             <div style={{ marginTop: 20 }}>
//               <h2>Game Created!</h2>
//               <pre>{JSON.stringify(game, null, 2)}</pre>
//             </div>
//           )}
//         </div>

//         {/* You can include the Game component here if needed */}
//         {game ? <Game /> : null}
//       </Container>
//     </div>
//   );
// }

// export default Home;

/////////////////////////////////////

// QR GENERATOR API //
// ------------------------------------------- //

// import { useEffect, useState } from "react";

// function Home() {
//   const [temp, setTemp] = useState("");
//   const [word, setWord] = useState("");
//   const [size, setSize] = useState(200);
//   const [bgColor, setBgColor] = useState("ffffff");
//   const [qrCode, setQrCode] = useState("");

//   // Changing the URL only when the user
//   // changes the input
//   useEffect(() => {
//     setQrCode(
//       `http://api.qrserver.com/v1/create-qr-code/?data=${word}&size=${size}x${size}&bgcolor=${bgColor}`
//     );
//   }, [word, size, bgColor]);

//   // Updating the input word when user
//   // click on the generate button
//   function handleClick() {
//     setWord(temp);
//   }

//   return (
//     <div className="Home">
//       <h1>QR Code Generator</h1>
//       <div className="input-box">
//         <div className="gen">
//           <input
//             type="text"
//             onChange={(e) => {
//               setTemp(e.target.value);
//             }}
//             placeholder="Enter text to encode"
//           />
//           <button className="button" onClick={handleClick}>
//             Generate
//           </button>
//         </div>
//         <div className="extra">
//           <h5>Background Color:</h5>
//           <input
//             type="color"
//             onChange={(e) => {
//               setBgColor(e.target.value.substring(1));
//             }}
//           />
//           <h5>Dimension:</h5>
//           <input
//             type="range"
//             min="200"
//             max="600"
//             value={size}
//             onChange={(e) => {
//               setSize(e.target.value);
//             }}
//           />
//         </div>
//       </div>
//       <div className="output-box">
//         <img src={qrCode} alt="" />
//         <a href={qrCode} download="QRCode">
//           <button type="button">Download</button>
//         </a>
//       </div>
//     </div>
//   );
// }

// export default Home;
