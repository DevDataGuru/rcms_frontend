import axios from "axios";
import { API_URL } from "./API_URL";

// 1- GET ENDPOINT - GETTING MENUS , TABS AND BUTTONS
export const getMenuTabBtns = async () => {
  try {
    const response = await axios.get(`${API_URL}/common/menus-tabs-buttons`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2- GET ENDPOINT - GETTING ROLE WISE PERMISSIONS
export const getRoleWisePermissions = async (roleId) => {
  try {
    const response = await axios.get(
      `${API_URL}/common/getRoleWisePermissions/${roleId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 3- GET ENDPOINT - GETTING VEHICLE MAKERS
export const getVehicleMakes = async () => {
  try {
    const response = await axios.get(`${API_URL}/common/vehicleMake`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 4- GET ENDPOINT - GETTING VEHICLE COLORS
export const getVehicleColors = async () => {
  try {
    const response = await axios.get(`${API_URL}/common/vehicleColor`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 5- GET ENDPOINT - GETTING VEHICLE PLATE SOURCE
export const getVehiclePlateSources = async (queryParams: string) => {
  try {
    const response = await axios.get(`${API_URL}/common/vehiclePlateSource`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchingTabsForRole = async () => {
  try {
    const response = await axios.get(`${API_URL}/common/fetchingTabsForRole`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error)
    throw error;
  }
}


export const fetchingPermissionsByTabs = async (data) => {
  try {
    const response = await axios.get(`${API_URL}/common/fetchPermissionByTabIds?${data}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error)
    throw error;
  }
}