import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const deleteFinanceCategory = (categoryId) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DELETE_FINANCE_CATEGORY_REQUEST });
        const response = await http.delete(`/finance/categories/${categoryId}`);
        dispatch({
            type: ActionTypes.DELETE_FINANCE_CATEGORY_SUCCESS,
            payload: categoryId,
        });
        toast.success(response.data?.message || 'Категория удалена');
        return true;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.DELETE_FINANCE_CATEGORY_FAILURE,
            error: message,
        });
        toast.error(message);
        return false;
    }
};
