import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const deleteNote = (noteId) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DELETE_NOTE_REQUEST });
        await http.delete(`/notes/${noteId}`);
        dispatch({ type: ActionTypes.DELETE_NOTE_SUCCESS, payload: noteId });
        toast.success('Note deleted successfully');
    } catch (error) {
        dispatch({
            type: ActionTypes.DELETE_NOTE_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
    }
};
