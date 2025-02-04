import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// add data to backend
export const sendGameData = async (gameData) => {
  try {
    const response = await axios.post(API_URL + "/games", gameData);
    // console.log("Game saved successfully:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// get all history
export const getGameData = async () => {
  try {
    const response = await axios.get(API_URL + "/games");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// get one game history
export const getOneGame = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/games/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// delete game history by _id
export const deleteGame = async (_id) => {
  try {
    console.log(_id);
    console.log("Deleting game with ID:", _id);
    const response = await axios.delete(API_URL + "/games/" + _id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
