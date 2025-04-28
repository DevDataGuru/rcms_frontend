import axios from "axios";
import { API_URL } from "./API_URL";

export const saveVehicleReservation = async (VehicleReservationsData,userId) => {
  console.log(
    "API called with data:",
    VehicleReservationsData,

    {
      withCredentials: true, // Important for session handling
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const response = await axios.post(
      `${API_URL}/reservations-management/savevehicleReservation?userId=${userId}`,
      VehicleReservationsData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving VehicleReservations:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateVehicleReservation = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/reservations-management/updateVehicleReservations/${id}`,
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating VehicleReservations:", error);
    return null;
  }
};

export const deleteVehicleReservations = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/reservations-management/deleteVehicleReservation/${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting VehicleReservations:", error);
    return null;
  }
};

// services/VehicleReservationss.ts
export const getVehicleReservations = async (query: string | null) => {
  try {
    const response = await axios.get(
      `${API_URL}/reservations-management/getVehicleReservations?${query}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching VehicleReservationss:", error);
    throw error; // Throw error instead of returning null
  }
};
