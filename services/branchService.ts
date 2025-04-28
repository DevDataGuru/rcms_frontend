import axios from "axios";
import { API_URL } from "./API_URL";

export const getBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/branches/getAllBranches`);

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching branch names:", error);
    return null;
  }
};
