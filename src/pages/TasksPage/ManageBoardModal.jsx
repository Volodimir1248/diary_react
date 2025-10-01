import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

const ManageBoardModal = ({
    open,
    board,
    funnels = [],
    onClose,
    onUpdateBoard,
    onCreateFunnel,
    onUpdateFunnel,
    onDeleteFunnel,
    onDeleteBoard,
}) => {
    const [title, setTitle] = useState('');
    const [isSavingBoard, setIsSavingBoard] = useState(false);
    const [isTitleDirty, setIsTitleDirty] = useState(false);
    const [newFunnelTitle, setNewFunnelTitle] = useState('');
    const [editingFunnelId, setEditingFunnelId] = useState(null);
    const [editingFunnelValue, setEditingFunnelValue] = useState('');
    const [pendingFunnelId, setPendingFunnelId] = useState(null);
    const [isCreatingFunnel, setIsCreatingFunnel] = useState(false);

    useEffect(() => {
        if (!open) {
            setTitle('');
            setNewFunnelTitle('');
            setEditingFunnelId(null);
            setEditingFunnelValue('');
            setPendingFunnelId(null);
            setIsCreatingFunnel(false);
            setIsTitleDirty(false);
            return;
        }

        if (!board) {
            setTitle('');
            setNewFunnelTitle('');
            setEditingFunnelId(null);
            setEditingFunnelValue('');
            setPendingFunnelId(null);
            setIsCreatingFunnel(false);
            setIsTitleDirty(false);
            return;
        }

        const nextTitle = board?.title;
        setTitle((prevTitle) => {
            if (nextTitle !== undefined) {
                return nextTitle ?? '';
            }
            return board ? prevTitle : '';
        });
        setNewFunnelTitle('');
        setEditingFunnelId(null);
        setEditingFunnelValue('');
        setPendingFunnelId(null);
        setIsCreatingFunnel(false);
        setIsTitleDirty(false);
    }, [open, board]);

    useEffect(() => {
        if (!open || isTitleDirty) {
            return;
        }

        if (board?.title !== undefined) {
            setTitle(board.title ?? '');
        }
    }, [board?.title, open, isTitleDirty]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setIsTitleDirty(true);
    };

    const sortedFunnels = useMemo(
        () =>
            funnels
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.id ?? 0) - (b.id ?? 0)),
        [funnels]
    );

    const handleSaveBoard = async () => {
        const trimmedTitle = title.trim();
        if (!board?.id || !trimmedTitle || trimmedTitle === (board.title || '').trim()) {
            return;
        }

        try {
            setIsSavingBoard(true);
            await onUpdateBoard?.(board.id, { title: trimmedTitle });
            setIsTitleDirty(false);
        } finally {
            setIsSavingBoard(false);
        }
    };

    const handleStartEditFunnel = (funnel) => {
        setEditingFunnelId(funnel.id);
        setEditingFunnelValue(funnel.title);
    };

    const handleCancelEditFunnel = () => {
        setEditingFunnelId(null);
        setEditingFunnelValue('');
    };

    const handleSaveFunnel = async () => {
        if (!editingFunnelId || !editingFunnelValue.trim()) {
            return;
        }

        try {
            setPendingFunnelId(editingFunnelId);
            await onUpdateFunnel?.(editingFunnelId, { title: editingFunnelValue.trim() });
            setEditingFunnelId(null);
            setEditingFunnelValue('');
        } finally {
            setPendingFunnelId(null);
        }
    };

    const handleDeleteFunnel = async (funnelId) => {
        if (!funnelId) return;
        if (!window.confirm('Удалить выбранную воронку?')) return;

        try {
            setPendingFunnelId(funnelId);
            await onDeleteFunnel?.(funnelId);
            if (editingFunnelId === funnelId) {
                handleCancelEditFunnel();
            }
        } finally {
            setPendingFunnelId(null);
        }
    };

    const handleCreateFunnel = async () => {
        if (!newFunnelTitle.trim() || !board?.id) {
            return;
        }

        try {
            setIsCreatingFunnel(true);
            await onCreateFunnel?.({ title: newFunnelTitle.trim() });
            setNewFunnelTitle('');
        } finally {
            setIsCreatingFunnel(false);
        }
    };

    const handleClose = () => {
        if (isSavingBoard || pendingFunnelId || isCreatingFunnel) {
            return;
        }
        onClose?.();
    };

    const handleDeleteBoard = () => {
        if (!board?.id) return;
        onDeleteBoard?.(board.id);
    };

    const isSaveDisabled =
        !title.trim() ||
        title.trim() === (board?.title || '').trim() ||
        isSavingBoard;

    const isAnyPending = Boolean(isSavingBoard || pendingFunnelId || isCreatingFunnel);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pr: 6 }}>Редактировать доску</DialogTitle>
            <IconButton
                aria-label="Закрыть"
                onClick={handleClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
                size="small"
            >
                <CloseIcon fontSize="small" />
            </IconButton>
            <DialogContent dividers>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                    <TextField
                        label="Название доски"
                        fullWidth
                        value={title}
                        onChange={handleTitleChange}
                        size="small"
                        disabled={isSavingBoard}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSaveBoard}
                        disabled={isSaveDisabled}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Сохранить
                    </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Воронки
                    </Typography>
                    {sortedFunnels.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Добавьте первую воронку, чтобы начать работу с задачами.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {sortedFunnels.map((funnel) => {
                                const isEditing = editingFunnelId === funnel.id;
                                const isPending = pendingFunnelId === funnel.id;

                                return (
                                    <ListItem
                                        key={funnel.id}
                                        disableGutters
                                        sx={{ py: 1, alignItems: 'flex-start', paddingRight: '72px' }}
                                        secondaryAction={
                                            isEditing ? (
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton
                                                        edge="end"
                                                        color="primary"
                                                        size="small"
                                                        onClick={handleSaveFunnel}
                                                        disabled={
                                                            isPending ||
                                                            !editingFunnelValue.trim()
                                                        }
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        size="small"
                                                        onClick={handleCancelEditFunnel}
                                                        disabled={isPending}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            ) : (
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton
                                                        edge="end"
                                                        size="small"
                                                        onClick={() => handleStartEditFunnel(funnel)}
                                                        disabled={Boolean(pendingFunnelId) || isCreatingFunnel}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteFunnel(funnel.id)}
                                                        disabled={isPending || Boolean(pendingFunnelId) || isCreatingFunnel}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            )
                                        }
                                    >
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={editingFunnelValue}
                                                onChange={(event) => setEditingFunnelValue(event.target.value)}
                                                disabled={Boolean(pendingFunnelId)}
                                            />
                                        ) : (
                                            <Typography variant="body1" color="text.primary">
                                                {funnel.title}
                                            </Typography>
                                        )}
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Добавить новую воронку
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField
                            label="Название воронки"
                            fullWidth
                            size="small"
                            value={newFunnelTitle}
                            onChange={(event) => setNewFunnelTitle(event.target.value)}
                            disabled={isCreatingFunnel || Boolean(pendingFunnelId)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateFunnel}
                            disabled={
                                isCreatingFunnel || Boolean(pendingFunnelId) || !newFunnelTitle.trim()
                            }
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Добавить
                        </Button>
                    </Stack>
                </Box>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteBoard}
                    disabled={isAnyPending || !board?.id}
                    sx={{ mt: 4, alignSelf: 'flex-start' }}
                >
                    Удалить доску
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ManageBoardModal;
