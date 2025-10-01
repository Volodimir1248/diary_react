import React, { useMemo } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/LockOutlined';

const isSystemCategory = (category) =>
    Boolean(
        category?.is_system ??
            category?.isSystem ??
            category?.system ??
            category?.is_default ??
            category?.isDefault
    );

const CategoryList = ({ title, categories, onEdit, onDelete, compact }) => {
    // Сортируем: сначала не-системные (false -> 0), затем системные (true -> 1)
    const sortedCategories = useMemo(
        () => [...(categories ?? [])].sort((a, b) => Number(isSystemCategory(a)) - Number(isSystemCategory(b))),
        [categories]
    );

    return (
        <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
            <Stack
                direction="row"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
            >
                <Typography variant="subtitle1">{title}</Typography>
                <Chip label={`${categories.length}`} size="small" color="primary" />
            </Stack>
            {categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Категории пока не добавлены.
                </Typography>
            ) : (
                <List dense disablePadding={compact}>
                    {sortedCategories.map((category) => {
                        const system = isSystemCategory(category);

                        return (
                            <ListItem
                                key={category.id}
                                sx={{
                                    borderRadius: 1,
                                    mb: compact ? 1.5 : 1,
                                    '&:last-of-type': { mb: 0 },
                                    border: '1px solid',
                                    borderColor: (theme) => theme.palette.divider,
                                    px: compact ? 1.5 : 2,
                                    py: compact ? 1.25 : 1,
                                }}
                                secondaryAction={
                                    !compact && !system ? (
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Редактировать">
                                                <span>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        size="small"
                                                        onClick={() => onEdit?.(category)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Удалить" placement="top">
                                                <span>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => onDelete?.(category)}
                                                        sx={{ color: (theme) => theme.palette.error.main }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Stack>
                                    ) : undefined
                                }
                            >
                                <ListItemAvatar>
                                    <Box
                                        sx={{
                                            width: compact ? 28 : 32,
                                            height: compact ? 28 : 32,
                                            borderRadius: '50%',
                                            backgroundColor: category.color || '#9e9e9e',
                                            border: '2px solid rgba(0,0,0,0.08)',
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Stack
                                            direction={compact ? 'column' : 'row'}
                                            alignItems={compact ? 'flex-start' : 'center'}
                                            justifyContent={compact ? 'flex-start' : 'space-between'}
                                            spacing={compact ? 0.5 : 1}
                                        >
                                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                {category.title}
                                            </Typography>
                                            {system && (
                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    icon={<LockIcon fontSize="inherit" />}
                                                    label="Системная"
                                                />
                                            )}
                                        </Stack>
                                    }
                                />
                                {compact && !system && (
                                    <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                                        <Tooltip title="Редактировать">
                                            <span>
                                                <IconButton
                                                    aria-label="edit"
                                                    size="small"
                                                    onClick={() => onEdit?.(category)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Удалить" placement="top">
                                            <span>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => onDelete?.(category)}
                                                    sx={{ color: (theme) => theme.palette.error.main }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Stack>
                                )}
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};

const CategoryManagerDialog = ({
    open,
    onClose,
    categories = [],
    loading,
    onCreate,
    onEdit,
    onDelete,
}) => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    const { expenseCategories, incomeCategories } = useMemo(() => {
        const expense = categories.filter((item) => item.type === 'expense');
        const income = categories.filter((item) => item.type === 'income');
        return { expenseCategories: expense, incomeCategories: income };
    }, [categories]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={isMdDown ? 'sm' : 'md'}
            disableEnforceFocus
            PaperProps={{
                sx: {
                    m: { xs: 1.5, sm: 2.5 },
                    width: { xs: 'calc(100% - 24px)', sm: 'auto' },
                },
            }}
        >
            <DialogTitle sx={{ pr: isSmDown ? 4 : undefined }}>Управление категориями</DialogTitle>
            <DialogContent
                dividers
                sx={{
                    position: 'relative',
                    minHeight: 220,
                    px: { xs: 2.5, sm: 3 },
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 2.5, md: 3 }}
                    alignItems="stretch"
                >
                    <CategoryList
                        title="Расходы"
                        categories={expenseCategories}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        compact={isMdDown}
                    />
                    <CategoryList
                        title="Доходы"
                        categories={incomeCategories}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        compact={isMdDown}
                    />
                </Stack>
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <CircularProgress size={36} />
                    </Box>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Системные категории помечены замком и недоступны для редактирования или удаления.
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    py: 2,
                    flexDirection: isSmDown ? 'column-reverse' : 'row',
                    alignItems: isSmDown ? 'stretch' : 'center',
                    gap: isSmDown ? 1.5 : 1,
                }}
            >
                <Button onClick={onClose} color="inherit" fullWidth={isSmDown}>
                    Закрыть
                </Button>
                <Button variant="contained" onClick={onCreate} fullWidth={isSmDown}>
                    + Новая категория
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryManagerDialog;
