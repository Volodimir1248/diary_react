import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchTaskBoard = (boardId) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.FETCH_TASK_BOARD_REQUEST });
        const response = await http.get(`/tasks/boards/${boardId}`);
        const { task_board: boardPayload } = response.data;
        const { funnels: boardFunnels = [], ...boardData } = boardPayload || {};
        const board = boardPayload ? boardData : null;
        const funnelsResponse = response.data.funnels ?? boardFunnels;

        const tasksByFunnel = {};
        const funnels = (funnelsResponse || []).map(funnel => {
            const { tasks = [], ...funnelData } = funnel;
            tasksByFunnel[funnel.id] = tasks;
            return funnelData;
        });

        dispatch({
            type: ActionTypes.FETCH_TASK_BOARD_SUCCESS,
            payload: {
                board,
                funnels,
                tasksByFunnel,
            },
        });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_TASK_BOARD_FAILURE,
            error: message,
        });
        toast.error(message);
    }
};
