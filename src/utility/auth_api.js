import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// ======== Auth ======== //
// Validate email
// email
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// login
export const authLogin = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// Signup
export const authSignup = async (name, email, password) => {
  try {
    const response = await axios.post(API_URL + "/auth/signup", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};



// ADMIN MANAGE USER PAGE ONLY //

// getAllUser(admin)
export const getAllUser = async () => {
  try {
    const response = await axios.get(API_URL + "/auth/users");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// getOneUser(admin)
export const getOneUser = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/auth/users/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

// editUser(admin)
export const updateUser = async (_id, name, email, password, role) => {
  try {
    const response = await axios.put(API_URL + "/auth/users/" + _id, {
      name: name,
      email: email,
      // if no passoword is enterd , exclude this field
      ...(password && { password }),
      role: role,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// deleteUser(admin)
export const deleteUser = async (_id) => {
  try {
    const response = await axios.delete(API_URL + `/auth/users/${_id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
