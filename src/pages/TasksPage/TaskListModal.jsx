import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const TaskListModal = ({ open, onClose, onCreate }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) return;
        onCreate({ title });
        setTitle('');
    };

    const handleClose = () => {
        setTitle('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Создать новый список</DialogTitle>
            <DialogContent>
                <TextField
                    label="Название списка"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Создать
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskListModal;
