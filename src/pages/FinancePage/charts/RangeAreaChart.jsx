import React, { useCallback, useMemo, useState } from 'react';
import { alpha, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const RangeAreaChart = ({ data = [] }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const numberFormatter = useMemo(
        () =>
            new Intl.NumberFormat('ru-RU', {
                maximumFractionDigits: 0,
            }),
        []
    );

    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat('ru-RU', {
                day: '2-digit',
                month: 'short',
            }),
        []
    );

    const longDateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        []
    );

    const chartData = useMemo(() => {
        const items = Array.isArray(data) ? data : [];
        return items.map((item, index) => {
            const income = Number(item?.income) || 0;
            const expense = Number(item?.expense) || 0;
            let label = item?.date;
            let fullLabel = label;

            if (label) {
                const parsedDate = new Date(label);
                if (!Number.isNaN(parsedDate.getTime())) {
                    fullLabel = longDateFormatter.format(parsedDate);
                    label = dateFormatter.format(parsedDate);
                } else if (typeof label === 'string') {
                    fullLabel = label;
                    label = label.length > 12 ? `${label.slice(0, 10)}…` : label;
                } else {
                    label = String(label);
                    fullLabel = label;
                }
            } else {
                label = `${index + 1}`;
                fullLabel = `Запись ${index + 1}`;
            }

            return {
                label,
                fullLabel,
                income,
                expense,
            };
        });
    }, [data, dateFormatter, longDateFormatter]);

    const [hiddenSeries, setHiddenSeries] = useState([]);

    const toggleSeries = useCallback((key) => {
        setHiddenSeries((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
        );
    }, []);

    const seriesConfig = useMemo(
        () => [
            {
                key: 'income',
                label: 'Доходы',
                color: theme.palette.success.main,
            },
            {
                key: 'expense',
                label: 'Расходы',
                color: theme.palette.error.main,
            },
        ],
        [theme.palette.error.main, theme.palette.success.main]
    );

    const hasData = chartData.length > 0;

    const LegendContent = () => (
        <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            spacing={isSmallScreen ? 1 : 1.5}
            flexWrap={isSmallScreen ? 'nowrap' : 'wrap'}
            sx={{ px: 1, pb: 1, alignItems: isSmallScreen ? 'flex-start' : 'center' }}
        >
            {seriesConfig.map((series) => {
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

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || payload.length === 0) {
            return null;
        }

        const datum = payload[0]?.payload;
        if (!datum) {
            return null;
        }

        const incomeEntry = payload.find((item) => item.dataKey === 'income');
        const expenseEntry = payload.find((item) => item.dataKey === 'expense');

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
                    {datum.fullLabel}
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

    if (!hasData) {
        return (
            <Typography variant="body2" color="text.secondary">
                Нет данных для выбранного периода.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', height: { xs: 300, sm: 340, md: 360 } }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={
                        isSmallScreen
                            ? { top: 28, right: 16, bottom: 8, left: 0 }
                            : { top: 36, right: 24, bottom: 16, left: 8 }
                    }
                    barCategoryGap={isSmallScreen ? 24 : 32}
                >
                    <defs>
                        <linearGradient id="dailyIncomeBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme.palette.success.light} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="dailyExpenseBar" x1="0" y1="0" x2="0" y2="1">
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
                        tick={{
                            fill: alpha(theme.palette.text.primary, 0.75),
                            fontSize: isSmallScreen ? 11 : 12,
                        }}
                        height={isSmallScreen ? 28 : 32}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={{ stroke: alpha(theme.palette.text.primary, 0.12) }}
                        tick={{
                            fill: alpha(theme.palette.text.primary, 0.75),
                            fontSize: isSmallScreen ? 11 : 12,
                        }}
                        tickFormatter={(value) => numberFormatter.format(value)}
                        width={80}
                    />
                    <Tooltip cursor={{ fill: alpha(theme.palette.primary.main, 0.08) }} content={<CustomTooltip />} />
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
                            fill="url(#dailyIncomeBar)"
                            barSize={isSmallScreen ? 18 : 20}
                        />
                    )}
                    {!hiddenSeries.includes('expense') && (
                        <Bar
                            dataKey="expense"
                            name="Расходы"
                            fill="url(#dailyExpenseBar)"
                            barSize={isSmallScreen ? 18 : 20}
                        />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RangeAreaChart;
