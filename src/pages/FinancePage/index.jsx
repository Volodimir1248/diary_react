import React, { useCallback, useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import CategorySection from './CategorySection';
import CategoryFormDialog from './CategoryFormDialog';
import CategoryManagerDialog from './CategoryManagerDialog';
import TransactionSection from './TransactionSection';
import TransactionFormDialog from './TransactionFormDialog';
import AnalyticsSection from './AnalyticsSection';

import { fetchFinanceCategories } from '../../store/actions/finance/fetchFinanceCategoriesAction';
import { createFinanceCategory } from '../../store/actions/finance/createFinanceCategoryAction';
import { updateFinanceCategory } from '../../store/actions/finance/updateFinanceCategoryAction';
import { deleteFinanceCategory } from '../../store/actions/finance/deleteFinanceCategoryAction';
import { fetchFinanceTransactions } from '../../store/actions/finance/fetchFinanceTransactionsAction';
import { createFinanceTransaction } from '../../store/actions/finance/createFinanceTransactionAction';
import { updateFinanceTransaction } from '../../store/actions/finance/updateFinanceTransactionAction';
import { deleteFinanceTransaction } from '../../store/actions/finance/deleteFinanceTransactionAction';
import { fetchFinanceMonthlySummary } from '../../store/actions/finance/fetchFinanceMonthlySummaryAction';
import { fetchFinanceRangeSummary } from '../../store/actions/finance/fetchFinanceRangeSummaryAction';
import { fetchFinanceCategorySummary } from '../../store/actions/finance/fetchFinanceCategorySummaryAction';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const createDefaultTransactionFilters = () => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    return {
        type: '',
        category_id: '',
        date_from: formatDate(start),
        date_to: formatDate(end),
    };
};

const FinancePage = () => {
    const dispatch = useDispatch();
    const {
        categories,
        categoriesLoading,
        transactions,
        transactionsFilters,
        transactionsLoading,
        monthlySummary,
        monthlySummaryLoading,
        rangeSummary,
        rangeSummaryLoading,
        categorySummary,
        categorySummaryLoading,
    } = useSelector((state) => state.finance);

    const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [transactionFiltersState, setTransactionFiltersState] = useState(() =>
        createDefaultTransactionFilters()
    );
    const [transactionTab, setTransactionTab] = useState('list');

    useEffect(() => {
        const defaultFilters = createDefaultTransactionFilters();
        setTransactionFiltersState(defaultFilters);

        dispatch(fetchFinanceCategories());
        dispatch(fetchFinanceMonthlySummary({ year: new Date().getFullYear() }));

        const initializeTransactions = async () => {
            const items = await dispatch(fetchFinanceTransactions(defaultFilters));
            dispatch(fetchFinanceRangeSummary(defaultFilters, items));
        };

        initializeTransactions();
    }, [dispatch]);

    useEffect(() => {
        if (transactionsFilters) {
            setTransactionFiltersState({
                type: transactionsFilters.type || '',
                category_id: transactionsFilters.category_id
                    ? String(transactionsFilters.category_id)
                    : '',
                date_from: transactionsFilters.date_from || '',
                date_to: transactionsFilters.date_to || '',
            });
        }
    }, [transactionsFilters]);

    const handleOpenCategoryDialog = useCallback((category = null) => {
        setCategoryToEdit(category);
        setCategoryDialogOpen(true);
    }, []);

    const handleCloseCategoryDialog = useCallback(() => {
        setCategoryDialogOpen(false);
        setCategoryToEdit(null);
    }, []);

    const handleOpenCategoryManager = useCallback(() => {
        setCategoryManagerOpen(true);
    }, []);

    const handleCloseCategoryManager = useCallback(() => {
        setCategoryManagerOpen(false);
        handleCloseCategoryDialog();
    }, [handleCloseCategoryDialog]);

    const handleSubmitCategory = useCallback(async (values) => {
        if (categoryToEdit) {
            await dispatch(updateFinanceCategory(categoryToEdit.id, values));
        } else {
            await dispatch(createFinanceCategory(values));
        }
        handleCloseCategoryDialog();
    }, [categoryToEdit, dispatch, handleCloseCategoryDialog]);

    const handleCreateCategoryFromManager = useCallback(() => {
        handleOpenCategoryDialog(null);
    }, [handleOpenCategoryDialog]);

    const handleEditCategoryFromManager = useCallback(
        (category) => {
            if (!category) return;
            handleOpenCategoryDialog(category);
        },
        [handleOpenCategoryDialog]
    );

    const handleDeleteCategory = useCallback(async (category) => {
        if (!category) return;
        const confirmed = window.confirm(`Удалить категорию «${category.title}»?`);
        if (!confirmed) return;
        await dispatch(deleteFinanceCategory(category.id));
    }, [dispatch]);

    const handleOpenTransactionDialog = useCallback((transaction = null) => {
        setTransactionToEdit(transaction);
        setTransactionDialogOpen(true);
    }, []);

    const handleCloseTransactionDialog = useCallback(() => {
        setTransactionDialogOpen(false);
        setTransactionToEdit(null);
    }, []);

    const refreshTransactions = useCallback(
        (filters = transactionFiltersState) => dispatch(fetchFinanceTransactions(filters)),
        [dispatch, transactionFiltersState]
    );

    const refreshRangeSummary = useCallback(
        (filters = transactionFiltersState, items) =>
            dispatch(fetchFinanceRangeSummary(filters, items)),
        [dispatch, transactionFiltersState]
    );

    const refreshCategorySummary = useCallback(
        (filters = transactionFiltersState) => dispatch(fetchFinanceCategorySummary(filters)),
        [dispatch, transactionFiltersState]
    );

    const refreshAnalytics = useCallback(
        async (filters, items) => {
            const nextFilters = filters || transactionFiltersState;
            await refreshRangeSummary(nextFilters, items);
        },
        [refreshRangeSummary, transactionFiltersState]
    );

    const handleSubmitTransaction = useCallback(async (values) => {
        if (transactionToEdit) {
            await dispatch(updateFinanceTransaction(transactionToEdit.id, values));
        } else {
            await dispatch(createFinanceTransaction(values));
        }
        handleCloseTransactionDialog();
        const updatedTransactions = await refreshTransactions();
        await refreshAnalytics(transactionFiltersState, updatedTransactions);
    }, [
        dispatch,
        handleCloseTransactionDialog,
        refreshAnalytics,
        refreshTransactions,
        transactionFiltersState,
        transactionToEdit,
    ]);

    const handleDeleteTransaction = useCallback(
        async (transaction) => {
            if (!transaction) return;
            const confirmed = window.confirm('Удалить транзакцию?');
            if (!confirmed) return;
            await dispatch(deleteFinanceTransaction(transaction.id));
            handleCloseTransactionDialog();
            const updatedTransactions = await refreshTransactions();
            await refreshAnalytics(transactionFiltersState, updatedTransactions);
        },
        [
            dispatch,
            handleCloseTransactionDialog,
            refreshAnalytics,
            refreshTransactions,
            transactionFiltersState,
        ]
    );

    const handleApplyTransactionFilters = useCallback(async (filters) => {
        const payload = {
            type: filters.type || '',
            category_id: filters.category_id ? String(filters.category_id) : '',
            date_from: filters.date_from || '',
            date_to: filters.date_to || '',
        };
        setTransactionFiltersState(payload);
        const items = await dispatch(fetchFinanceTransactions(payload));
        await refreshAnalytics(payload, items);
    }, [
        dispatch,
        refreshAnalytics,
    ]);

    const handleResetTransactionFilters = useCallback(async () => {
        const defaultFilters = createDefaultTransactionFilters();
        setTransactionFiltersState(defaultFilters);
        const items = await dispatch(fetchFinanceTransactions(defaultFilters));
        await refreshAnalytics(defaultFilters, items);
    }, [
        dispatch,
        refreshAnalytics,
    ]);

    const handleYearChange = useCallback(
        (year) => {
            dispatch(fetchFinanceMonthlySummary({ year }));
        },
        [dispatch]
    );

    const handleRefreshTransactions = useCallback(async () => {
        const items = await refreshTransactions();
        await refreshAnalytics(transactionFiltersState, items);
    }, [refreshTransactions, refreshAnalytics, transactionFiltersState]);

    const handleTransactionTabChange = useCallback(
        (tab) => {
            setTransactionTab(tab);
            if (tab === 'categories') {
                refreshCategorySummary();
            }
        },
        [refreshCategorySummary]
    );

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
                <CategorySection
                    categories={categories}
                    loading={categoriesLoading}
                    onManage={handleOpenCategoryManager}
                />

                <TransactionSection
                    transactions={transactions}
                    categories={categories}
                    loading={transactionsLoading}
                    filters={transactionFiltersState}
                    rangeSummary={rangeSummary}
                    rangeSummaryLoading={rangeSummaryLoading}
                    categorySummary={categorySummary}
                    categorySummaryLoading={categorySummaryLoading}
                    activeTab={transactionTab}
                    onTabChange={handleTransactionTabChange}
                    onApplyFilters={handleApplyTransactionFilters}
                    onResetFilters={handleResetTransactionFilters}
                    onCreate={() => handleOpenTransactionDialog(null)}
                    onEdit={handleOpenTransactionDialog}
                    onRefresh={handleRefreshTransactions}
                />

                <AnalyticsSection
                    monthlySummary={monthlySummary}
                    monthlySummaryLoading={monthlySummaryLoading}
                    onYearChange={handleYearChange}
                />
            </Stack>
            <CategoryManagerDialog
                open={categoryManagerOpen}
                onClose={handleCloseCategoryManager}
                categories={categories}
                loading={categoriesLoading}
                onCreate={handleCreateCategoryFromManager}
                onEdit={handleEditCategoryFromManager}
                onDelete={handleDeleteCategory}
            />

            <CategoryFormDialog
                open={categoryDialogOpen}
                onClose={handleCloseCategoryDialog}
                onSubmit={handleSubmitCategory}
                category={categoryToEdit}
            />

            <TransactionFormDialog
                open={transactionDialogOpen}
                onClose={handleCloseTransactionDialog}
                onSubmit={handleSubmitTransaction}
                transaction={transactionToEdit}
                categories={categories}
                onDelete={handleDeleteTransaction}
            />
        </Container>
    );
};

export default FinancePage;
