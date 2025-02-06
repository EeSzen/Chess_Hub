import { Container, Grid, Paper, Typography, Button } from "@mui/material";
import Header from "../../Components/Header";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { getOpenings, deleteOpening } from "../../utility/opening_api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { isAdmin } from "../../utility/cookie_api";
import { getUserToken } from "../../utility/cookie_api";

function Openings() {
  const [openings, setOpenings] = useState([]);
  const [cookies] = useCookies(["currenUser"]);
  const token = getUserToken(cookies);
  const navigate = useNavigate("/");

  useEffect(() => {
    getOpenings().then((data) => {
      if (data) {
        setOpenings(data); // Make sure data is not undefined
      } else {
        toast.error("Failed to load openings");
      }
    });
  }, []);

  const getBoardPosition = (moves) => {
    const game = new Chess();
    moves.forEach((moveObj) => {
      try {
        game.move(moveObj.move);
      } catch (error) {
        console.error(`Invalid move: ${moveObj.move}`, error);
      }
    });
    return game.fen();
  };

  const handleDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Opening ?"
    );
    if (confirmed) {
      const deleted = await deleteOpening(_id);
      if (deleted) {
        const latestOpenings = await getOpenings();
        setOpenings(latestOpenings);
        toast.success("Opening deleted successfully");
      } else {
        toast.error("Failed to delete game");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Header />
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Chess Openings
      </Typography>
      {isAdmin(cookies) ? (
        <Button
          variant="contained"
          size="small"
          sx={{ marginBottom: 2 }}
          onClick={() => navigate("/openings/add")}
        >
          Add New Opening
        </Button>
      ) : null}

      <Grid container spacing={3} justifyContent="center">
        {openings && openings.length > 0 ? (
          openings.map((opening) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={opening._id}>
              <Paper
                elevation={3}
                sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {opening.name} ({opening.color})
                </Typography>
                <Container
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Chessboard
                    position={getBoardPosition(opening.moves)}
                    boardWidth={300}
                    arePiecesDraggable={false}
                  />
                </Container>
                {isAdmin(cookies) ? (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate("/openings/edit/" + opening._id)
                        }
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(opening._id)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                ) : null}
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" textAlign="center">
            No openings available
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Openings;
