import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchFinanceCategorySummary = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_REQUEST });
        const response = await http.get('/finance/summary/by-category', { params });
        dispatch({
            type: ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_SUCCESS,
            payload: {
                items: response.data?.items || [],
                filters: params,
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_FAILURE,
            error: message,
        });
        toast.error(message);
        return null;
    }
};
