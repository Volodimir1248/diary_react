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
} from '@mui/material';

const defaultValues = {
    type: 'expense',
    amount: '',
    category_id: '',
    occurred_at: new Date().toISOString().slice(0, 10),
    note: '',
};

const TransactionFormDialog = ({ open, onClose, onSubmit, onDelete, transaction, categories = [] }) => {
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (transaction) {
            setValues({
                type: transaction.type || 'expense',
                amount: transaction.amount != null ? String(transaction.amount) : '',
                category_id:
                    transaction.category_id != null
                        ? String(transaction.category_id)
                        : transaction.category?.id != null
                        ? String(transaction.category?.id)
                        : '',
                occurred_at: transaction.occurred_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
                note: transaction.note || '',
            });
        } else {
            setValues(defaultValues);
        }
        setErrors({});
    }, [transaction, open]);

    const dialogTitle = useMemo(
        () => (transaction ? 'Редактировать транзакцию' : 'Новая транзакция'),
        [transaction]
    );

    const filteredCategories = useMemo(
        () => categories.filter((item) => item.type === values.type),
        [categories, values.type]
    );

    useEffect(() => {
        if (values.type === 'expense' && !filteredCategories.find((item) => String(item.id) === String(values.category_id))) {
            setValues((prev) => ({ ...prev, category_id: '' }));
        }
    }, [filteredCategories, values.type, values.category_id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!['expense', 'income'].includes(values.type)) {
            nextErrors.type = 'Выберите тип';
        }
        const numericAmount = Number(values.amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            nextErrors.amount = 'Введите сумму больше нуля';
        }
        if (values.type === 'expense' && !values.category_id) {
            nextErrors.category_id = 'Для расхода выберите категорию';
        }
        if (!values.occurred_at) {
            nextErrors.occurred_at = 'Укажите дату';
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        await onSubmit?.({
            type: values.type,
            amount: Number(values.amount),
            category_id: values.category_id ? Number(values.category_id) : null,
            occurred_at: values.occurred_at,
            note: values.note || null,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" component="form" onSubmit={handleSubmit}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
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
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            required
                            name="amount"
                            label="Сумма"
                            type="number"
                            inputProps={{ step: '0.01', min: '0' }}
                            value={values.amount}
                            onChange={handleChange}
                            error={Boolean(errors.amount)}
                            helperText={errors.amount}
                        />
                        <TextField
                            fullWidth
                            required
                            name="occurred_at"
                            label="Дата"
                            type="date"
                            value={values.occurred_at}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            error={Boolean(errors.occurred_at)}
                            helperText={errors.occurred_at}
                        />
                    </Stack>
                    <TextField
                        select
                        name="category_id"
                        label="Категория"
                        value={values.category_id}
                        onChange={handleChange}
                        error={Boolean(errors.category_id)}
                        helperText={errors.category_id || (values.type === 'income' ? 'Необязательно для доходов' : '')}
                        disabled={!filteredCategories.length && values.type === 'expense'}
                    >
                        {values.type === 'income' && (
                            <MenuItem value="">
                                Без категории
                            </MenuItem>
                        )}
                        {filteredCategories.map((item) => (
                            <MenuItem key={item.id} value={String(item.id)}>
                                {item.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        name="note"
                        label="Комментарий"
                        value={values.note}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                {transaction && onDelete && (
                    <Button
                        type="button"
                        color="error"
                        onClick={async () => {
                            await onDelete(transaction);
                        }}
                        sx={{ mr: 'auto' }}
                    >
                        Удалить
                    </Button>
                )}
                <Button onClick={onClose} color="inherit">
                    Отмена
                </Button>
                <Button type="submit" variant="contained">
                    {transaction ? 'Сохранить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionFormDialog;
