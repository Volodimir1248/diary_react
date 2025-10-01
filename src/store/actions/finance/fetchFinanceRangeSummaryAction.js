import ActionTypes from '../../action-types';
const toDateOnly = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const buildDateSeries = (start, end) => {
    if (!start || !end) return [];
    const dates = [];
    const current = new Date(start.getTime());
    while (current <= end) {
        dates.push(new Date(current.getTime()));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export const fetchFinanceRangeSummary = (filters = {}, transactions) => async (
    dispatch,
    getState
) => {
    try {
        dispatch({ type: ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_REQUEST });

        const stateTransactions = getState().finance?.transactions;
        const source = Array.isArray(transactions)
            ? transactions
            : Array.isArray(stateTransactions)
              ? stateTransactions
              : [];

        const orderedTransactions = [...source].sort((a, b) => {
            const left = new Date(a?.occurred_at || 0).getTime();
            const right = new Date(b?.occurred_at || 0).getTime();
            return left - right;
        });

        const startDate =
            toDateOnly(filters.date_from) || toDateOnly(orderedTransactions[0]?.occurred_at);
        const endDate =
            toDateOnly(filters.date_to) ||
            toDateOnly(orderedTransactions[orderedTransactions.length - 1]?.occurred_at);

        let rangeStart = startDate;
        let rangeEnd = endDate;

        if (rangeStart && rangeEnd && rangeStart > rangeEnd) {
            const temp = rangeStart;
            rangeStart = rangeEnd;
            rangeEnd = temp;
        }
        if (!rangeStart && rangeEnd) {
            rangeStart = new Date(rangeEnd.getTime());
        }
        if (!rangeEnd && rangeStart) {
            rangeEnd = new Date(rangeStart.getTime());
        }

        const series = buildDateSeries(rangeStart, rangeEnd);
        const map = new Map();
        const totals = { income: 0, expense: 0 };

        series.forEach((date) => {
            const key = formatDate(date);
            map.set(key, { date: key, income: 0, expense: 0 });
        });

        orderedTransactions.forEach((item) => {
            const occurred = toDateOnly(item.occurred_at);
            if (!occurred) return;
            const key = formatDate(occurred);
            if (!map.has(key)) {
                map.set(key, { date: key, income: 0, expense: 0 });
            }
            if (rangeStart && occurred < rangeStart) return;
            if (rangeEnd && occurred > rangeEnd) return;
            const entry = map.get(key);
            const amount = Number(item.amount) || 0;
            if (item.type === 'income') {
                entry.income += amount;
                totals.income += amount;
            } else {
                entry.expense += amount;
                totals.expense += amount;
            }
        });

        const summary = {
            filters,
            totals,
            data: Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1)),
            startDate: rangeStart ? formatDate(rangeStart) : null,
            endDate: rangeEnd ? formatDate(rangeEnd) : null,
        };

        dispatch({
            type: ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_SUCCESS,
            payload: summary,
        });
        return summary;
    } catch (error) {
        dispatch({
            type: ActionTypes.FETCH_FINANCE_RANGE_SUMMARY_FAILURE,
            error: error.message,
        });
        return null;
    }
};
