import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updateTaskStatus = (taskId, status) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.UPDATE_TASK_STATUS_REQUEST });
        const response = await http.patch(`/tasks/tasks/${taskId}/status`, { is_completed: status });
        dispatch({ type: ActionTypes.UPDATE_TASK_STATUS_SUCCESS, payload: response.data.task });
        toast.success(response.data.message || 'Статус задачи обновлён');
    } catch (error) {
        dispatch({
            type: ActionTypes.UPDATE_TASK_STATUS_FAILURE,
            error: error.response?.data?.message || error.message,
        });
        toast.error(error.response?.data?.message || error.message);
    }
};
