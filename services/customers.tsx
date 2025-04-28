import axios from "axios";
import { API_URL } from "./API_URL";

export const saveCustomers = async (customerData,userId) => {
  console.log("API called with data:", customerData); // Add this
  try {
    const response = await axios.post(
      `${API_URL}/customers/saveCustomers?userId=${userId}`,
      customerData
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error("Error saving customer:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateCustomers = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/customers/updateCustomer/${id}`,
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    return null;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/customers/deleteCustomer/${id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    return null;
  }
};

// services/customers.ts
export const getCustomers = async (query: string | null) => {
  try {
    const response = await axios.get(
      `${API_URL}/customers/getCustomersDetail?${query}`
    );

    console.log("API Response:", response.data); // Debug log

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error; // Throw error instead of returning null
  }
};
