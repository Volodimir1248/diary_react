import React from 'react';
import { Box, Button, Paper } from '@mui/material';

const NoteItem = ({ color, onDelete, onEdit, children }) => (
    <Paper
        sx={{
            p: 2,
            position: 'relative',
            transition: 'box-shadow 0.3s',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1],
            backgroundColor: color,
            '&:hover': {
                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            },
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Button variant="text" size="small" color="inherit" onClick={onEdit} sx={{ color: 'text.secondary' }}>
                ✏️ Редактировать
            </Button>
            <Button variant="text" size="small" color="inherit" onClick={onDelete} sx={{ color: 'text.secondary' }}>
                ❌ Удалить
            </Button>
        </Box>
        {children}
    </Paper>
);

export default NoteItem;
