import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { updateUser, getOneUser } from "../../utility/auth_api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header";
import TextField from "@mui/material/TextField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { isAdmin } from "../../utility/cookie_api";

function UserEdit() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    getOneUser(_id)
      .then((data) => {
        console.log(data);
        if (data) {
          setName(data.name);
          setEmail(data.email);
          // Don't show the hashed password
          setPassword("");
          setRole(data.role);
        } else {
          toast.error("User data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
      });
  }, [_id]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  // check if is admin or not
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check for error
    if (!name || !email || !role) {
      toast.error("Please fill out all the required fields");
      return;
    }

    try {
      // If password is empty, dont send to the backend
      const updatedUser = await updateUser(_id, name, email, password, role);

      if (updatedUser) {
        toast.success("User has been edited successfully!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header label="Update user details" />
      <Container>
        <Paper sx={{ p: 3, pt: 5 }}>
          <Typography variant="h4" align="center" mb={4}>
            Update User
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
            helperText="Leave blank to keep the current password"
          />
          <Box>
            <FormControl variant="filled" style={{ minWidth: 220 }}>
              <InputLabel id="role-select-label">Roles</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                onChange={handleChange}
                sx={{ my: 2 }}
              >
                <MenuItem value="user">
                  <em>User</em>
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleFormSubmit}
          >
            Update
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default UserEdit;
