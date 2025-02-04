import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import UserCard from "../../Components/Card";
import { Container, Grid } from "@mui/material";
import { getAllUser } from "../../utility/auth_api";
import { isAdmin } from "../../utility/cookie_api";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { deleteUser } from "../../utility/auth_api";

function Manage() {
  const navigate = useNavigate("/");
  const [cookies] = useCookies(["currenUser"]);
  const [user, setUser] = useState([]);

  // check if is admin or not
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/");
      toast.error("UR A BETA, NOT ALPHA!!");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getAllUser().then((data) => {
      setUser(data);
    });
  }, []);

  const handleDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this User?"
    );
    if (confirmed) {
      const deleted = await deleteUser(_id);
      if (deleted) {
        // get the latest Users data from the API again
        const latestUsers = await getAllUser();
        // update the Users state with the latest data
        setUser(latestUsers);
        // show success message
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete User");
      }
    }
  };

  return (
    <>
      <Header />
      <Container>
        <h1>Manage Users</h1>
        <Grid container>
          {user && user.length > 0 ? (
            user.map((item) => (
              <Grid key={item._id} xs={12} md={6} lg={4} marginBottom={2}>
                <UserCard item={item} onDelete={() => handleDelete(item._id)} />
              </Grid>
            ))
          ) : (
            <Grid lg={12}>"No User Found"</Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Manage;
