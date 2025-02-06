import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// get all openings
export const getOpenings = async () => {
  try {
    const response = await axios.get(API_URL + "/openings");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// get one opening
export const getOpening = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/openings/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// add one opening
export const addOpening = async (name, moves, color) => {
  try {
    const response = await axios.post(API_URL + "/openings/add", {
      name,
      moves,
      color,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// delete one opening
export const deleteOpening = async (_id) => {
  try {
    const response = await axios.delete(API_URL + "/openings/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// update one opening
export const updateOpening = async (_id, name, moves, color) => {
  try {
    const response = await axios.put(API_URL + "/openings/edit/" + _id, {
      name,
      moves,
      color,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
