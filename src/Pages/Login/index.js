import { Button, Container, Paper, Typography } from "@mui/material";
import { authLogin } from "../../utility/auth_api";
import { useState } from "react";
import Header from "../../Components/Header";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    // check for error
    if (!email || !password) {
      return toast.error("Please fill out all the required fields");
    }
    // trigger the API
    const loggedUser = await authLogin(email, password);
    setCookie("currentUser", loggedUser, {
      maxAge: 60 * 60 * 24 * 30, // second * minutes * hours * days
    });

    if (!loggedUser) {
      return toast.error("Email or Password is incorrect");
    }

    if (loggedUser) {
      toast.success("You have logged in successfully!");
      navigate("/");
      console.log(loggedUser);
    }
  };
  console.log(cookies);
  return (
    <>
      <Header label="Login to Your Account" />
      <Container>
        <Paper sx={{ p: 3, pt: 5 }}>
          <Typography variant="h4" align="center" mb={4}>
            Login
          </Typography>
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
            id="Password"
            value={password}
            type="password"
            sx={{ mb: 3 }}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
