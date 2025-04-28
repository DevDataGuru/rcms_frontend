import axios from "axios";
import { API_URL } from "./API_URL";


// 3- FETCH ROLE WISE PERMISSIONS
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

// 4- FETCH MENU TAB BUTTONS
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


