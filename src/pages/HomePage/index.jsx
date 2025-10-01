import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { http } from '../../helpers/http';

const numberFormatter = new Intl.NumberFormat('ru-RU');
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
});
const percentFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    maximumFractionDigits: 1,
});

const formatNumber = (value) => numberFormatter.format(value ?? 0);
const formatCurrency = (value) => currencyFormatter.format(value ?? 0);
const formatPercent = (value) =>
    percentFormatter.format(Number.isFinite(value) ? value : 0);
const formatMonth = (value) => {
    if (!value) {
        return '';
    }

    const [year, month] = value.split('-');
    const date = new Date(Number(year), Number(month) - 1);

    return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
};

const Home = () => {
    const currentUser = useSelector((state) => state.auth.currentUser);
    const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);

    const [summary, setSummary] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        let isMounted = true;

        const fetchSummary = async () => {
            setIsSummaryLoading(true);
            setSummaryError('');

            try {
                const { data } = await http.get('/dashboard/summary');

                if (isMounted) {
                    setSummary(data);
                }
            } catch (error) {
                if (isMounted) {
                    setSummaryError('Не удалось загрузить сводку. Попробуйте обновить страницу.');
                }
            } finally {
                if (isMounted) {
                    setIsSummaryLoading(false);
                }
            }
        };

        fetchSummary();

        return () => {
            isMounted = false;
        };
    }, [currentUser]);

    const stats = useMemo(() => {
        if (!summary) {
            return [
                { title: 'Заметки', value: '—' },
                { title: 'Рабочие доски', value: '—' },
                { title: 'Всего задач', value: '—' },
                { title: 'Важных задач', value: '—' },
                { title: 'Транзакций за месяц', value: '—' },
                { title: 'Доход за месяц', value: '—' },
                { title: 'Расход за месяц', value: '—' },
                { title: 'Чистый итог', value: '—' },
            ];
        }

        const finance = summary.finance || {};
        const net = finance.net ?? 0;

        return [
            { title: 'Заметки', value: formatNumber(summary.notes_count) },
            { title: 'Рабочие доски', value: formatNumber(summary.boards_count) },
            { title: 'Всего задач', value: formatNumber(summary.tasks?.total) },
            { title: 'Важных задач', value: formatNumber(summary.tasks?.important) },
            { title: 'Транзакций за месяц', value: formatNumber(finance.transactions_count) },
            { title: 'Доход за месяц', value: formatCurrency(finance.income) },
            { title: 'Расход за месяц', value: formatCurrency(finance.expense) },
            {
                title: 'Чистый итог',
                value: formatCurrency(net),
                color: net >= 0 ? 'success.main' : 'error.main',
            },
        ];
    }, [summary]);

    if (isAuthLoading || !currentUser) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    const gradientBackground = (theme) =>
        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

    const tasks = summary?.tasks || { total: 0, important: 0 };
    const finance = summary?.finance || {
        month: '',
        income: 0,
        expense: 0,
        net: 0,
        transactions_count: 0,
        top_expense_categories: [],
    };
    const topExpenseCategories = finance.top_expense_categories || [];
    const financePeriod = formatMonth(finance.month) || 'текущий период';
    const importantShare = tasks.total ? tasks.important / tasks.total : 0;

    return (
        <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            <Card
                sx={{
                    background: gradientBackground,
                    color: '#fff',
                    p: { xs: 3, sm: 4 },
                    mb: 4,
                    borderRadius: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
                    <Avatar
                        alt={currentUser.name}
                        src={currentUser.avatar}
                        sx={{ width: 100, height: 100, border: '3px solid white' }}
                    />
                    <Box textAlign={{ xs: 'center', sm: 'left' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Добро пожаловать, {currentUser.name}!
                        </Typography>
                        <Typography variant="subtitle1">
                            {currentUser.email} • Последний вход: {new Date().toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            </Card>

            {summaryError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {summaryError}
                </Alert>
            )}

            <Grid container spacing={2}>
                {stats.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} xl={3} key={`${item.title}-${index}`}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                },
                            }}
                        >
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="h4" color={item.color || 'primary'}>
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {isSummaryLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {summary && !isSummaryLoading && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Задачи
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Краткий статус по всем доскам
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Всего</Typography>
                                        <Typography fontWeight={600}>{formatNumber(tasks.total)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Важные</Typography>
                                        <Typography fontWeight={600} color="error.main">
                                            {formatNumber(tasks.important)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Доля важных</Typography>
                                        <Typography fontWeight={600} color="warning.main">
                                            {formatPercent(importantShare)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Финансы
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Сводка за {financePeriod}
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Доход</Typography>
                                        <Typography fontWeight={600} color="success.main">
                                            {formatCurrency(finance.income)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Расход</Typography>
                                        <Typography fontWeight={600} color="error.main">
                                            {formatCurrency(finance.expense)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Транзакций</Typography>
                                        <Typography fontWeight={600}>{formatNumber(finance.transactions_count)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography color="text.secondary">Чистый итог</Typography>
                                        <Typography
                                            fontWeight={600}
                                            color={(finance.net ?? 0) >= 0 ? 'success.main' : 'error.main'}
                                        >
                                            {formatCurrency(finance.net)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {topExpenseCategories.length > 0 ? (
                                    <Stack spacing={1.25} sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Топ-расходы по категориям
                                        </Typography>
                                        {topExpenseCategories.map((category) => (
                                            <Box
                                                key={`${category.category_id}-${category.title}`}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: category.color || '#999999',
                                                        }}
                                                    />
                                                    <Typography>{category.title}</Typography>
                                                </Box>
                                                <Typography fontWeight={600}>{formatCurrency(category.total)}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography sx={{ mt: 3 }} color="text.secondary">
                                        В этом месяце расходов пока не было.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Home;
