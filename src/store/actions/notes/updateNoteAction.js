import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updateNote = (noteId, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.UPDATE_NOTE_REQUEST });
        // Отправляем запрос PUT для обновления заметки
        const response = await http.put(`/notes/${noteId}`, updatedData);
        dispatch({ type: ActionTypes.UPDATE_NOTE_SUCCESS, payload: response.data.note });
        toast.success(response.data.message || 'Note updated successfully');
    } catch (error) {
        dispatch({
            type: ActionTypes.UPDATE_NOTE_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
    }
};
