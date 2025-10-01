import React, { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

const MAX_PREVIEW_ITEMS = 6;

const createPreviewLabel = (category) => (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
            component="span"
            sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: category.color || '#9e9e9e',
                border: '1px solid rgba(0,0,0,0.08)',
            }}
        />
        <Box component="span" sx={{ display: 'inline-block', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {category.title}
        </Box>
    </Box>
);

const FILTER_LABELS = {
    all: 'Все категории',
    expense: 'Расходы',
    income: 'Доходы',
};

const FILTER_EMPTY_MESSAGES = {
    all: 'Категории пока не добавлены. Нажмите «Управление категориями», чтобы создать первую.',
    expense: 'Категории расходов пока не добавлены. Нажмите «Управление категориями», чтобы создать первую.',
    income: 'Категории доходов пока не добавлены. Нажмите «Управление категориями», чтобы создать первую.',
};

const CategorySection = ({ categories = [], loading, onManage }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const { expense, income, expenseCount, incomeCount, totalCount } = useMemo(() => {
        const expense = [];
        const income = [];

        categories.forEach((category) => {
            if (category.type === 'expense') {
                expense.push(category);
            } else if (category.type === 'income') {
                income.push(category);
            }
        });

        return {
            expense,
            income,
            expenseCount: expense.length,
            incomeCount: income.length,
            totalCount: categories.length,
        };
    }, [categories]);

    const filteredCategories = useMemo(() => {
        if (activeFilter === 'expense') {
            return expense;
        }

        if (activeFilter === 'income') {
            return income;
        }

        return categories;
    }, [activeFilter, categories, expense, income]);

    const previewCategories = useMemo(
        () => filteredCategories.slice(0, MAX_PREVIEW_ITEMS),
        [filteredCategories],
    );

    const remainingCount = filteredCategories.length - previewCategories.length;

    const handleFilterSelect = (nextFilter) => {
        setActiveFilter(nextFilter);
    };

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={2}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 2, md: 3 }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">Категории</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Управляйте списком категорий доходов и расходов, чтобы быстрее находить нужные операции.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                        {[{
                            key: 'all',
                            label: `Всего: ${totalCount}`,
                        },
                        {
                            key: 'expense',
                            label: `Расходы: ${expenseCount}`,
                        },
                        {
                            key: 'income',
                            label: `Доходы: ${incomeCount}`,
                        }].map((option) => (
                            <Chip
                                key={option.key}
                                label={option.label}
                                size="small"
                                clickable
                                onClick={() => handleFilterSelect(option.key)}
                                color={activeFilter === option.key ? 'primary' : 'default'}
                                variant={activeFilter === option.key ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Stack>
                </Box>
                <Button
                    variant="contained"
                    onClick={onManage}
                    sx={{ alignSelf: { xs: 'stretch', md: 'center' }, minWidth: { md: 200 } }}
                >
                    Управление категориями
                </Button>
            </Stack>

            <Box sx={{ mt: 3 }}>
                {loading && !categories.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : filteredCategories.length ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={FILTER_LABELS[activeFilter]} color="primary" variant="outlined" />
                        {previewCategories.map((category) => (
                            <Chip
                                key={category.id}
                                size="small"
                                label={createPreviewLabel(category)}
                                sx={{
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: (theme) => theme.palette.divider,
                                    py: 0.5,
                                    px: 1,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
                                    '& .MuiChip-label': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 0.5,
                                    },
                                }}
                            />
                        ))}
                        {remainingCount > 0 && (
                            <Chip
                                size="small"
                                label={`+${remainingCount}`}
                                variant="outlined"
                                sx={{ borderStyle: 'dashed' }}
                            />
                        )}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        {FILTER_EMPTY_MESSAGES[activeFilter]}
                    </Typography>
                )}
                {remainingCount > 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Полный список доступен в менеджере категорий.
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default CategorySection;
