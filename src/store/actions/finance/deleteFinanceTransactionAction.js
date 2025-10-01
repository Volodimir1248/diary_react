import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const deleteFinanceTransaction = (transactionId) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DELETE_FINANCE_TRANSACTION_REQUEST });
        const response = await http.delete(`/finance/transactions/${transactionId}`);
        dispatch({
            type: ActionTypes.DELETE_FINANCE_TRANSACTION_SUCCESS,
            payload: transactionId,
        });
        toast.success(response.data?.message || 'Транзакция удалена');
        return true;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.DELETE_FINANCE_TRANSACTION_FAILURE,
            error: message,
        });
        toast.error(message);
        return false;
    }
};
