import axios from "axios"
import { API_URL } from "./API_URL"

export const SaveGeneralSettingsDetail = async (data: any, userId: any): Promise<any> => {
    try {
        const result = await axios.put(`${API_URL}/general-settings/updateGeneralSettings/1?userId=${userId}`, data);
        if (result.status === 200) {
            return result.data;
        } else {
            return false;
        }
    } catch (error) {
        console.log("settings Service", error);
        throw error;
    }
};

export const getGeneralSettingsDetail = async (id: number): Promise<any> => {
    try {
        const result = await axios.get(`${API_URL}/general-settings/GeneralSettings/1`);
        if (result.status === 200) {
            return result.data;
        } else {
            return false;
        }
    } catch (error) {
        console.log("settings Service", error);
        throw error;
    }
};



export const getEmailSettings = async (): Promise<any> => {
    try {
        const result = await axios.get(`${API_URL}/general-settings/GetEmailSettings`);
        if (result.status === 200) {
            return result.data;
        } else {
            return false;
        }
    } catch (error) {
        console.log("settings Service", error);
        throw error;
    }
};
export const SaveEmailSettingsDetail = async (data: any, userId: any): Promise<any> => {
    try {
        const result = await axios.put(`${API_URL}/general-settings/updateEmailSettings/1?userId=${userId}`, data);
        if (result.status === 200) {
            return result.data;
        } else {
            return false;
        }
    } catch (error) {
        console.log("settings Service", error);
        throw error;
    }
};
