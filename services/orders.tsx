import axios from "axios";
import { API_URL } from "./API_URL";

export const savevehicleOrder = async (VehicleReservationsData) => {
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
      `${API_URL}/orders/savevehicleOrder`,
      VehicleReservationsData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving Vehicle records:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateVehicleOrders = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/updateVehicleOrders/${id}`,
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating Vehicle orders:", error);
    return null;
  }
};

export const deleteVehicleOrders = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/orders/deleteVehicleOrders/${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting Vehicle orders:", error);
    return null;
  }
};

// services/VehicleReservationss.ts
export const getVehicleOrders = async (query: string | null) => {
  try {
    const response = await axios.get(
      `${API_URL}/orders/records?${query}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Vehicle orders:", error);
    throw error; // Throw error instead of returning null
  }
};
