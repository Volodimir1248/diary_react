import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchFinanceCategories = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.FETCH_FINANCE_CATEGORIES_REQUEST });
        const response = await http.get('/finance/categories', { params });
        const categories = response.data?.categories || [];
        dispatch({
            type: ActionTypes.FETCH_FINANCE_CATEGORIES_SUCCESS,
            payload: categories,
        });
        return categories;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_FINANCE_CATEGORIES_FAILURE,
            error: message,
        });
        toast.error(message);
        return null;
    }
};
