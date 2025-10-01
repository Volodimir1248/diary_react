import ActionTypes from "../../action-types";
import { http } from "../../../helpers";
import { toast } from "react-toastify";

export const updateProfile = (profileData) => async (dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_PROFILE_REQUEST });

    try {
        const response = await http.post('/auth/update-profile', profileData);
        const { data } = response;
        const updatedUser = data?.user ?? data;

        dispatch({
            type: ActionTypes.UPDATE_PROFILE_SUCCESS,
            payload: updatedUser,
        });

        if (data?.message) {
            toast.success(data.message);
        }
    } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message;

        dispatch({
            type: ActionTypes.UPDATE_PROFILE_FAILURE,
            payload: errorMessage,
        });
    }
};
