import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import RangeAreaChart from './charts/RangeAreaChart';
import CategoryDonutChart from './charts/CategoryDonutChart';

const formatCurrency = (value) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(value || 0));

const TransactionSection = ({
    transactions = [],
    categories = [],
    loading = false,
    filters = {},
    rangeSummary = {},
    rangeSummaryLoading = false,
    categorySummary = {},
    categorySummaryLoading = false,
    activeTab = 'list',
    onTabChange,
    onApplyFilters,
    onResetFilters,
    onCreate,
    onEdit,
    onRefresh,
}) => {
    const [localFilters, setLocalFilters] = useState(() => ({
        type: filters?.type || '',
        category_id: filters?.category_id || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    }));
    const isCompactTable = useMediaQuery('(max-width:767px)');

    useEffect(() => {
        const nextFilters = {
            type: filters?.type || '',
            category_id: filters?.category_id ? String(filters.category_id) : '',
            date_from: filters?.date_from || '',
            date_to: filters?.date_to || '',
        };

        setLocalFilters((prev) => {
            if (
                prev.type === nextFilters.type &&
                prev.category_id === nextFilters.category_id &&
                prev.date_from === nextFilters.date_from &&
                prev.date_to === nextFilters.date_to
            ) {
                return prev;
            }
            return nextFilters;
        });
    }, [filters]);

    const expenseCategories = useMemo(
        () => categories.filter((category) => category.type === 'expense'),
        [categories]
    );
    const incomeCategories = useMemo(
        () => categories.filter((category) => category.type === 'income'),
        [categories]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onApplyFilters?.({ ...localFilters });
    };

    const handleReset = () => {
        onResetFilters?.();
    };

    const currentTab = activeTab || 'list';

    const handleTabChange = (_, value) => {
        if (value === currentTab) return;
        onTabChange?.(value);
    };

    const renderCategoryOptions = () => {
        const selectedType = localFilters.type;
        if (selectedType === 'expense') {
            return expenseCategories;
        }
        if (selectedType === 'income') {
            return incomeCategories;
        }
        return categories;
    };

    const incomeTotal = rangeSummary?.totals?.income || 0;
    const expenseTotal = rangeSummary?.totals?.expense || 0;
    const hasSummaryData = Array.isArray(rangeSummary?.data) && rangeSummary.data.length > 0;

    return (
        <Paper elevation={2}>
            <Stack sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2 }}} direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">Транзакции</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Отслеживайте движения средств, фильтруйте и редактируйте записи.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={loading}>
                        Обновить
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
                        Добавить
                    </Button>
                </Stack>
            </Stack>

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2 }}}
                elevation={0}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        select
                        label="Тип"
                        name="type"
                        value={localFilters.type}
                        onChange={handleChange}
                        size="small"
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="expense">Расходы</MenuItem>
                        <MenuItem value="income">Доходы</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Категория"
                        name="category_id"
                        value={localFilters.category_id}
                        onChange={handleChange}
                        sx={{ minWidth: 200 }}
                        size="small"
                        disabled={!categories.length}
                    >
                        <MenuItem value="">Все</MenuItem>
                        {renderCategoryOptions().map((category) => (
                            <MenuItem key={category.id} value={String(category.id)}>
                                {category.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Дата с"
                        type="date"
                        name="date_from"
                        size="small"
                        value={localFilters.date_from}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Дата по"
                        type="date"
                        name="date_to"
                        size="small"
                        value={localFilters.date_to}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button type="submit" variant="contained" sx={{ height: 40 }}>
                            Применить
                        </Button>
                        <Button type="button" color="inherit" onClick={handleReset} sx={{ height: 40 }}>
                            Сбросить
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Box
                sx={{
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    overflow: 'hidden',
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{
                        px: 0,
                        borderBottom: 1,
                        borderColor: 'divider',
                        minHeight: 'auto'
                    }}
                    TabIndicatorProps={{ sx: { display: 'none' } }}
                >
                    <Tab
                        label="Список транзакций"
                        value="list"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px 8px 0 0',
                            px: { xs: 2, sm: 3 },
                            py: 1.25,
                            minHeight: 'auto',
                            color: 'text.secondary',
                            bgcolor: 'transparent',
                            '&.Mui-selected': {
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                boxShadow: 1,
                            },
                        }}
                    />
                    <Tab
                        label="Динамика доходов и расходов"
                        value="dynamics"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px 8px 0 0',
                            px: { xs: 2, sm: 3 },
                            py: 1.25,
                            minHeight: 'auto',
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            bgcolor: 'transparent',
                            '&.Mui-selected': {
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                boxShadow: 1,
                            },
                        }}
                    />
                    <Tab
                        label="Структура расходов"
                        value="categories"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px 8px 0 0',
                            px: { xs: 2, sm: 3 },
                            py: 1.25,
                            minHeight: 'auto',
                            color: 'text.secondary',
                            bgcolor: 'transparent',
                            '&.Mui-selected': {
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                boxShadow: 1,
                            },
                        }}
                    />
                </Tabs>

                <Box>
                    {currentTab === 'list' && (
                        <>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress size={40} />
                            </Box>
                        ) : transactions.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Транзакции не найдены.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ overflowX: 'auto', pt: { xs: 2, sm: 2 }, px: { xs: 0, sm: 0 } }} >
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата</TableCell>
                                            {!isCompactTable && <TableCell>Тип</TableCell>}
                                            <TableCell>Категория</TableCell>
                                            {!isCompactTable && <TableCell>Комментарий</TableCell>}
                                            <TableCell align="right">Сумма</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow
                                                key={transaction.id}
                                                hover
                                                onClick={() => onEdit?.(transaction)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell sx={{ px: { xs: 1, md: 2 } }}>
                                                    {transaction.occurred_at?.slice(0, 10)}
                                                </TableCell>
                                                {!isCompactTable && (
                                                    <TableCell>
                                                        <Chip
                                                            size="small"
                                                            label={transaction.type === 'income' ? 'Доход' : 'Расход'}
                                                            color={transaction.type === 'income' ? 'success' : 'error'}
                                                        />
                                                    </TableCell>
                                                )}
                                                <TableCell sx={{ px: { xs: 1, md: 2 } }}>
                                                    {transaction.category?.title || 'Без категории'}
                                                </TableCell>
                                                {!isCompactTable && <TableCell>{transaction.note || '—'}</TableCell>}
                                                <TableCell align="right" sx={{ px: { xs: 1, md: 2 }, fontWeight: 600 }}>
                                                    <Typography
                                                        component="span"
                                                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                                                    >
                                                        {formatCurrency(transaction.amount)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </>
                )}

                    {currentTab === 'dynamics' && (
                        <Box sx={{p: { xs: 2, sm: 3 } }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6">Динамика доходов и расходов</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Используются даты, выбранные в фильтрах выше.
                                </Typography>
                            </Box>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Paper
                                    sx={{
                                        flex: 1,
                                        p: 2,
                                        backgroundColor: (theme) => theme.palette.success.light,
                                        color: '#fff',
                                    }}
                                    elevation={0}
                                >
                                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                        Доходы
                                    </Typography>
                                    <Typography variant="h5">
                                        {new Intl.NumberFormat('ru-RU').format(Math.round(incomeTotal))}
                                    </Typography>
                                </Paper>
                                <Paper
                                    sx={{
                                        flex: 1,
                                        p: 2,
                                        backgroundColor: (theme) => theme.palette.error.light,
                                        color: '#fff',
                                    }}
                                    elevation={0}
                                >
                                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                        Расходы
                                    </Typography>
                                    <Typography variant="h5">
                                        {new Intl.NumberFormat('ru-RU').format(Math.round(expenseTotal))}
                                    </Typography>
                                </Paper>
                            </Stack>

                            {rangeSummaryLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={36} />
                                </Box>
                            ) : hasSummaryData ? (
                                <RangeAreaChart data={rangeSummary.data} />
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Нет данных для отображения графика.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                    )}

                    {currentTab === 'categories' && (
                        <Box sx={{p: { xs: 2, sm: 3 } }}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6">Структура расходов по категориям</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Отображаются данные в рамках выбранного периода и фильтров.
                                </Typography>
                            </Box>

                            {categorySummaryLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={36} />
                                </Box>
                            ) : (
                                <CategoryDonutChart data={categorySummary?.items || []} />
                            )}
                            </Stack>
                        </Box>
                )}
                </Box>
            </Box>
        </Paper>
    );
};

export default TransactionSection;
