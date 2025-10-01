import React, { useMemo, useState } from 'react';
import { alpha, Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const MonthlyBarChart = ({ data = [] }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [hiddenSeries, setHiddenSeries] = useState([]);

    const { preparedData, numberFormatter } = useMemo(() => {
        const months = Array.isArray(data) && data.length ? data : [];
        const prepared = months.map((item, index) => ({
            month: item.month || index + 1,
            label: monthLabels[(item.month || index + 1) - 1] || `М${index + 1}`,
            income: Number(item.income) || 0,
            expense: Number(item.expense) || 0,
        }));

        return {
            preparedData: prepared,
            numberFormatter: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }),
        };
    }, [data]);

    const toggleSeries = (key) => {
        setHiddenSeries((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    };

    if (!preparedData.length) {
        return (
            <Typography variant="body2" color="text.secondary">
                Нет данных по месяцам за выбранный год.
            </Typography>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || payload.length === 0) {
            return null;
        }

        const datum = payload[0]?.payload;
        if (!datum) {
            return null;
        }

        const incomeEntry = payload.find((entry) => entry.dataKey === 'income');
        const expenseEntry = payload.find((entry) => entry.dataKey === 'expense');

        return (
            <Box
                sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[8],
                    border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
                    minWidth: 220,
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {monthLabels[(datum.month || 1) - 1] || datum.label}
                </Typography>
                <Stack spacing={0.75}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: alpha(theme.palette.success.main, 0.8),
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Доходы
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                            {numberFormatter.format(incomeEntry ? incomeEntry.value : datum.income)} ₽
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: alpha(theme.palette.error.main, 0.8),
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Расходы
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                            {numberFormatter.format(expenseEntry ? expenseEntry.value : datum.expense)} ₽
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        );
    };

    const LegendContent = () => (
        <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            spacing={isSmallScreen ? 1 : 1.5}
            flexWrap={isSmallScreen ? 'nowrap' : 'wrap'}
            sx={{ px: 1, pb: 1, alignItems: isSmallScreen ? 'flex-start' : 'center' }}
        >
            {[
                { key: 'income', label: 'Доходы', color: theme.palette.success.main },
                { key: 'expense', label: 'Расходы', color: theme.palette.error.main },
            ].map((series) => {
                const isHidden = hiddenSeries.includes(series.key);
                return (
                    <Box
                        key={series.key}
                        component="button"
                        type="button"
                        onClick={() => toggleSeries(series.key)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: 0.5,
                            borderRadius: 20,
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: isHidden
                                ? alpha(theme.palette.text.primary, 0.45)
                                : theme.palette.text.primary,
                            opacity: isHidden ? 0.55 : 1,
                            width: isSmallScreen ? '100%' : 'auto',
                            justifyContent: isSmallScreen ? 'flex-start' : 'center',
                            '&:hover': {
                                backgroundColor: alpha(series.color, 0.12),
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${alpha(series.color, 0.5)}`,
                                outlineOffset: 2,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: series.color,
                                opacity: isHidden ? 0.4 : 1,
                                boxShadow: `0 0 0 2px ${alpha(series.color, 0.2)}`,
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {series.label}
                        </Typography>
                    </Box>
                );
            })}
        </Stack>
    );

    return (
        <Box sx={{ width: '100%', height: { xs: 300, sm: 340, md: 360 } }}>
            <ResponsiveContainer>
                <BarChart
                    data={preparedData}
                    margin={
                        isSmallScreen
                            ? { top: 28, right: 16, bottom: 8, left: 0 }
                            : { top: 36, right: 24, bottom: 16, left: 8 }
                    }
                    barCategoryGap={isSmallScreen ? 24 : 32}
                >
                    <defs>
                        <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme.palette.success.light} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={alpha(theme.palette.error.main, 0.9)} />
                            <stop offset="100%" stopColor={alpha(theme.palette.error.dark, 0.8)} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="4 6"
                        stroke={alpha(theme.palette.text.primary, 0.12)}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={{ stroke: alpha(theme.palette.text.primary, 0.12) }}
                        tick={{ fill: alpha(theme.palette.text.primary, 0.75), fontSize: isSmallScreen ? 11 : 12 }}
                        height={isSmallScreen ? 28 : 32}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={{ stroke: alpha(theme.palette.text.primary, 0.12) }}
                        tick={{ fill: alpha(theme.palette.text.primary, 0.75), fontSize: isSmallScreen ? 11 : 12 }}
                        tickFormatter={(value) => numberFormatter.format(value)}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: alpha(theme.palette.primary.main, 0.08) }}
                        content={<CustomTooltip />}
                    />
                    <Legend
                        verticalAlign="top"
                        align="left"
                        height={isSmallScreen ? 72 : 56}
                        content={<LegendContent />}
                    />
                    {!hiddenSeries.includes('income') && (
                        <Bar
                            dataKey="income"
                            name="Доходы"
                            fill="url(#incomeBar)"
                            barSize={isSmallScreen ? 18 : 20}
                        />
                    )}
                    {!hiddenSeries.includes('expense') && (
                        <Bar
                            dataKey="expense"
                            name="Расходы"
                            fill="url(#expenseBar)"
                            barSize={isSmallScreen ? 18 : 20}
                        />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default MonthlyBarChart;
