import ActionTypes from '../../action-types';
import { http } from '../../../helpers';
import { toast } from 'react-toastify';
import { fetchTaskBoard } from './fetchTaskBoardAction';

export const reorderTasks = (boardId, source, destination) => async (dispatch, getState) => {
    const state = getState();
    const currentTasksByFunnel = state.tasks.tasksByFunnel || {};
    const sourceFunnelId = String(source.droppableId);
    const destinationFunnelId = String(destination.droppableId);

    const sourceTasks = Array.from(currentTasksByFunnel[sourceFunnelId] || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (!movedTask) {
        return;
    }

    const destinationTasks =
        sourceFunnelId === destinationFunnelId
            ? sourceTasks
            : Array.from(currentTasksByFunnel[destinationFunnelId] || []);

    destinationTasks.splice(destination.index, 0, movedTask);

    const updatedTasksByFunnel = {
        ...currentTasksByFunnel,
        [sourceFunnelId]: sourceFunnelId === destinationFunnelId ? destinationTasks : sourceTasks,
        [destinationFunnelId]: destinationTasks,
    };

    dispatch({
        type: ActionTypes.REORDER_TASKS_SUCCESS,
        payload: { tasksByFunnel: updatedTasksByFunnel },
    });

    try {
        await http.patch(`/tasks/boards/${boardId}/tasks/reorder`, {
            source_funnel_id: Number(sourceFunnelId),
            destination_funnel_id: Number(destinationFunnelId),
            source_task_ids: (updatedTasksByFunnel[sourceFunnelId] || []).map(task => task.id),
            destination_task_ids: (updatedTasksByFunnel[destinationFunnelId] || []).map(task => task.id),
            moved_task_id: movedTask?.id,
        });

        // dispatch(fetchTaskBoard(boardId));
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({
            type: ActionTypes.REORDER_TASKS_FAILURE,
            error: message,
        });
        toast.error(message);
        dispatch(fetchTaskBoard(boardId));
    }
};
