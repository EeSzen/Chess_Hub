import { Container } from "@mui/material";
import Header from "../../Components/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { getLeaderboards } from "../../utility/leaderboard_api";

function Leaderboard() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    getLeaderboards().then((data) => {
      setLeaderboard(data);
      console.log(data);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  ///////////////////////////////////////
  return (
    <Container>
      <Header />
      <Container>
        <h1>Leaderboard</h1>
        {/* table */}
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ width: { xs: "40%", sm: "30%", md: "30%" } }}
                  >
                    Player
                  </TableCell>
                  <TableCell
                    sx={{ width: { xs: "15%", sm: "20%", md: "15%" } }}
                  >
                    Rating
                  </TableCell>
                  <TableCell
                    sx={{ width: { xs: "15%", sm: "20%", md: "15%" } }}
                  >
                    Won
                  </TableCell>
                  <TableCell
                    sx={{ width: { xs: "15%", sm: "20%", md: "15%" } }}
                  >
                    Draw
                  </TableCell>
                  <TableCell
                    sx={{ width: { xs: "15%", sm: "20%", md: "15%" } }}
                  >
                    Lost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user._id}
                      >
                        <TableCell>{user.playerName}</TableCell>
                        <TableCell>{user.rating}</TableCell>
                        <TableCell>{user.gamesWon}</TableCell>
                        <TableCell>{user.gamesDrawn}</TableCell>
                        <TableCell>{user.gamesLost}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={leaderboard.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {/* table */}
      </Container>
    </Container>
  );
}

export default Leaderboard;
