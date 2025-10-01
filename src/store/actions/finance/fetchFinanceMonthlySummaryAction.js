import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchFinanceMonthlySummary = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_REQUEST });
        const response = await http.get('/finance/summary/monthly', { params });
        dispatch({
            type: ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_SUCCESS,
            payload: {
                year: response.data?.year,
                months: response.data?.months || [],
            },
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_FAILURE,
            error: message,
        });
        toast.error(message);
        return null;
    }
};
