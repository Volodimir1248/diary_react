import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const defaultTask = {
    title: '',
    description: '',
    funnelId: '',
    priorityId: '2',
    reminderAt: '',
};

const formatDateTimeInputValue = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const pad = (number) => String(number).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateTimeDisplayValue = (value) => {
    if (!value) {
        return 'Не установлено';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' && value.trim() ? value : 'Не установлено';
    }

    return date.toLocaleString();
};

const TaskModal = ({ open, onClose, onSubmit, funnels = [], priorities = [], initialData = {}, defaultFunnelId }) => {
    const [formState, setFormState] = useState(defaultTask);
    const [initialValues, setInitialValues] = useState(defaultTask);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (open) {
            const priorityFromData =
                initialData?.priority || initialData?.priorityId || initialData?.priority?.id || defaultTask.priorityId;
            const reminderFromData = initialData?.reminder_at || initialData?.reminderAt || '';
            const initialFormValues = {
                title: initialData?.title ? initialData.title : '',
                description: initialData?.description ? initialData.description : '',
                funnelId: initialData?.funnel_id || initialData?.funnelId || defaultFunnelId || '',
                priorityId: priorityFromData ? String(priorityFromData) : defaultTask.priorityId,
                reminderAt: formatDateTimeInputValue(reminderFromData),
            };
            setFormState(initialFormValues);
            setInitialValues(initialFormValues);
            setIsEditing(!initialData?.id);
        }
    }, [open, initialData, defaultFunnelId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!isEditing) {
            return;
        }

        const funnelId = formState.funnelId || defaultFunnelId || '';

        if (!formState.title.trim() || !funnelId) {
            return;
        }

        const priorityId = formState.priorityId || defaultTask.priorityId;

        onSubmit({
            title: formState.title,
            description: formState.description,
            funnelId,
            priorityId,
            reminderAt: formState.reminderAt,
        });
    };

    const handleClose = () => {
        setFormState(defaultTask);
        setInitialValues(defaultTask);
        setIsEditing(false);
        onClose();
    };

    const handleCancel = () => {
        if (initialData?.id && isEditing) {
            setFormState(initialValues);
            setIsEditing(false);
            return;
        }

        handleClose();
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const funnelName = useMemo(() => {
        const funnel = funnels.find((item) => String(item.id) === String(formState.funnelId));
        return funnel?.title || 'Не выбрана';
    }, [funnels, formState.funnelId]);

    const priorityTitle = useMemo(() => {
        const currentPriorityId = formState.priorityId || defaultTask.priorityId;
        const priority = priorities.find((item) => String(item.id) === String(currentPriorityId));
        if (priority) {
            return priority.title || priority.name || priority.label || `Приоритет ${currentPriorityId}`;
        }

        if (initialData?.priority) {
            return initialData.priority.title || initialData.priority.name || `Приоритет ${currentPriorityId}`;
        }

        return `Приоритет ${currentPriorityId}`;
    }, [formState.priorityId, priorities, initialData]);

    const reminderDisplayValue = useMemo(() => {
        const rawReminder = initialData?.reminder_at || initialData?.reminderAt;
        return formatDateTimeDisplayValue(rawReminder || formState.reminderAt);
    }, [formState.reminderAt, initialData]);

    const isExistingTask = Boolean(initialData?.id);
    const cancelButtonLabel = isEditing ? 'Отмена' : 'Закрыть';

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ px:{ xs: 2, sm: 3 }, py: 2 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
                        width='100%'
                    >
                        <Typography component="span" variant="h6">
                            {isExistingTask ? 'Просмотр задачи' : 'Новая задача'}
                        </Typography>
                        {isExistingTask && !isEditing && (
                            <IconButton size="small" onClick={handleStartEdit}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                        {isExistingTask && isEditing && (
                            <IconButton size="small" onClick={handleCancel}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>
                    <Typography
                        my={{ xs: 1, sm: 2 }}
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        {funnelName}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ px: 3, py: 2, '@media(max-width: 600px)': {px: 2} }}>
                {isEditing ? (
                    <Stack spacing={2}>
                        <TextField
                            label="Название задачи"
                            fullWidth
                            variant="outlined"
                            name="title"
                            value={formState.title}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Описание"
                            fullWidth
                            variant="outlined"
                            multiline
                            minRows={3}
                            name="description"
                            value={formState.description}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="task-priority-select-label">Приоритет</InputLabel>
                            <Select
                                labelId="task-priority-select-label"
                                label="Приоритет"
                                name="priorityId"
                                value={formState.priorityId || defaultTask.priorityId}
                                onChange={handleChange}
                            >
                                {priorities.length === 0 && (
                                    <MenuItem value={defaultTask.priorityId} disabled>
                                        Нет доступных приоритетов
                                    </MenuItem>
                                )}
                                {priorities.map((priority) => (
                                    <MenuItem key={priority.id} value={String(priority.id)}>
                                        {priority.title || priority.name || priority.label || priority.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Напоминание"
                            fullWidth
                            variant="outlined"
                            type="datetime-local"
                            name="reminderAt"
                            value={formState.reminderAt}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        <Stack spacing={0.5}>
                            <Typography variant="overline" color="text.secondary">
                                Название задачи
                            </Typography>
                            <Typography variant="h6" color="text.primary">
                                {formState.title || 'Без названия'}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography variant="overline" color="text.secondary">
                                Описание
                            </Typography>
                            <Typography
                                variant="body1"
                                color={formState.description ? 'text.primary' : 'text.secondary'}
                                sx={{ whiteSpace: 'pre-wrap' }}
                            >
                                {formState.description || 'Нет описания'}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography variant="overline" color="text.secondary">
                                Приоритет
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {priorityTitle}
                            </Typography>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography variant="overline" color="text.secondary">
                                Напоминание
                            </Typography>
                            <Typography
                                variant="body1"
                                color={reminderDisplayValue === 'Не установлено' ? 'text.secondary' : 'text.primary'}
                            >
                                {reminderDisplayValue}
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>{cancelButtonLabel}</Button>
                {isEditing && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formState.title.trim() || !(formState.funnelId || defaultFunnelId)}
                    >
                        {isExistingTask ? 'Сохранить' : 'Добавить'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;
