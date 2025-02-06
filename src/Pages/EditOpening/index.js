import { Button, Container, TextField, MenuItem, Box } from "@mui/material";
import Header from "../../Components/Header";
import { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { getOpening, updateOpening } from "../../utility/opening_api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

function EditOpening() {
  const { _id } = useParams(); //URL _id
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState("white");
  const [moves, setMoves] = useState([]);
  const [chess, setChess] = useState(new Chess());

  // Load opening data from API
  useEffect(() => {
    const fetchOpening = async () => {
      try {
        const opening = await getOpening(_id);
        if (opening) {
          setName(opening.name);
          setColor(opening.color);
          setMoves(opening.moves);

          // Initialize the chess instance with the correct move history
          const newChess = new Chess();
          opening.moves.forEach(({ move }) => {
            newChess.move(move); // Apply each move to recreate the position
          });

          setChess(newChess); // Update the state with the new position
        }
      } catch (error) {
        toast.error("Failed to load opening data");
        console.error(error);
      }
    };

    fetchOpening();
  }, [_id]);

  // Handle moves on the chessboard
  const handleMove = (move) => {
    const newChess = new Chess(chess.fen()); // Create a new instance with the current board state
    const result = newChess.move(move); // Try the move

    if (result) {
      setMoves([...moves, { move: result.san }]); // Update move history
      setChess(newChess); // Update the board state
    } else {
      toast.error("Invalid move!");
    }
  };

  // Handle undo logic
  const handleUndo = useCallback(() => {
    const newChess = new Chess(chess.fen()); // Create a new instance
    newChess.undo(); // Perform undo
    setChess(newChess); // Update the state with the new board position
  }, [chess]);

  // Handle reset logic
  const handleReset = useCallback(() => {
    const newChess = new Chess(); // Create a new instance with initial setup
    setChess(newChess); // Update the state with the new board position
    setMoves([]); // Reset moves
  }, []);

  // Update the opening
  const handleFormUpdate = async (event) => {
    event.preventDefault();

    if (!name || !color || moves.length === 0) {
      toast.error(
        "Please fill out all required fields and make at least one move."
      );
      return;
    }

    try {
      const updatedOpening = await updateOpening(_id, name, moves, color);
      if (updatedOpening) {
        toast.success("Opening updated successfully!");
        navigate("/openings");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <h1>Edit Opening</h1>
        <form onSubmit={handleFormUpdate}>
          <TextField
            fullWidth
            label="Opening Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="white">White</MenuItem>
            <MenuItem value="black">Black</MenuItem>
          </TextField>
          <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Chessboard
              boardWidth={450}
              position={chess.fen()} // Ensure board updates with correct position
              onPieceDrop={(sourceSquare, targetSquare) => {
                handleMove({ from: sourceSquare, to: targetSquare });
              }}
              key={chess.fen()} // Force re-render when position changes
            />
            <Container>
              {!chess.isGameOver() ? (
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={handleUndo}
                    sx={{
                      bgcolor: "#3f51b5",
                      "&:hover": { bgcolor: "#303f9f" },
                    }}
                  >
                    Undo
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{
                      bgcolor: "#3f51b5",
                      "&:hover": { bgcolor: "#303f9f" },
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              ) : null}
            </Container>
          </Container>
          <Container sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Update
            </Button>
          </Container>
        </form>
      </Container>
    </>
  );
}

export default EditOpening;
