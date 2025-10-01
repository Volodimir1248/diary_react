import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updateTaskBoard = (boardId, data) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.UPDATE_TASK_BOARD_REQUEST });
        const response = await http.put(`/tasks/boards/${boardId}`, data);
        const { ...board } = response.data.task_board || {};
        dispatch({ type: ActionTypes.UPDATE_TASK_BOARD_SUCCESS, payload: board });
        toast.success(response.data.message || 'Доска обновлена');
        return board;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.UPDATE_TASK_BOARD_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
