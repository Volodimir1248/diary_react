import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updateTask = (taskId, funnelId, data, previousFunnelId) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.UPDATE_TASK_REQUEST });
        const response = await http.put(`/tasks/tasks/${taskId}`, { ...data, funnel_id: funnelId });
        dispatch({
            type: ActionTypes.UPDATE_TASK_SUCCESS,
            payload: {
                funnelId,
                previousFunnelId,
                task: response.data.task,
            },
        });
        toast.success(response.data.message || 'Задача обновлена');
        return response.data.task;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.UPDATE_TASK_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
