import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const BoardModal = ({ open, onClose, onSubmit, initialData = {} }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({ title });
    };

    const handleClose = () => {
        setTitle('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Создать доску</DialogTitle>
            <DialogContent>
                <TextField
                    label="Название доски"
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

export default BoardModal;
