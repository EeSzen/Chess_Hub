import { Button, Container, TextField, MenuItem } from "@mui/material";
import Header from "../../Components/Header";
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  addOpening,
  getOpening,
  updateOpening,
} from "../../utility/opening_api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddOpening() {
  const navigate = useNavigate("/");
  const [name, setName] = useState("");
  const [color, setColor] = useState("white");
  const [moves, setMoves] = useState([]);
  const [chess] = useState(new Chess());

  const handleMove = (move) => {
    const result = chess.move(move);
    if (result) {
      setMoves([...moves, { move: result.san }]); // Standard Algebraic Notation (SAN)
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate fields
    if (!name || !color || moves.length === 0) {
      toast.error(
        "Please fill out all required fields and make at least one move."
      );
      return;
    }

    try {
      const newOpening = await addOpening(name, moves, color);
      if (newOpening) {
        toast.success("Opening added successfully!");
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
        <h1>Add Opening</h1>
        <form onSubmit={handleFormSubmit}>
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
          <Container sx={{ display: "flex" }}>
            <Chessboard
              boardWidth={450}
              position={chess.fen()}
              onPieceDrop={(sourceSquare, targetSquare) => {
                handleMove({ from: sourceSquare, to: targetSquare });
              }}
            />
          </Container>
          <Container>
            <Button type="submit" variant="contained" fullWidth>
              Save
            </Button>
          </Container>
        </form>
      </Container>
    </>
  );
}

export default AddOpening;
