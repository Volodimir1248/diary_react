import ActionTypes from '../../action-types';

const initialState = {
    categories: [],
    categoriesLoading: false,
    transactions: [],
    transactionsFilters: {},
    transactionsLoading: false,
    monthlySummary: {
        year: new Date().getFullYear(),
        months: [],
    },
    monthlySummaryLoading: false,
    categorySummary: {
        items: [],
        filters: {},
    },
    categorySummaryLoading: false,
    rangeSummary: {
        data: [],
        totals: { income: 0, expense: 0 },
        startDate: null,
        endDate: null,
        filters: {},
    },
    rangeSummaryLoading: false,
    error: null,
};

const updateCategory = (categories, updated) =>
    categories.map((item) => (item.id === updated.id ? { ...item, ...updated } : item));

const sortByDateDesc = (a, b) => {
    const aTime = new Date(a.occurred_at || a.date || 0).getTime();
    const bTime = new Date(b.occurred_at || b.date || 0).getTime();
    return bTime - aTime;
};

const addTransactionToList = (transactions, item) => {
    if (!item) return transactions;
    const filtered = transactions.filter((transaction) => transaction.id !== item.id);
    return [item, ...filtered].sort(sortByDateDesc);
};

const updateTransactionList = (transactions, updated) => {
    if (!updated) return transactions;
    const list = transactions.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item
    );
    return list.sort(sortByDateDesc);
};

const financeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_FINANCE_CATEGORIES_REQUEST:
            return { ...state, categoriesLoading: true, error: null };
        case ActionTypes.FETCH_FINANCE_CATEGORIES_SUCCESS:
            return {
                ...state,
                categoriesLoading: false,
                categories: action.payload || [],
            };
        case ActionTypes.FETCH_FINANCE_CATEGORIES_FAILURE:
            return { ...state, categoriesLoading: false, error: action.error };

        case ActionTypes.CREATE_FINANCE_CATEGORY_REQUEST:
        case ActionTypes.UPDATE_FINANCE_CATEGORY_REQUEST:
        case ActionTypes.DELETE_FINANCE_CATEGORY_REQUEST:
            return { ...state, categoriesLoading: true, error: null };
        case ActionTypes.CREATE_FINANCE_CATEGORY_SUCCESS:
            return {
                ...state,
                categoriesLoading: false,
                categories: [action.payload, ...state.categories],
            };
        case ActionTypes.UPDATE_FINANCE_CATEGORY_SUCCESS:
            return {
                ...state,
                categoriesLoading: false,
                categories: updateCategory(state.categories, action.payload),
            };
        case ActionTypes.DELETE_FINANCE_CATEGORY_SUCCESS:
            return {
                ...state,
                categoriesLoading: false,
                categories: state.categories.filter((item) => item.id !== action.payload),
            };
        case ActionTypes.CREATE_FINANCE_CATEGORY_FAILURE:
        case ActionTypes.UPDATE_FINANCE_CATEGORY_FAILURE:
        case ActionTypes.DELETE_FINANCE_CATEGORY_FAILURE:
            return { ...state, categoriesLoading: false, error: action.error };

        case ActionTypes.FETCH_FINANCE_TRANSACTIONS_REQUEST:
            return { ...state, transactionsLoading: true, error: null };
        case ActionTypes.FETCH_FINANCE_TRANSACTIONS_SUCCESS:
            return {
                ...state,
                transactionsLoading: false,
                transactions: action.payload?.transactions || [],
                transactionsFilters: action.payload?.filters || state.transactionsFilters,
            };
        case ActionTypes.FETCH_FINANCE_TRANSACTIONS_FAILURE:
            return { ...state, transactionsLoading: false, error: action.error };

        case ActionTypes.CREATE_FINANCE_TRANSACTION_REQUEST:
        case ActionTypes.UPDATE_FINANCE_TRANSACTION_REQUEST:
        case ActionTypes.DELETE_FINANCE_TRANSACTION_REQUEST:
            return { ...state, transactionsLoading: true, error: null };
        case ActionTypes.CREATE_FINANCE_TRANSACTION_SUCCESS: {
            const transaction = action.payload;
            const transactions = addTransactionToList(state.transactions, transaction);
            return {
                ...state,
                transactionsLoading: false,
                transactions,
            };
        }
        case ActionTypes.UPDATE_FINANCE_TRANSACTION_SUCCESS: {
            const transaction = action.payload;
            return {
                ...state,
                transactionsLoading: false,
                transactions: updateTransactionList(state.transactions, transaction),
            };
        }
        case ActionTypes.DELETE_FINANCE_TRANSACTION_SUCCESS: {
            const filtered = state.transactions.filter((item) => item.id !== action.payload);
            return {
                ...state,
                transactionsLoading: false,
                transactions: filtered,
            };
        }
        case ActionTypes.CREATE_FINANCE_TRANSACTION_FAILURE:
        case ActionTypes.UPDATE_FINANCE_TRANSACTION_FAILURE:
        case ActionTypes.DELETE_FINANCE_TRANSACTION_FAILURE:
            return { ...state, transactionsLoading: false, error: action.error };

        case ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_REQUEST:
            return { ...state, monthlySummaryLoading: true, error: null };
        case ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_SUCCESS:
            return {
                ...state,
                monthlySummaryLoading: false,
                monthlySummary: {
                    year: action.payload?.year || state.monthlySummary.year,
                    months: action.payload?.months || [],
                },
            };
        case ActionTypes.FETCH_FINANCE_MONTHLY_SUMMARY_FAILURE:
            return { ...state, monthlySummaryLoading: false, error: action.error };

        case ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_REQUEST:
            return { ...state, categorySummaryLoading: true, error: null };
        case ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_SUCCESS:
            return {
                ...state,
                categorySummaryLoading: false,
                categorySummary: {
                    items: action.payload?.items || [],
                    filters: action.payload?.filters || {},
                },
            };
        case ActionTypes.FETCH_FINANCE_CATEGORY_SUMMARY_FAILURE:
            return { ...state, categorySummaryLoading: false, error: action.error };

        case ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_REQUEST:
            return { ...state, rangeSummaryLoading: true, error: null };
        case ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_SUCCESS:
            return {
                ...state,
                rangeSummaryLoading: false,
                rangeSummary: {
                    data: action.payload?.data || [],
                    totals: action.payload?.totals || { income: 0, expense: 0 },
                    startDate: action.payload?.startDate || null,
                    endDate: action.payload?.endDate || null,
                    filters: action.payload?.filters || {},
                },
            };
        case ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_FAILURE:
            return { ...state, rangeSummaryLoading: false, error: action.error };

        default:
            return state;
    }
};

export default financeReducer;
