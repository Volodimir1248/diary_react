import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

import BoardModal from './BoardModal';
import ManageBoardModal from './ManageBoardModal';
import TaskModal from './TaskModal';
import TasksBoard from './TasksBoard';
import { fetchTaskBoards } from '../../store/actions/tasks/fetchTaskBoardsAction';
import { fetchTaskBoard } from '../../store/actions/tasks/fetchTaskBoardAction';
import { createTaskBoard } from '../../store/actions/tasks/createTaskBoardAction';
import { updateTaskBoard } from '../../store/actions/tasks/updateTaskBoardAction';
import { deleteTaskBoard } from '../../store/actions/tasks/deleteTaskBoardAction';
import { createTaskFunnel } from '../../store/actions/tasks/createTaskFunnelAction';
import { updateTaskFunnel } from '../../store/actions/tasks/updateTaskFunnelAction';
import { deleteTaskFunnel } from '../../store/actions/tasks/deleteTaskFunnelAction';
import { addTask } from '../../store/actions/tasks/addTaskAction';
import { updateTask } from '../../store/actions/tasks/updateTaskAction';
import { reorderTasks } from '../../store/actions/tasks/reorderTasksAction';

const TaskPage = () => {
    const dispatch = useDispatch();
    const { boards, currentBoard, funnels, tasksByFunnel, priorities, isLoading } = useSelector((state) => state.tasks);

    const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
    const [isManageBoardModalOpen, setIsManageBoardModalOpen] = useState(false);
    const [boardToManage, setBoardToManage] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskFunnelId, setTaskFunnelId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchTaskBoards());
    }, [dispatch]);

    useEffect(() => {
        if (boards.length > 0 && !currentBoard) {
            dispatch(fetchTaskBoard(boards[0].id));
        }
    }, [boards, currentBoard, dispatch]);

    useEffect(() => {
        setSearchQuery('');
    }, [currentBoard?.id]);

    const handleBoardChange = (event) => {
        const boardId = event.target.value;
        if (boardId) {
            dispatch(fetchTaskBoard(boardId));
        }
    };

    const handleOpenCreateBoardModal = () => {
        setIsCreateBoardModalOpen(true);
    };

    const handleOpenManageBoardModal = (board = null) => {
        const targetBoard = board || currentBoard;
        if (!targetBoard) {
            return;
        }
        setBoardToManage(targetBoard);
        setIsManageBoardModalOpen(true);
    };

    const handleCreateBoard = async (values) => {
        try {
            const createdBoard = await dispatch(createTaskBoard(values));
            if (createdBoard?.id) {
                setBoardToManage({ ...createdBoard, title: values.title });
                await dispatch(fetchTaskBoard(createdBoard.id));
                setIsManageBoardModalOpen(true);
            }
        } finally {
            setIsCreateBoardModalOpen(false);
        }
    };

    const handleUpdateBoard = async (boardId, payload) => {
        if (!boardId) return null;

        const updatedBoard = await dispatch(updateTaskBoard(boardId, payload));
        if (updatedBoard?.id === currentBoard?.id) {
            await dispatch(fetchTaskBoard(updatedBoard.id));
        }
        setBoardToManage((prev) =>
            prev && String(prev.id) === String(boardId) ? { ...prev, ...updatedBoard } : prev
        );
        return updatedBoard;
    };

    const handleDeleteBoard = async (boardId) => {
        const targetId = boardId || boardToManage?.id || currentBoard?.id;
        if (!targetId) {
            return;
        }

        const boardTitle = boards.find((board) => String(board.id) === String(targetId))?.title;
        const confirmed = window.confirm(
            boardTitle ? `Удалить доску «${boardTitle}»?` : 'Удалить выбранную доску?'
        );

        if (!confirmed) {
            return;
        }

        await dispatch(deleteTaskBoard(targetId));
        setIsManageBoardModalOpen(false);
        setBoardToManage(null);
        dispatch(fetchTaskBoards());
    };

    const handleCreateFunnel = async (values) => {
        const targetBoardId = boardToManage?.id || currentBoard?.id;
        if (!targetBoardId) return;
        await dispatch(createTaskFunnel(targetBoardId, values));
    };

    const handleUpdateFunnel = async (funnelId, values) => {
        const targetBoardId = boardToManage?.id || currentBoard?.id;
        if (!targetBoardId) return;
        await dispatch(updateTaskFunnel(targetBoardId, funnelId, values));
    };

    const handleDeleteFunnel = async (funnelId) => {
        const targetBoardId = boardToManage?.id || currentBoard?.id;
        if (!targetBoardId) return;
        await dispatch(deleteTaskFunnel(targetBoardId, funnelId));
    };

    const handleAddTask = (funnel) => {
        setTaskToEdit(null);
        setTaskFunnelId(funnel.id);
        setIsTaskModalOpen(true);
    };

    const handleOpenTask = (funnel, task) => {
        setTaskToEdit(task);
        setTaskFunnelId(funnel.id);
        setIsTaskModalOpen(true);
    };

    const handleSubmitTask = async (values) => {
        if (!currentBoard) return;
        try {
            if (taskToEdit) {
                const previousFunnelId = taskToEdit.funnel_id || taskToEdit.funnelId || taskFunnelId;
                await dispatch(
                    updateTask(
                        taskToEdit.id,
                        values.funnelId,
                        {
                            title: values.title,
                            description: values.description,
                            priority: values.priorityId ? Number(values.priorityId) : 2,
                            reminder_at: values.reminderAt || null,
                        },
                        previousFunnelId
                    )
                );
            } else {
                await dispatch(
                    addTask(currentBoard.id, values.funnelId, {
                        title: values.title,
                        description: values.description,
                        priority: values.priorityId ? Number(values.priorityId) : 2,
                        reminder_at: values.reminderAt || null,
                    })
                );
            }
        } finally {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
            setTaskFunnelId('');
        }
    };

    const handleDragEnd = (result) => {
        if (!currentBoard || !result.destination) return;
        dispatch(reorderTasks(currentBoard.id, result.source, result.destination));
    };

    const boardSelectValue = currentBoard?.id || '';

    const filteredTasksByFunnel = useMemo(() => {
        if (!searchQuery.trim()) {
            return tasksByFunnel;
        }

        const query = searchQuery.trim().toLowerCase();
        return Object.keys(tasksByFunnel || {}).reduce((acc, funnelId) => {
            const tasks = tasksByFunnel[funnelId] || [];
            acc[funnelId] = tasks.filter((task) => {
                const title = task.title || '';
                const description = task.description || '';
                return (
                    title.toLowerCase().includes(query) ||
                    description.toLowerCase().includes(query)
                );
            });
            return acc;
        }, {});
    }, [tasksByFunnel, searchQuery]);

    const managedBoard = useMemo(() => {
        if (boardToManage && currentBoard?.id) {
            return String(currentBoard.id) === String(boardToManage.id) ? currentBoard : boardToManage;
        }
        return boardToManage || currentBoard;
    }, [boardToManage, currentBoard]);

    return (
        <Box sx={{ mx: 'auto', p: { xs: 2, sm: 3 }, height: '100%' }}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', flex: 1, minHeight: '70vh' }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ width: '100%' }}
                >
                    <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: 0 }}>
                        <InputLabel id="task-board-select">Выберите доску</InputLabel>
                        <Select
                            labelId="task-board-select"
                            label="Выберите доску"
                            value={boardSelectValue}
                            onChange={handleBoardChange}
                            displayEmpty
                        >
                            {boards.length === 0 && (
                                <MenuItem value="" disabled>
                                    Нет доступных досок
                                </MenuItem>
                            )}
                            {boards.map((board) => (
                                <MenuItem key={board.id} value={board.id}>
                                    {board.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenCreateBoardModal}
                            size="small"
                            sx={{ height: 40, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}
                        >
                            Новая доска
                        </Button>
                    </Stack>
                </Stack>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Поиск по задачам"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    sx={{ mt: 3 }}
                    InputProps={{
                        endAdornment:
                            searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'error.main' }}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                    }}
                />

                <Box
                    mt={4}
                    position="relative"
                    sx={{
                        mx: { xs: -2, sm: -3 },
                        flex: 1,
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {isLoading && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            zIndex={1}
                            bgcolor="rgba(255,255,255,0.6)"
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    {currentBoard ? (
                        <TasksBoard
                            board={currentBoard}
                            funnels={funnels}
                            tasksByFunnel={filteredTasksByFunnel}
                            onAddTask={handleAddTask}
                            onOpenTask={handleOpenTask}
                            onDragEnd={handleDragEnd}
                            priorities={priorities}
                            onManageBoard={handleOpenManageBoardModal}
                        />
                    ) : (
                        <Typography variant="subtitle1" color="text.secondary">
                            {boards.length === 0
                                ? 'Создайте первую доску, чтобы начать работу с задачами.'
                                : 'Выберите доску для отображения задач.'}
                        </Typography>
                    )}
                </Box>
            </Paper>

            <BoardModal
                open={isCreateBoardModalOpen}
                onClose={() => {
                    setIsCreateBoardModalOpen(false);
                }}
                onSubmit={handleCreateBoard}
            />

            <ManageBoardModal
                open={isManageBoardModalOpen}
                onClose={() => {
                    setIsManageBoardModalOpen(false);
                    setBoardToManage(null);
                }}
                board={managedBoard}
                funnels={
                    managedBoard && currentBoard?.id && String(currentBoard.id) === String(managedBoard.id)
                        ? funnels
                        : []
                }
                onUpdateBoard={handleUpdateBoard}
                onCreateFunnel={handleCreateFunnel}
                onUpdateFunnel={handleUpdateFunnel}
                onDeleteFunnel={handleDeleteFunnel}
                onDeleteBoard={handleDeleteBoard}
            />

            <TaskModal
                open={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setTaskToEdit(null);
                    setTaskFunnelId('');
                }}
                onSubmit={handleSubmitTask}
                funnels={funnels}
                initialData={taskToEdit}
                defaultFunnelId={taskFunnelId}
                priorities={priorities}
            />
        </Box>
    );
};

export default TaskPage;
