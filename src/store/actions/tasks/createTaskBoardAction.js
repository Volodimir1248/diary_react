import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const createTaskBoard = (data) => async dispatch => {
    try {
        dispatch({ type: ActionTypes.CREATE_TASK_BOARD_REQUEST });
        const response = await http.post('/tasks/boards', data);
        const { funnels: {...rawBoard} } = response.data.task_board || {};

        const requestedTitle = typeof data?.title === 'string' ? data.title : undefined;
        const responseTitle = typeof rawBoard.title === 'string' ? rawBoard.title : undefined;
        const responseName = typeof rawBoard.name === 'string' ? rawBoard.name : undefined;

        const normalizedTitle = [responseTitle, responseName, requestedTitle].find(
            value => typeof value === 'string' && value.trim().length > 0
        );

        const board = {
            ...rawBoard,
            title: normalizedTitle ?? '',
        };

        dispatch({ type: ActionTypes.CREATE_TASK_BOARD_SUCCESS, payload: board });
        toast.success(response.data.message || 'Доска создана');
        return board;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.CREATE_TASK_BOARD_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
