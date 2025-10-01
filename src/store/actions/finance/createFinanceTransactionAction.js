import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';

export const createFinanceTransaction = (values) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.CREATE_FINANCE_TRANSACTION_REQUEST });
        const response = await http.post('/finance/transactions', values);
        let transaction = response.data?.transaction;

        if (transaction?.id) {
            try {
                const details = await http.get(`/finance/transactions/${transaction.id}`);
                transaction = details.data?.transaction || transaction;
            } catch (fetchError) {
                // ignore, we'll use the original payload
            }
        }

        dispatch({
            type: ActionTypes.CREATE_FINANCE_TRANSACTION_SUCCESS,
            payload: transaction,
        });
        toast.success(response.data?.message || 'Транзакция добавлена');
        return transaction;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.CREATE_FINANCE_TRANSACTION_FAILURE,
            error: message,
        });
        toast.error(message);
        throw error;
    }
};
