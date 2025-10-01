import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const createTaskFunnel = (boardId, data) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.CREATE_TASK_FUNNEL_REQUEST });
        const response = await http.post(`/tasks/boards/${boardId}/funnels`, data);
        const { ...funnel } = response.data.funnel || {};
        dispatch({ type: ActionTypes.CREATE_TASK_FUNNEL_SUCCESS, payload: funnel });
        toast.success(response.data.message || 'Воронка создана');
        return response.data.funnel;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.CREATE_TASK_FUNNEL_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
