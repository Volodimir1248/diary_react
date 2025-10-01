import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const fetchFinanceTransactions = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.FETCH_FINANCE_TRANSACTIONS_REQUEST });
        const response = await http.get('/finance/transactions', { params });
        const transactionsPayload = response.data?.transactions;

        const items = Array.isArray(transactionsPayload)
            ? transactionsPayload
            : Array.isArray(transactionsPayload?.data)
              ? transactionsPayload.data
              : [];

        dispatch({
            type: ActionTypes.FETCH_FINANCE_TRANSACTIONS_SUCCESS,
            payload: {
                transactions: items,
                filters: params,
            },
        });

        return items;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.FETCH_FINANCE_TRANSACTIONS_FAILURE,
            error: message,
        });
        toast.error(message);
        return null;
    }
};
