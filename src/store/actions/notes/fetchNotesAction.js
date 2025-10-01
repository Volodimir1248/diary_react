import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchNotes = () => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.FETCH_NOTES_REQUEST });
        const response = await http.get('/notes'); // сервер должен вернуть объект { notes: [...] }
        dispatch({ type: ActionTypes.FETCH_NOTES_SUCCESS, payload: response.data.notes });
    } catch (error) {
        dispatch({
            type: ActionTypes.FETCH_NOTES_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
    }
};
