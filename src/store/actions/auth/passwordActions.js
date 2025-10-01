import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updatePassword = (passwordData) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.UPDATE_PASSWORD_REQUEST });
        const response = await http.post('/auth/update-password', passwordData);
        dispatch({
            type: ActionTypes.UPDATE_PASSWORD_SUCCESS,
            payload: response.data,
        });
        toast.success(response.data.message);
    } catch (error) {
        dispatch({
            type: ActionTypes.UPDATE_PASSWORD_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message);
    }
};
