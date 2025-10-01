import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const deleteTaskBoard = (boardId) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.DELETE_TASK_BOARD_REQUEST });
        const response = await http.delete(`/tasks/boards/${boardId}`);
        dispatch({ type: ActionTypes.DELETE_TASK_BOARD_SUCCESS, payload: boardId });
        toast.success(response.data.message || 'Доска удалена');
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.DELETE_TASK_BOARD_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
