import { Button, Container, Paper, Typography } from "@mui/material";
import { authSignup, validateEmail } from "../../utility/auth_api";
import { useState } from "react";
import Header from "../../Components/Header";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Signup() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    //check for error
    if (!name || !email || !password || !confirm) {
      return toast.error("Please fill out all the required fields");
    }

    if (confirm !== password) {
      return toast.error("Please check your password");
    }

    // trigger the add new product API
    const newUser = await authSignup(name, email, password, confirm);
    setCookie("currentUser", newUser, {
      maxAge: 60 * 60 * 24 * 30,
    });

    // check if the newUser exist or not
    if (!newUser) {
      return toast.error("Email or Password is incorrect");
    } else if (!validateEmail) {
      return toast.error("Email already exists");
    }

    if (newUser) {
      // show success error
      toast.success("Welcome to ChessHub!");
      console.log(newUser);
      navigate("/");
    }
  };

  return (
    <>
      <Header label="Create a New Account" />
      <Container>
        <Paper sx={{ p: 3, pt: 5 }}>
          <Typography variant="h4" align="center" mb={4}>
            Signup
          </Typography>
          <TextField
            fullWidth
            label="Name"
            id="Name"
            value={name}
            type="name"
            sx={{ mb: 3 }}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            id="Email"
            value={email}
            type="email"
            sx={{ mb: 3 }}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            id="Password"
            sx={{ mb: 3 }}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirm}
            id="Confirm Password"
            sx={{ mb: 3 }}
            onChange={(event) => setConfirm(event.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSignUp}
          >
            Signup
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default Signup;
