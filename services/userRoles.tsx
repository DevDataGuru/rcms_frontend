import axios from "axios";
import { API_URL } from "./API_URL";

export const getRoleNames = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles/getRoleNames`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching role names:', error);
    return null;
  }
};