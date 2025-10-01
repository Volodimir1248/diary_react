import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const addTask = (boardId, funnelId, data) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.ADD_TASK_REQUEST });
        const response = await http.post(`/tasks/boards/${boardId}/funnels/${funnelId}/tasks`, data);
        dispatch({
            type: ActionTypes.ADD_TASK_SUCCESS,
            payload: {
                funnelId,
                task: response.data.task,
            },
        });
        toast.success(response.data.message || 'Задача создана');
        return response.data.task;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.ADD_TASK_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
