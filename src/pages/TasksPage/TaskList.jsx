import React from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TaskList = ({ list, tasks, onAddTask }) => {
    const activeTasks = tasks.filter((task) => !task.is_completed);
    const completedTasks = tasks.filter((task) => task.is_completed);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{list.title}</Typography>
                <Button variant="outlined" color="primary" onClick={onAddTask} startIcon={<AddIcon />}>
                    Добавить задачу
                </Button>
            </Box>
            <List>
                {activeTasks.map((task) => (
                    <ListItem key={task.id} sx={{ gap: 1 }}>
                        <RadioButtonUncheckedIcon fontSize="small" />
                        <ListItemText primary={task.title} secondary={task.description} />
                    </ListItem>
                ))}
            </List>
            {completedTasks.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Завершенные
                    </Typography>
                    <List>
                        {completedTasks.map((task) => (
                            <ListItem key={task.id} sx={{ gap: 1 }}>
                                <CheckCircleIcon color="primary" fontSize="small" />
                                <ListItemText
                                    primaryTypographyProps={{ sx: { textDecoration: 'line-through' } }}
                                    secondaryTypographyProps={{ sx: { textDecoration: 'line-through' } }}
                                    primary={task.title}
                                    secondary={task.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default TaskList;
