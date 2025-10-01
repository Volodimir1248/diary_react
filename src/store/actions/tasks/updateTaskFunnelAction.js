import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const updateTaskFunnel = (boardId, funnelId, data) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.UPDATE_TASK_FUNNEL_REQUEST });
        const response = await http.put(`/tasks/boards/${boardId}/funnels/${funnelId}`, data);
        const { ...funnel } = response.data.funnel || {};
        dispatch({ type: ActionTypes.UPDATE_TASK_FUNNEL_SUCCESS, payload: funnel });
        toast.success(response.data.message || 'Воронка обновлена');
        return response.data.funnel;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.UPDATE_TASK_FUNNEL_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
