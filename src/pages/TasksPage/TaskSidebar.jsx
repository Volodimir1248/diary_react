import React from 'react';
import { Box, Button, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskSidebar = ({ lists, selectedListId, onSelectList, onOpenModal }) => (
    <Box>
        <Typography variant="subtitle1" gutterBottom>
            Списки задач
        </Typography>
        <List>
            {lists.map((list) => (
                <ListItemButton
                    key={list.id}
                    selected={selectedListId === list.id}
                    onClick={() => onSelectList(list.id)}
                    sx={{ borderRadius: 1, mb: 1 }}
                >
                    <ListItemText
                        primary={list.title}
                        secondary={list.is_completed ? 'Завершён' : 'Активен'}
                    />
                </ListItemButton>
            ))}
        </List>
        <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={onOpenModal} fullWidth startIcon={<AddIcon />}>
                Новый список
            </Button>
        </Box>
    </Box>
);

export default TaskSidebar;
