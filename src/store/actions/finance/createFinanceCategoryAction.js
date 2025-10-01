import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const createFinanceCategory = (values) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.CREATE_FINANCE_CATEGORY_REQUEST });
        const response = await http.post('/finance/categories', values);
        dispatch({
            type: ActionTypes.CREATE_FINANCE_CATEGORY_SUCCESS,
            payload: response.data?.category,
        });
        toast.success(response.data?.message || 'Категория добавлена');
        return response.data?.category;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.CREATE_FINANCE_CATEGORY_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
