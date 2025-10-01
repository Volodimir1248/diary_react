import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { alpha, Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';

const DEFAULT_COLORS = [
    '#42a5f5',
    '#66bb6a',
    '#ff7043',
    '#ab47bc',
    '#26a69a',
    '#ef5350',
    '#29b6f6',
    '#ffee58',
    '#8d6e63',
];

const CategoryDonutChart = ({ data = [] }) => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const numberFormatter = useMemo(
        () =>
            new Intl.NumberFormat('ru-RU', {
                maximumFractionDigits: 0,
            }),
        []
    );

    const segments = useMemo(() => {
        const items = Array.isArray(data) ? data : [];
        return items.map((item, index) => ({
            key:
                item.id ??
                item.category_id ??
                (item.title ? `${item.title}-${index}` : `category-${index}`),
            title: item.title || 'Без категории',
            value: Number(item.total) || 0,
            color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        }));
    }, [data]);

    const [hiddenKeys, setHiddenKeys] = useState([]);
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        setHiddenKeys((prev) => prev.filter((key) => segments.some((segment) => segment.key === key)));
    }, [segments]);

    const visibleSegments = useMemo(
        () => segments.filter((segment) => !hiddenKeys.includes(segment.key)),
        [segments, hiddenKeys]
    );

    useEffect(() => {
        if (activeKey && !visibleSegments.some((segment) => segment.key === activeKey)) {
            setActiveKey(null);
        }
    }, [activeKey, visibleSegments]);

    const totalVisible = useMemo(
        () => visibleSegments.reduce((sum, segment) => sum + segment.value, 0),
        [visibleSegments]
    );

    const totalAll = useMemo(() => segments.reduce((sum, segment) => sum + segment.value, 0), [segments]);

    const toggleSegment = useCallback((key) => {
        setHiddenKeys((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    }, []);

    const activeSegment = useMemo(
        () => visibleSegments.find((segment) => segment.key === activeKey) ?? null,
        [activeKey, visibleSegments]
    );

    const donutSizing = useMemo(() => {
        if (isMdUp) {
            return {
                innerRadius: 110,
                outerRadius: 150,
                cornerRadius: 0,
                activeOuterOffset: 12,
                activeInnerOffset: 10,
            };
        }

        if (isSmUp) {
            return {
                innerRadius: 96,
                outerRadius: 136,
                cornerRadius: 0,
                activeOuterOffset: 10,
                activeInnerOffset: 8,
            };
        }

        return {
            innerRadius: 78,
            outerRadius: 112,
            cornerRadius: 0,
            activeOuterOffset: 8,
            activeInnerOffset: 6,
        };
    }, [isMdUp, isSmUp]);

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || payload.length === 0) {
            return null;
        }

        const entry = payload[0];
        const segment = entry?.payload;
        if (!segment) {
            return null;
        }

        const percentOfVisible = totalVisible > 0 ? (segment.value / totalVisible) * 100 : 0;
        const percentOfAll = totalAll > 0 ? (segment.value / totalAll) * 100 : 0;

        return (
            <Box
                sx={{
                    p: 2,
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.background.paper
                            : theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: theme.shadows[8],
                    border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                    minWidth: 220,
                    backdropFilter: 'none',
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {segment.title}
                </Typography>
                <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            Сумма
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {numberFormatter.format(segment.value)} ₽
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            Доля выбранных
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {percentOfVisible.toFixed(1)}%
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            Доля всех расходов
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {percentOfAll.toFixed(1)}%
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        );
    };

    if (segments.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Нет данных по категориям за выбранный период.
            </Typography>
        );
    }

    const centerTitle = activeSegment
        ? activeSegment.title
        : visibleSegments.length === segments.length
        ? 'Все категории'
        : 'Выбранные категории';

    const centerValue = activeSegment
        ? `${numberFormatter.format(activeSegment.value)} ₽`
        : `${numberFormatter.format(totalVisible)} ₽`;

    let centerSubtitle = '';
    if (activeSegment) {
        const percentOfVisible = totalVisible > 0 ? (activeSegment.value / totalVisible) * 100 : 0;
        centerSubtitle = `${percentOfVisible.toFixed(1)}% выбранных | ${(
            totalAll > 0 ? (activeSegment.value / totalAll) * 100 : 0
        ).toFixed(1)}% всех`;
    } else if (visibleSegments.length === 0) {
        centerSubtitle = 'Все категории скрыты';
    } else if (visibleSegments.length === segments.length) {
        centerSubtitle = 'Показаны все категории';
    } else {
        centerSubtitle = `Показано ${visibleSegments.length} из ${segments.length}`;
    }

    const activeIndex = activeSegment
        ? visibleSegments.findIndex((segment) => segment.key === activeSegment.key)
        : -1;

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2.5, sm: 3, md: 4 }}
            alignItems={{ xs: 'stretch', md: 'flex-start' }}
            sx={{ width: '100%' }}
        >
            <Box
                sx={{
                    flexBasis: { xs: '100%', md: '50%' },
                    flexGrow: 1,
                    minWidth: 0,
                }}
            >
                {visibleSegments.length > 0 ? (
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: 280, sm: 320, md: 360 },
                        }}
                    >
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={visibleSegments}
                                    dataKey="value"
                                    nameKey="title"
                                    innerRadius={donutSizing.innerRadius}
                                    outerRadius={donutSizing.outerRadius}
                                    paddingAngle={visibleSegments.length > 1 ? (isSmUp ? 3 : 4) : 0}
                                    cornerRadius={donutSizing.cornerRadius}
                                    strokeWidth={2}
                                    stroke={alpha(theme.palette.background.paper, 0.85)}
                                    activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                                    activeShape={(props) => (
                                        <Sector
                                            {...props}
                                            outerRadius={props.outerRadius + donutSizing.activeOuterOffset}
                                            innerRadius={Math.max(
                                                props.innerRadius - donutSizing.activeInnerOffset,
                                                0
                                            )}
                                        />
                                    )}
                                    onMouseEnter={(_, index) =>
                                        setActiveKey(visibleSegments[index] ? visibleSegments[index].key : null)
                                    }
                                    onMouseLeave={() => setActiveKey(null)}
                                >
                                    {visibleSegments.map((segment) => (
                                        <Cell
                                            key={segment.key}
                                            fill={segment.color}
                                            fillOpacity={activeKey && activeKey !== segment.key ? 0.35 : 0.98}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: alpha(theme.palette.text.primary, 0.08) }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                px: 2,
                            }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                {centerTitle}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {centerValue}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {centerSubtitle}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            height: { xs: 300, sm: 320, md: 360 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            color: 'text.secondary',
                            textAlign: 'center',
                            px: 3,
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Все категории скрыты
                        </Typography>
                        <Typography variant="body2">
                            Выберите категории в списке справа, чтобы увидеть их на диаграмме.
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    flexBasis: { xs: '100%', md: '50%' },
                    flexGrow: 1,
                    minWidth: 0,
                    maxWidth: '100%',
                }}
            >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Категории
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, minmax(0, 1fr))',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(2, minmax(0, 1fr))',
                        },
                        columnGap: { xs: 1, sm: 1.25, md: 1.5 },
                        rowGap: { xs: 1, sm: 1.25 },
                        overflowY: 'auto',
                        pr: { xs: 0.5, sm: 0.75, md: 1 },
                        pb: 0.5,
                    }}
                >
                    {segments.map((segment) => {
                        const isHidden = hiddenKeys.includes(segment.key);

                        return (
                            <Box
                                key={segment.key}
                                component="button"
                                type="button"
                                onClick={() => toggleSegment(segment.key)}
                                onMouseEnter={() => setActiveKey(segment.key)}
                                onMouseLeave={() => setActiveKey(null)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    width: '100%',
                                    border: 'none',
                                    textAlign: 'left',
                                    padding: { xs: '10px 12px', sm: '12px 14px' },
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    backgroundColor: isHidden
                                        ? alpha(theme.palette.background.paper, 0.35)
                                        : alpha(segment.color, 0.15),
                                    color: isHidden
                                        ? alpha(theme.palette.text.primary, 0.6)
                                        : theme.palette.text.primary,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: isHidden
                                            ? alpha(theme.palette.background.paper, 0.55)
                                            : alpha(segment.color, 0.22),
                                    },
                                    '&:focus-visible': {
                                        outline: `2px solid ${alpha(segment.color, 0.5)}`,
                                        outlineOffset: 2,
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: segment.color,
                                            opacity: isHidden ? 0.3 : 1,
                                        }}
                                    />
                                    <Stack spacing={0.25}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, fontSize: { xs: 12.5, sm: 13.5 } }}
                                        >
                                            {segment.title}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack spacing={0.25} alignItems="flex-end">
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600, fontSize: { xs: 12.5, sm: 13.5 } }}
                                    >
                                        {numberFormatter.format(segment.value)} ₽
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: 11, sm: 11.5 } }}
                                    >
                                    </Typography>
                                </Stack>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Stack>
    );
};

export default CategoryDonutChart;
