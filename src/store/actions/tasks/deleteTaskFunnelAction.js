import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const deleteTaskFunnel = (boardId, funnelId) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.DELETE_TASK_FUNNEL_REQUEST });
        const response = await http.delete(`/tasks/boards/${boardId}/funnels/${funnelId}`);
        dispatch({ type: ActionTypes.DELETE_TASK_FUNNEL_SUCCESS, payload: funnelId });
        toast.success(response.data.message || 'Воронка удалена');
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.DELETE_TASK_FUNNEL_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
