import { getGeneralSettingsDetail } from "@/services/settingsService";
import { generalSettings, generalSettingsFail } from "../slices/generalSlice";

export const GetGeneralSettings =
    () =>
        async (dispatch: any) => {
            // Use 'any' for simplicity
            try {
                const response = await getGeneralSettingsDetail(1); // Assuming authUser is your API service

                if (response.status === 200) {
                    // Assuming 200 is a successful response code
                    dispatch(generalSettings({ userData: response }));
                    return response;
                } else {
                    return false;
                }
            } catch (error: any) {
                // Annotate error as 'any' to avoid strict type issues
                dispatch(generalSettingsFail(error.message));
                return false;
            }
        };
