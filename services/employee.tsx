import axios from "axios";
import { API_URL } from "./API_URL";

export const saveEmployee = async (employeeData,userId) => {
  console.log(
    "API called with data:",
    employeeData,

    {
      withCredentials: true, // Important for session handling
      headers: {
        "Content-Type": "application/json",
      },
    }
  ); 
  try {
    const response = await axios.post(
      `${API_URL}/employees/addEmployee?userId=${userId}`,
      employeeData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving employee:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateEmployees = async (id,data) => {
  try {
    const response = await axios.put(
      `${API_URL}/employees/updateEmployee/${id}`,data
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

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/employees/deleteEmployee/${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    return null;
  }
};

// services/employees.ts
export const getEmployees = async (query: string | null) => {
  try {
    const response = await axios.get(
      `${API_URL}/employees/getEmployeeDetail?${query}`,
    );

    console.log("API Response:", response.data); // Debug log

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error; // Throw error instead of returning null
  }
};
