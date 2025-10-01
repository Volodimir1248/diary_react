import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

const defaultValues = {
    title: '',
    type: 'expense',
    color: '#5E81F4',
};

const CategoryFormDialog = ({ open, onClose, onSubmit, category }) => {
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setValues({
                title: category.title || '',
                type: category.type || 'expense',
                color: category.color || '#5E81F4',
            });
        } else {
            setValues(defaultValues);
        }
        setErrors({});
    }, [category, open]);

    const dialogTitle = useMemo(
        () => (category ? 'Редактировать категорию' : 'Новая категория'),
        [category]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!values.title.trim()) {
            nextErrors.title = 'Введите название категории';
        }
        if (!['expense', 'income'].includes(values.type)) {
            nextErrors.type = 'Выберите тип';
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        await onSubmit?.({ ...values });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" component="form" onSubmit={handleSubmit}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        autoFocus
                        required
                        name="title"
                        label="Название"
                        value={values.title}
                        onChange={handleChange}
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                    />
                    <TextField
                        select
                        required
                        name="type"
                        label="Тип"
                        value={values.type}
                        onChange={handleChange}
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                    >
                        <MenuItem value="expense">Расход</MenuItem>
                        <MenuItem value="income">Доход</MenuItem>
                    </TextField>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <TextField
                            type="color"
                            name="color"
                            label="Цвет"
                            value={values.color}
                            onChange={handleChange}
                            sx={{ width: 120 }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Цвет используется в диаграммах и списках.
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Отмена
                </Button>
                <Button type="submit" variant="contained">
                    {category ? 'Сохранить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryFormDialog;
