import { useState, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import Header from "../../Components/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
// ////////////////
import * as React from "react";
import List from "@mui/material/List";
// //////////////////////
import { toast } from "sonner";

import { getGameData, deleteGame } from "../../utility/history_api";

function History() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getGameData().then((data) => {
      setHistory(data);
    });
  }, []);

  const handleDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game ?"
    );
    if (confirmed) {
      const deleted = await deleteGame(_id);
      if (deleted) {
        // get the latest Game data from the API again
        const latestGame = await getGameData();
        // update the Game state with the latest data
        setHistory(latestGame);
        // show success message
        toast.success("Game deleted successfully");
      } else {
        toast.error("Failed to delete game");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container>
      <Header />
      <Container>
        <h1>History</h1>
      </Container>
      <Container>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Game ID</TableCell>
                  <TableCell>Winner</TableCell>
                  <TableCell>W vs B</TableCell>
                  <TableCell>Moves</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((game) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={game._id}
                    >
                      <TableCell>{game._id}</TableCell>
                      <TableCell>
                        {game.winner === "black" ? (
                          <Chip label={game.winner} size="small" />
                        ) : (
                          <Chip
                            label={game.winner}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {game.players.white} vs {game.players.black}
                      </TableCell>
                      {/* mui scroll  */}
                      <TableCell>
                        <List
                          sx={{
                            width: "100%",
                            maxWidth: 160,
                            position: "relative",
                            overflow: "auto",
                            minHeight: 120,
                            maxHeight: 120,
                            // ul: { padding: 0 },
                          }}
                          subheader={<li />}
                        >
                          {game.moves.map((move, index) => (
                            <Typography key={index}>
                              {move.player}: {move.move}
                            </Typography>
                          ))}
                        </List>
                      </TableCell>
                      {/*  */}
                      <TableCell>
                        {new Date(game.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(game._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={history.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Container>
  );
}

export default History;
