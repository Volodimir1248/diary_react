import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const addNote = (newNoteData) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.ADD_NOTE_REQUEST });
        const response = await http.post('/notes', newNoteData);
        dispatch({ type: ActionTypes.ADD_NOTE_SUCCESS, payload: response.data.note });
        toast.success(response.data.message || 'Note added successfully');
    } catch (error) {
        dispatch({
            type: ActionTypes.ADD_NOTE_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
    }
};
