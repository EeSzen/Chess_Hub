import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// LEADERBOARD PAGE //
// get all leaderboards
export const getLeaderboards = async () => {
  try {
    const response = await axios.get(API_URL + "/leaderboards");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// get one leaderboard user
export const getLeaderboard = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/leaderboards/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// update rating(win,lose,draw)
export const updateRating = async (userEmail, opponentEmail, result) => {
  try {
    const response = await axios.put(API_URL + "/leaderboards/update", {
      userEmail,
      opponentEmail,
      result,
    });
    console.log("Updated Ratings:", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
