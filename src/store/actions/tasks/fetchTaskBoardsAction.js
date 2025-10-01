import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchTaskBoards = () => async dispatch => {
    try {
        dispatch({ type: ActionTypes.FETCH_TASK_BOARDS_REQUEST });
        const response = await http.get('/tasks/boards');
        dispatch({
            type: ActionTypes.FETCH_TASK_BOARDS_SUCCESS,
            payload: {
                boards: response.data?.boards || [],
                priorities: response.data?.priorities || [],
            },
        });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_TASK_BOARDS_FAILURE,
            error: message,
        });
        toast.error(message);
    }
};
