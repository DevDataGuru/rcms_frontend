import axios from "axios";
import { API_URL } from "./API_URL";


// 1- GET USERS 
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/getAllUsers`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching  users:', error);
    return null;
  }
};

// ===================================================================================================================== //

// 2- UPDATE USERS
export const updateUsers = async (userId, userdata) => {
  try {
    const response = await axios.put(`${API_URL}/users/updateUser/${userId}`, userdata);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating  users:', error);
    return null;
  }
};

// ===================================================================================================================== //

// 3- DELETE USERS
export const deleteUsers = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/deleteUser/${userId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error deleting users:', error);
    return null;
  }
};

// ===================================================================================================================== //

// 4- DELETE USERS
export const addUsers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/deleteUser`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error deleting users:', error);
    return null;
  }
};

// ===================================================================================================================== //

