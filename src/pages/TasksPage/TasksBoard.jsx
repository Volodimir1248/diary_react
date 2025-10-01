import React from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const wrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
};

const boardStyles = {
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    overflowX: 'auto',
    overflowY: 'auto',
    width: '100%',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'grey.100',
    boxShadow: 3,
    gap: 0,
    minHeight: 0,
};

const columnStyles = {
    minWidth: 300,
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    position: 'relative',
    minHeight: 0,
    transition: 'box-shadow 0.2s ease',
    '@media (max-width: 350px)': {
        minWidth: 250,
        flex: '1 1 250px',
    },
};

const columnHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 2,
    py: 1.5,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'grey.50',
    position: 'sticky',
    top: 0,
    zIndex: 1,
};

const droppableStyles = (isDraggingOver) => ({
    flex: 1,
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    overflowY: 'visible',
    px: '5px',
    py: '5px',
    backgroundColor: isDraggingOver ? 'action.hover' : 'transparent',
    transition: 'background-color 0.2s ease',
});

const taskCardStyles = (isDragging) => ({
    borderRadius: 1,
    boxShadow: isDragging ? 6 : 1,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    bgcolor: 'grey.100',
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
    '&:hover': {
        boxShadow: 4,
    },
});

const taskPriorityIndicatorStyles = (color) => ({
    width: '5px',
    backgroundColor: color || 'transparent',
    flexShrink: 0,
    height: '100%',
});

const taskContentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
    p: 1.25,
};

const colorPropertyKeys = ['color', 'color_hex', 'colorHex', 'hex', 'hex_color', 'hexColor', 'value'];

const normalizeColorValue = (value) => {
    if (!value) {
        return '';
    }

    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) {
        return '';
    }

    if (/^#/.test(raw) || /^(rgb|hsl)a?\(/i.test(raw)) {
        return raw;
    }

    if (/^[0-9a-f]{3,8}$/i.test(raw)) {
        return `#${raw}`;
    }

    return raw;
};

const resolveColorFromObject = (source) => {
    if (!source || typeof source !== 'object') {
        return '';
    }

    for (const key of colorPropertyKeys) {
        const candidate = normalizeColorValue(source[key]);
        if (candidate) {
            return candidate;
        }
    }

    return '';
};

const getTaskPriorityColor = (task, priorities = []) => {
    if (!task) {
        return 'transparent';
    }

    const directColor = normalizeColorValue(task.priority_color || task.priorityColor);
    if (directColor) {
        return directColor;
    }

    const nestedColor = resolveColorFromObject(task.priority);
    if (nestedColor) {
        return nestedColor;
    }

    const priorityId =
        task.priority || task.priorityId || task.priority?.id || task.priority?.priority;

    if (!priorityId) {
        return 'transparent';
    }

    const priority = priorities.find((item) => String(item.id) === String(priorityId));
    const priorityColor = resolveColorFromObject(priority);

    return priorityColor || 'transparent';
};

const addTaskButtonStyles = {
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 1.25,
    width: '100%',
    height: 40,
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 0,
    border: '1px dashed',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    color: 'text.secondary',
    transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
    textTransform: 'none',
    '& .add-task-label': {
        opacity: 0,
        maxWidth: 0,
        overflow: 'hidden',
        transition: 'opacity 0.2s ease, max-width 0.2s ease',
    },
    '&:hover': {
        color: 'primary.main',
        borderColor: 'primary.light',
        bgcolor: 'grey.100',
    },
    '&:hover .add-task-label': {
        opacity: 1,
        maxWidth: 160,
    },
    '&:focus-visible .add-task-label': {
        opacity: 1,
        maxWidth: 160,
    },
};

const TasksBoard = ({
    board,
    funnels,
    tasksByFunnel,
    onAddTask,
    onOpenTask,
    onDragEnd,
    priorities = [],
    onManageBoard,
}) => {
    const isTouchDevice = React.useMemo(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const nav = typeof navigator !== 'undefined' ? navigator : undefined;

        return (
            'ontouchstart' in window ||
            (nav?.maxTouchPoints ?? 0) > 0 ||
            (nav?.msMaxTouchPoints ?? 0) > 0
        );
    }, []);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        if (
            result.source.droppableId === result.destination.droppableId &&
            result.source.index === result.destination.index
        ) {
            return;
        }
        onDragEnd(result);
    };

    return (
        <Box sx={wrapperStyles}>
            <Box sx={{ px: 2, pb: 2 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1.5}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ flex: 1, minWidth: 0 }}
                        noWrap
                    >
                        {board?.title || 'Задачи'}
                    </Typography>
                    {board && (
                        <Button
                            startIcon={<SettingsIcon fontSize="small" />}
                            variant="outlined"
                            size="small"
                            onClick={() => onManageBoard?.(board)}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Редактировать
                        </Button>
                    )}
                </Stack>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Box sx={boardStyles}>
                    {funnels.map((funnel) => {
                        const tasks = tasksByFunnel?.[funnel.id] || [];
                        return (
                            <Box
                                key={funnel.id}
                                sx={{
                                    ...columnStyles,
                                    '&:last-of-type': { borderRight: 'none' },
                                    '&:hover .add-task-label': {
                                        opacity: 1,
                                        maxWidth: 160,
                                    },
                                    '&:hover .add-task-button': {
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                <Box sx={columnHeaderStyles}>
                                    <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
                                        {funnel.title}
                                    </Typography>
                                </Box>

                                <Droppable droppableId={String(funnel.id)}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={droppableStyles(snapshot.isDraggingOver)}
                                        >
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                    {(dragProvided, dragSnapshot) => (
                                                        <Paper
                                                            ref={dragProvided.innerRef}
                                                            {...dragProvided.draggableProps}
                                                            {...dragProvided.dragHandleProps}
                                                            sx={taskCardStyles(dragSnapshot.isDragging)}
                                                            onDoubleClick={() => onOpenTask(funnel, task)}
                                                            onClick={(event) => {
                                                                if (dragSnapshot.isDragging) {
                                                                    return;
                                                                }

                                                                if (event.detail >= 2 || isTouchDevice) {
                                                                    event.preventDefault();
                                                                    onOpenTask(funnel, task);
                                                                }
                                                            }}
                                                        >
                                                            <Box sx={taskPriorityIndicatorStyles(getTaskPriorityColor(task, priorities))} />
                                                            <Box sx={taskContentStyles}>
                                                                <Typography variant="subtitle2" fontWeight={600}>
                                                                    {task.title}
                                                                </Typography>
                                                                {task.description && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {task.description}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Paper>
                                                    )}
                                                </Draggable>
                                            ))}
                                            <Button
                                                size="small"
                                                variant="text"
                                                onClick={() => onAddTask(funnel)}
                                                sx={addTaskButtonStyles}
                                                className="add-task-button"
                                                aria-label="Добавить задачу"
                                            >
                                                <AddIcon fontSize="small" />
                                                <Typography component="span" variant="body2" className="add-task-label">
                                                    Новая задача
                                                </Typography>
                                            </Button>
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        );
                    })}
                </Box>
            </DragDropContext>

            {funnels.length === 0 && (
                <Typography variant="body1" color="text.secondary" mt={4}>
                    Добавьте первую воронку, чтобы начать планировать задачи.
                </Typography>
            )}
        </Box>
    );
};

export default TasksBoard;
