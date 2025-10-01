import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import MonthlyBarChart from './charts/MonthlyBarChart';

const getCurrentYear = () => new Date().getFullYear();

const normalizeYear = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 1970 ? parsed : null;
};

const AnalyticsSection = ({
    monthlySummary,
    monthlySummaryLoading,
    onYearChange,
}) => {
    const initialYear = normalizeYear(monthlySummary?.year) ?? getCurrentYear();
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const manualYearSelectionRef = useRef(false);

    useEffect(() => {
        const normalized = normalizeYear(monthlySummary?.year);
        if (manualYearSelectionRef.current) {
            if (!monthlySummaryLoading) {
                manualYearSelectionRef.current = false;
                if (normalized != null && normalized !== selectedYear) {
                    setSelectedYear(normalized);
                }
            }
            return;
        }

        if (!monthlySummaryLoading && normalized != null && normalized !== selectedYear) {
            setSelectedYear(normalized);
        }
    }, [monthlySummary?.year, monthlySummaryLoading, selectedYear]);

    const handleYearSelect = (event) => {
        const value = Number(event.target.value);
        manualYearSelectionRef.current = true;
        setSelectedYear(value);
        onYearChange?.(value);
    };

    const years = useMemo(() => {
        const current = getCurrentYear();
        const list = Array.from({ length: 5 }).map((_, index) => current - index);
        if (selectedYear != null && !list.includes(selectedYear)) {
            list.push(selectedYear);
        }
        return list.sort((a, b) => b - a);
    }, [selectedYear]);

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={2}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
            >
                <Typography variant="h5">Аналитика</Typography>
                <TextField
                    select
                    size="small"
                    label="Год"
                    value={selectedYear}
                    onChange={handleYearSelect}
                    sx={{ width: 160 }}
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>
            <Box sx={{ mt: 3 }}>
                {monthlySummaryLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={36} />
                    </Box>
                ) : (
                    <MonthlyBarChart data={monthlySummary?.months || []} />
                )}
            </Box>
        </Paper>
    );
};

export default AnalyticsSection;
