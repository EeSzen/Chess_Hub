import { io } from "socket.io-client";

const socket = io("https://b13-eeszen24.mak3r.dev", {
  transports: ["websocket", "polling"],
});
// initialize websocket connection
// const socket = io("localhost:5555"); // initialize websocket connection

export default socket;

// validate with token
// import { io } from "socket.io-client"; // import connection function

// const token = localStorage.getItem("token"); // Get JWT from local storage
// console.log(token);

// const socket = io("http://localhost:5555", {
//   auth: { token }, // Send token in handshake auth
//   autoConnect: false, // Don't auto-connect until user logs in
// });

// export default socket;
