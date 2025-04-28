import axios from "axios";
import { API_URL } from "./API_URL";

export const saveFolder = async (folderData) => {
  console.log(
    "API called with data:",
    folderData,

    {
      withCredentials: true, // Important for session handling
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const response = await axios.post(
      `${API_URL}/companies/createCompany`,
      folderData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving data:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateFolder = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/companies/updateCompany/${id}`,
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
};

export const deleteFolder = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/companies/deleteCompany/${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
};
export const getFolder = async (query: string | null) => {
  try {
    const response = await axios.get(
      `${API_URL}/companies/getCompanyDetail?${query}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching branch names:", error);
    return null;
  }
};
