import axios from "axios";
import { API_URL } from "./API_URL";

// 1- GET VEHICLES
export const getVehicles = async (query: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/getActiveVehicles`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching  Vehicles:", error);
    return null;
  }
};

// ===================================================================================================================== //

// 2- UPDATE VEHICLE
export const updateVehicle = async (vehicleId, vehicledata) => {
  try {
    const response = await axios.put(
      `${API_URL}/vehicles/updateVehicle/${vehicleId}`,
      vehicledata
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating  Vehicle:", error);
    return null;
  }
};

// ===================================================================================================================== //

// 3- DELETE VEHICLE
export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/vehicles/deleteVehicle/${vehicleId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting Vehicle:", error);
    return null;
  }
};

// ===================================================================================================================== //

// 4- ADD VEHICLE
export const saveVehicle = async (vehicleData) => {
  try {
    const response = await axios.post(
      `${API_URL}/vehicles/addVehicles`,
      vehicleData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting Vehicle:", error);
    return null;
  }
};

// ===================================================================================================================== //
