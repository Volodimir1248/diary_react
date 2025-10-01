import ActionTypes from '../../action-types';

const initialState = {
    boards: [],
    priorities: [],
    currentBoard: null,
    funnels: [],
    tasksByFunnel: {},
    isLoading: false,
    error: null,
};

const index = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_TASK_BOARDS_REQUEST:
        case ActionTypes.FETCH_TASK_BOARD_REQUEST:
        case ActionTypes.CREATE_TASK_BOARD_REQUEST:
        case ActionTypes.UPDATE_TASK_BOARD_REQUEST:
        case ActionTypes.DELETE_TASK_BOARD_REQUEST:
        case ActionTypes.CREATE_TASK_FUNNEL_REQUEST:
        case ActionTypes.UPDATE_TASK_FUNNEL_REQUEST:
        case ActionTypes.DELETE_TASK_FUNNEL_REQUEST:
        case ActionTypes.ADD_TASK_REQUEST:
        case ActionTypes.UPDATE_TASK_REQUEST:
            return { ...state, isLoading: true, error: null };

        case ActionTypes.FETCH_TASK_BOARDS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                boards: action.payload?.boards || [],
                priorities: action.payload?.priorities || [],
            };

        case ActionTypes.FETCH_TASK_BOARD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentBoard: action.payload.board,
                funnels: action.payload.funnels,
                tasksByFunnel: action.payload.tasksByFunnel,
            };

        case ActionTypes.CREATE_TASK_BOARD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                boards: [action.payload, ...state.boards],
                currentBoard: action.payload,
                funnels: [],
                tasksByFunnel: {},
            };

        case ActionTypes.UPDATE_TASK_BOARD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                boards: state.boards.map(board =>
                    board.id === action.payload.id ? action.payload : board
                ),
                currentBoard:
                    state.currentBoard?.id === action.payload.id ? action.payload : state.currentBoard,
            };

        case ActionTypes.DELETE_TASK_BOARD_SUCCESS: {
            const updatedBoards = state.boards.filter(board => board.id !== action.payload);
            const isCurrentDeleted = state.currentBoard?.id === action.payload;

            return {
                ...state,
                isLoading: false,
                boards: updatedBoards,
                currentBoard: isCurrentDeleted ? null : state.currentBoard,
                funnels: isCurrentDeleted ? [] : state.funnels,
                tasksByFunnel: isCurrentDeleted ? {} : state.tasksByFunnel,
            };
        }

        case ActionTypes.CREATE_TASK_FUNNEL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                funnels: [...state.funnels, action.payload],
                tasksByFunnel: { ...state.tasksByFunnel, [action.payload.id]: [] },
            };

        case ActionTypes.UPDATE_TASK_FUNNEL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                funnels: state.funnels.map(funnel =>
                    funnel.id === action.payload.id ? action.payload : funnel
                ),
            };

        case ActionTypes.DELETE_TASK_FUNNEL_SUCCESS: {
            const { [action.payload]: _removed, ...restTasks } = state.tasksByFunnel;
            return {
                ...state,
                isLoading: false,
                funnels: state.funnels.filter(funnel => funnel.id !== action.payload),
                tasksByFunnel: restTasks,
            };
        }

        case ActionTypes.ADD_TASK_SUCCESS: {
            const { funnelId, task } = action.payload;
            const currentTasks = state.tasksByFunnel[funnelId] || [];
            return {
                ...state,
                isLoading: false,
                tasksByFunnel: {
                    ...state.tasksByFunnel,
                    [funnelId]: [task, ...currentTasks],
                },
            };
        }

        case ActionTypes.UPDATE_TASK_SUCCESS: {
            const { funnelId, previousFunnelId, task } = action.payload;
            const sourceFunnelId = previousFunnelId ?? funnelId;
            const updatedTasksByFunnel = { ...state.tasksByFunnel };

            if (sourceFunnelId !== funnelId) {
                const sourceTasks = updatedTasksByFunnel[sourceFunnelId] || [];
                updatedTasksByFunnel[sourceFunnelId] = sourceTasks.filter(item => item.id !== task.id);
            }

            const destinationTasks = [...(updatedTasksByFunnel[funnelId] || [])];
            const existingIndex = destinationTasks.findIndex(item => item.id === task.id);

            if (existingIndex > -1) {
                destinationTasks[existingIndex] = task;
            } else {
                destinationTasks.unshift(task);
            }

            updatedTasksByFunnel[funnelId] = destinationTasks;

            return {
                ...state,
                isLoading: false,
                tasksByFunnel: updatedTasksByFunnel,
            };
        }

        case ActionTypes.REORDER_TASKS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasksByFunnel: action.payload.tasksByFunnel,
            };

        case ActionTypes.FETCH_TASK_BOARDS_FAILURE:
        case ActionTypes.FETCH_TASK_BOARD_FAILURE:
        case ActionTypes.CREATE_TASK_BOARD_FAILURE:
        case ActionTypes.UPDATE_TASK_BOARD_FAILURE:
        case ActionTypes.DELETE_TASK_BOARD_FAILURE:
        case ActionTypes.CREATE_TASK_FUNNEL_FAILURE:
        case ActionTypes.UPDATE_TASK_FUNNEL_FAILURE:
        case ActionTypes.DELETE_TASK_FUNNEL_FAILURE:
        case ActionTypes.ADD_TASK_FAILURE:
        case ActionTypes.UPDATE_TASK_FAILURE:
        case ActionTypes.REORDER_TASKS_FAILURE:
            return { ...state, isLoading: false, error: action.error };

        default:
            return state;
    }
};

export default index;
